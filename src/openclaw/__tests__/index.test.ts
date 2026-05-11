/**
 * Tests for OpenClaw public API (wakeOpenClaw)
 * Uses node:test and node:assert/strict
 */

import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("wakeOpenClaw", () => {
  let tmpDir: string;
  let originalEnv: NodeJS.ProcessEnv;
  let originalFetch: typeof globalThis.fetch | undefined;

  beforeEach(() => {
    originalEnv = { ...process.env };
    originalFetch = globalThis.fetch;
    tmpDir = join(tmpdir(), `rcs-openclaw-index-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    for (const [key, val] of Object.entries(originalEnv)) {
      process.env[key] = val;
    }
    if (originalFetch) globalThis.fetch = originalFetch;
    else delete (globalThis as { fetch?: typeof globalThis.fetch }).fetch;
    try { rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  it("returns null when RCS_OPENCLAW is not set", async () => {
    delete process.env.RCS_OPENCLAW;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    const result = await wakeOpenClaw("session-start", {});
    assert.equal(result, null);
  });

  it("returns null when config is not found", async () => {
    process.env.RCS_OPENCLAW = "1";
    process.env.RCS_OPENCLAW_CONFIG = join(tmpDir, "nonexistent.json");
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    const result = await wakeOpenClaw("session-start", {});
    assert.equal(result, null);
  });

  it("returns null when event is not mapped", async () => {
    process.env.RCS_OPENCLAW = "1";
    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: "https://example.com/hook" } },
      hooks: {
        // session-start not mapped
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    const result = await wakeOpenClaw("session-start", {});
    assert.equal(result, null);
  });

  it("returns null and does not throw on invalid HTTP URL", async () => {
    process.env.RCS_OPENCLAW = "1";
    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: "http://bad-remote.example.com/hook" } },
      hooks: {
        "session-start": { gateway: "gw", instruction: "hello", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    // Should return a result (with success: false) rather than null, or null
    // Either way, it must not throw
    let threw = false;
    try {
      await wakeOpenClaw("session-start", { sessionId: "test-123" });
    } catch {
      threw = true;
    }
    assert.equal(threw, false);
  });

  it("returns result with success:false for disabled command gateway", async () => {
    process.env.RCS_OPENCLAW = "1";
    delete process.env.RCS_OPENCLAW_COMMAND;
    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { cmd: { type: "command", command: "echo hello" } },
      hooks: {
        "stop": { gateway: "cmd", instruction: "Stopped", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    const result = await wakeOpenClaw("stop", { projectPath: "/some/project" });
    // Should return a result, not null (gateway was found but command gate blocked)
    assert.ok(result !== null);
    assert.equal(result!.success, false);
    assert.ok(result!.error?.includes("RCS_OPENCLAW_COMMAND"));
  });

  it("does not auto-capture tmux history for stop/session-end events without explicit tmuxTail", async () => {
    process.env.RCS_OPENCLAW = "1";
    process.env.TMUX = "/tmp/tmux-1000/default,12345,0";
    process.env.TMUX_PANE = "%42";

    for (const eventName of ["stop", "session-end"] as const) {
      let capturedBody = "";
      globalThis.fetch = (async (_input, init) => {
        capturedBody = String(init?.body ?? "");
        return new Response(null, { status: 200 });
      }) as typeof globalThis.fetch;

      const configPath = join(tmpDir, `openclaw-${eventName}.json`);
      writeFileSync(configPath, JSON.stringify({
        enabled: true,
        gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
        hooks: {
          [eventName]: { gateway: "gw", instruction: "Event", enabled: true },
        },
      }));
      process.env.RCS_OPENCLAW_CONFIG = configPath;
      const { wakeOpenClaw } = await import("../index.js");
      const { resetOpenClawConfigCache } = await import("../config.js");
      resetOpenClawConfigCache();

      const result = await wakeOpenClaw(eventName, { projectPath: "/some/project" });

      assert.ok(result !== null);
      assert.equal(result!.success, true);

      const payload = JSON.parse(capturedBody) as { tmuxTail?: string };
      assert.equal(payload.tmuxTail, undefined);
    }
  });

  it("includes channel/to/threadId in HTTP payload when OPENCLAW_REPLY_* env vars set", async () => {
    process.env.RCS_OPENCLAW = "1";
    process.env.OPENCLAW_REPLY_CHANNEL = "#general";
    process.env.OPENCLAW_REPLY_TARGET = "user42";
    process.env.OPENCLAW_REPLY_THREAD = "thread-abc";

    let capturedBody = "";
    globalThis.fetch = (async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof globalThis.fetch;

    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
      hooks: {
        "session-start": { gateway: "gw", instruction: "hello", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();

    const result = await wakeOpenClaw("session-start", { sessionId: "s1" });

    assert.ok(result !== null);
    assert.equal(result!.success, true);

    const parsed = JSON.parse(capturedBody);
    assert.equal(parsed.channel, "#general");
    assert.equal(parsed.to, "user42");
    assert.equal(parsed.threadId, "thread-abc");
    // Also in whitelisted context
    assert.equal(parsed.context.replyChannel, "#general");
    assert.equal(parsed.context.replyTarget, "user42");
    assert.equal(parsed.context.replyThread, "thread-abc");
  });

  it("omits channel/to/threadId from HTTP payload when env vars not set", async () => {
    process.env.RCS_OPENCLAW = "1";
    delete process.env.OPENCLAW_REPLY_CHANNEL;
    delete process.env.OPENCLAW_REPLY_TARGET;
    delete process.env.OPENCLAW_REPLY_THREAD;

    let capturedBody = "";
    globalThis.fetch = (async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof globalThis.fetch;

    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
      hooks: {
        "session-start": { gateway: "gw", instruction: "hello", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();

    const result = await wakeOpenClaw("session-start", { sessionId: "s1" });

    assert.ok(result !== null);
    assert.equal(result!.success, true);

    const parsed = JSON.parse(capturedBody);
    assert.equal(parsed.channel, undefined, "channel should be absent");
    assert.equal(parsed.to, undefined, "to should be absent");
    assert.equal(parsed.threadId, undefined, "threadId should be absent");
    assert.equal(parsed.context.replyChannel, undefined);
    assert.equal(parsed.context.replyTarget, undefined);
    assert.equal(parsed.context.replyThread, undefined);
  });

  it("context.replyChannel takes precedence over env var", async () => {
    process.env.RCS_OPENCLAW = "1";
    process.env.OPENCLAW_REPLY_CHANNEL = "env-channel";

    let capturedBody = "";
    globalThis.fetch = (async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof globalThis.fetch;

    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
      hooks: {
        "session-start": { gateway: "gw", instruction: "hello", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();

    const result = await wakeOpenClaw("session-start", {
      sessionId: "s1",
      replyChannel: "ctx-channel",
    });

    assert.ok(result !== null);
    const parsed = JSON.parse(capturedBody);
    assert.equal(parsed.channel, "ctx-channel", "context value should win over env var");
    assert.equal(parsed.context.replyChannel, "ctx-channel");
  });

  it("includes text field as alias of instruction in HTTP payload", async () => {
    process.env.RCS_OPENCLAW = "1";
    delete process.env.OPENCLAW_REPLY_CHANNEL;
    delete process.env.OPENCLAW_REPLY_TARGET;
    delete process.env.OPENCLAW_REPLY_THREAD;

    let capturedBody = "";
    globalThis.fetch = (async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof globalThis.fetch;

    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
      hooks: {
        "session-start": { gateway: "gw", instruction: "do the thing", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();

    const result = await wakeOpenClaw("session-start", { sessionId: "s1" });

    assert.ok(result !== null);
    assert.equal(result!.success, true);

    const parsed = JSON.parse(capturedBody);
    assert.equal(parsed.instruction, "do the thing");
    assert.equal(parsed.text, "do the thing", "text should be an alias of instruction");
    assert.equal(parsed.text, parsed.instruction, "text and instruction must be identical");
  });

  it("succeeds with command gateway when both env vars set", async () => {
    process.env.RCS_OPENCLAW = "1";
    process.env.RCS_OPENCLAW_COMMAND = "1";
    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { cmd: { type: "command", command: "true" } },
      hooks: {
        "session-end": { gateway: "cmd", instruction: "Ended", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();
    const result = await wakeOpenClaw("session-end", { projectPath: "/some/project" });
    assert.ok(result !== null);
    assert.equal(result!.success, true);
  });

  it("sanitizes metadata-only tmuxTail provided by callers while preserving failure text", async () => {
    process.env.RCS_OPENCLAW = "1";
    delete process.env.OPENCLAW_REPLY_CHANNEL;
    delete process.env.OPENCLAW_REPLY_TARGET;
    delete process.env.OPENCLAW_REPLY_THREAD;

    let capturedBody = "";
    globalThis.fetch = (async (_input, init) => {
      capturedBody = String(init?.body ?? "");
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof globalThis.fetch;

    const configPath = join(tmpDir, "openclaw.json");
    writeFileSync(configPath, JSON.stringify({
      enabled: true,
      gateways: { gw: { type: "http", url: `http://127.0.0.1/hook` } },
      hooks: {
        "session-end": { gateway: "gw", instruction: "Ended", enabled: true },
      },
    }));
    process.env.RCS_OPENCLAW_CONFIG = configPath;
    const { wakeOpenClaw } = await import("../index.js");
    const { resetOpenClawConfigCache } = await import("../config.js");
    resetOpenClawConfigCache();

    const result = await wakeOpenClaw("session-end", {
      sessionId: "s1",
      tmuxTail: [
        "fix/issue-1525-post-stop-keyword-replay | forge:2/50 | turns:4 | session:1m | last:5s ago",
        "stderr: Error: test suite failed",
      ].join("\n"),
    });

    assert.ok(result !== null);
    assert.equal(result!.success, true);
    const parsed = JSON.parse(capturedBody);
    assert.equal(parsed.tmuxTail, "stderr: Error: test suite failed");
    assert.equal(parsed.context.tmuxTail, "stderr: Error: test suite failed");
  });
});
