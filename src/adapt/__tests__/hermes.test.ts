import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildAdaptDoctorReportForTarget,
  buildAdaptEnvelopeForTarget,
  buildAdaptProbeReportForTarget,
  buildAdaptStatusReportForTarget,
  initAdaptFoundationForTarget,
} from "../index.js";

let tempDir: string;
let hermesRoot: string;
let hermesHome: string;
let processCwdFixtureBase: string;
let processCwdFixtureRoot: string;
let suppliedCwd: string;
let originalCwd: string;
const originalEnv = {
  root: process.env.RCS_ADAPT_HERMES_ROOT,
  home: process.env.HERMES_HOME,
};

function writeHermesFixture(options: {
  withRoot?: boolean;
  withGatewayRuntime?: boolean;
  withStateDb?: boolean;
} = {}): void {
  const {
    withRoot = true,
    withGatewayRuntime = false,
    withStateDb = false,
  } = options;

  if (withRoot) {
    mkdirSync(join(hermesRoot, "acp_adapter"), { recursive: true });
    mkdirSync(join(hermesRoot, "gateway"), { recursive: true });
    mkdirSync(join(hermesRoot, "docs"), { recursive: true });
    mkdirSync(join(hermesRoot, "acp_registry"), { recursive: true });
    writeFileSync(join(hermesRoot, "acp_adapter", "server.py"), "# acp server\n");
    writeFileSync(join(hermesRoot, "acp_adapter", "session.py"), "# acp session\n");
    writeFileSync(join(hermesRoot, "acp_adapter", "events.py"), "# acp events\n");
    writeFileSync(join(hermesRoot, "acp_adapter", "entry.py"), "# acp entry\n");
    writeFileSync(join(hermesRoot, "gateway", "status.py"), "# gateway status\n");
    writeFileSync(join(hermesRoot, "gateway", "hooks.py"), "# gateway hooks\n");
    writeFileSync(join(hermesRoot, "docs", "acp-setup.md"), "# acp setup\n");
    writeFileSync(join(hermesRoot, "hermes_state.py"), "# hermes state store\n");
  }

  if (withGatewayRuntime) {
    mkdirSync(hermesHome, { recursive: true });
    writeFileSync(
      join(hermesHome, "gateway.pid"),
      JSON.stringify({ pid: 1234, kind: "hermes-gateway", argv: ["hermes", "gateway"] }),
    );
    writeFileSync(
      join(hermesHome, "gateway_state.json"),
      JSON.stringify({
        gateway_state: "running",
        active_agents: 2,
        updated_at: "2026-04-14T14:00:00.000Z",
        platforms: {
          telegram: { state: "connected", updated_at: "2026-04-14T14:00:00.000Z" },
        },
      }),
    );
  }

  if (withStateDb) {
    mkdirSync(hermesHome, { recursive: true });
    writeFileSync(join(hermesHome, "state.db"), "SQLite format 3\u0000 sessions messages");
  }
}

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "rcs-adapt-hermes-"));
  suppliedCwd = join(tempDir, "sandbox", "worktree");
  hermesRoot = join(tempDir, "hermes-runtime");
  hermesHome = join(tempDir, "hermes-home");
  originalCwd = process.cwd();
  processCwdFixtureBase = await mkdtemp(join(tmpdir(), "rcs-adapt-hermes-process-cwd-"));
  processCwdFixtureRoot = join(
    processCwdFixtureBase,
    "hermes-codex-skill-rcs-aware-prd",
    "external",
    "hermes-agent",
  );
  process.env.RCS_ADAPT_HERMES_ROOT = hermesRoot;
  process.env.HERMES_HOME = hermesHome;
});

afterEach(async () => {
  if (originalEnv.root === undefined) {
    delete process.env.RCS_ADAPT_HERMES_ROOT;
  } else {
    process.env.RCS_ADAPT_HERMES_ROOT = originalEnv.root;
  }

  if (originalEnv.home === undefined) {
    delete process.env.HERMES_HOME;
  } else {
    process.env.HERMES_HOME = originalEnv.home;
  }

  process.chdir(originalCwd);

  if (processCwdFixtureBase && existsSync(processCwdFixtureBase)) {
    await rm(processCwdFixtureBase, { recursive: true, force: true });
  }

  if (tempDir && existsSync(tempDir)) {
    await rm(tempDir, { recursive: true, force: true });
  }
});

describe("hermes adapter integration", () => {
  it("degrades gracefully when Hermes runtime evidence is absent", async () => {
    const probe = await buildAdaptProbeReportForTarget(tempDir, "hermes", new Date("2026-04-14T00:00:00.000Z"));
    const status = await buildAdaptStatusReportForTarget(tempDir, "hermes", new Date("2026-04-14T00:00:00.000Z"));
    const doctor = await buildAdaptDoctorReportForTarget(tempDir, "hermes", new Date("2026-04-14T00:00:00.000Z"));

    assert.equal(probe.targetRuntime.state, "unavailable");
    assert.equal(status.targetRuntime.state, "unavailable");
    assert.match(doctor.issues.map((issue) => issue.code).join(","), /hermes_runtime_missing/);
  });

  it("anchors sibling-default Hermes discovery to the supplied cwd for programmatic probes", async () => {
    delete process.env.RCS_ADAPT_HERMES_ROOT;
    delete process.env.HERMES_HOME;

    mkdirSync(join(processCwdFixtureRoot, "acp_adapter"), { recursive: true });
    writeFileSync(join(processCwdFixtureRoot, "acp_adapter", "server.py"), "# unrelated sibling runtime\n");
    const unrelatedProcessCwd = join(processCwdFixtureBase, "workspace");
    mkdirSync(unrelatedProcessCwd, { recursive: true });
    process.chdir(unrelatedProcessCwd);

    const tempSiblingRoot = join(
      suppliedCwd,
      "..",
      "hermes-codex-skill-rcs-aware-prd",
      "external",
      "hermes-agent",
    );
    const probe = await buildAdaptProbeReportForTarget(suppliedCwd, "hermes", new Date("2026-04-14T00:00:00.000Z"));

    assert.equal(probe.targetRuntime.state, "unavailable");
    assert.equal(probe.targetRuntime.evidence?.hermesRoot, tempSiblingRoot);
    assert.notEqual(probe.targetRuntime.evidence?.hermesRoot, processCwdFixtureRoot);
    assert.match(probe.targetRuntime.detail, new RegExp(tempSiblingRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  it("reports Hermes capability evidence asymmetrically in the envelope", async () => {
    writeHermesFixture({ withRoot: true, withStateDb: true });
    const envelope = await buildAdaptEnvelopeForTarget(tempDir, "hermes", new Date("2026-04-14T00:00:00.000Z"));

    assert.equal(envelope.targetRuntime?.state, "degraded");
    assert.ok(envelope.bootstrap);
    assert.match(envelope.bootstrap?.summary ?? "", /bootstrap metadata/i);
    assert.deepEqual(
      [...new Set(envelope.capabilities.map((capability) => capability.ownership))].sort(),
      ["rcs-owned", "shared-contract", "target-observed"],
    );
    assert.equal(
      envelope.capabilities.find((capability) => capability.id === "persistent-session-observation")?.status,
      "ready",
    );
    assert.equal(
      envelope.capabilities.find((capability) => capability.id === "acp-envelope-bridge")?.status,
      "ready",
    );
  });

  it("synthesizes running status from Hermes gateway and session-store evidence", async () => {
    writeHermesFixture({ withRoot: true, withGatewayRuntime: true, withStateDb: true });
    const status = await buildAdaptStatusReportForTarget(tempDir, "hermes", new Date("2026-04-14T00:00:00.000Z"));

    assert.equal(status.targetRuntime.state, "running");
    assert.match(status.targetRuntime.detail, /connected platforms: telegram/i);
  });

  it("keeps Hermes init writes inside RCS-owned adapter paths", async () => {
    writeHermesFixture({ withRoot: true, withGatewayRuntime: true, withStateDb: true });
    const result = await initAdaptFoundationForTarget(tempDir, "hermes", true, new Date("2026-04-14T00:00:00.000Z"));

    assert.equal(result.write, true);
    assert.equal(result.wrotePaths.length, 2);
    assert.equal(existsSync(join(tempDir, ".rcs", "state")), false);
    assert.equal(existsSync(join(hermesHome, "gateway_state.json")), true);
    assert.equal(existsSync(join(hermesHome, "state.db")), true);

    const persistedEnvelope = JSON.parse(readFileSync(result.envelope.adapterPaths.envelopePath, "utf-8")) as {
      targetRuntime?: { state?: string };
      bootstrap?: { commands?: string[] };
    };
    assert.equal(persistedEnvelope.targetRuntime?.state, "running");
    assert.ok((persistedEnvelope.bootstrap?.commands ?? []).includes("hermes acp"));
  });
});
