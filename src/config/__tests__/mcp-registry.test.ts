import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  getUnifiedMcpRegistryCandidates,
  loadUnifiedMcpRegistry,
  planClaudeCodeMcpSettingsSync,
} from "../mcp-registry.js";

describe("unified MCP registry loader", () => {
  it("prefers ~/.rcs/mcp-registry.json over ~/.omc/mcp-registry.json", async () => {
    const wd = await mkdtemp(join(tmpdir(), "rcs-mcp-registry-"));
    try {
      const rcsPath = join(wd, ".rcs", "mcp-registry.json");
      const omcPath = join(wd, ".omc", "mcp-registry.json");
      await mkdir(join(wd, ".rcs"), { recursive: true });
      await mkdir(join(wd, ".omc"), { recursive: true });

      await writeFile(
        rcsPath,
        JSON.stringify({
          eslint: { command: "npx", args: ["@eslint/mcp@latest"], timeout: 11 },
        }),
      );
      await writeFile(
        omcPath,
        JSON.stringify({
          legacy_helper: { command: "legacy-helper", args: ["mcp"] },
        }),
      );

      const result = await loadUnifiedMcpRegistry({ homeDir: wd });
      assert.equal(result.sourcePath, rcsPath);
      assert.deepEqual(result.servers.map((server) => server.name), ["eslint"]);
      assert.equal(result.servers[0].startupTimeoutSec, 11);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it("loads a legacy registry when it is passed explicitly as a candidate", async () => {
    const wd = await mkdtemp(join(tmpdir(), "rcs-mcp-registry-"));
    try {
      const omcPath = join(wd, ".omc", "mcp-registry.json");
      await mkdir(join(wd, ".omc"), { recursive: true });
      await writeFile(
        omcPath,
        JSON.stringify({
          legacy_helper: { command: "legacy-helper", args: ["mcp"], enabled: false },
        }),
      );

      const result = await loadUnifiedMcpRegistry({ candidates: [omcPath] });
      assert.equal(result.sourcePath, omcPath);
      assert.equal(result.servers.length, 1);
      assert.equal(result.servers[0].name, "legacy_helper");
      assert.equal(result.servers[0].enabled, false);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it("skips invalid entries but keeps valid entries from the same file", async () => {
    const wd = await mkdtemp(join(tmpdir(), "rcs-mcp-registry-"));
    try {
      const registryPath = join(wd, "registry.json");
      await writeFile(
        registryPath,
        JSON.stringify({
          bad_type: "not-an-object",
          bad_args: { command: "npx", args: [1, 2, 3] },
          good: { command: "npx", args: ["@eslint/mcp@latest"], timeout: 7 },
        }),
      );

      const result = await loadUnifiedMcpRegistry({
        candidates: [registryPath],
      });
      assert.equal(result.servers.length, 1);
      assert.equal(result.servers[0].name, "good");
      assert.equal(result.servers[0].startupTimeoutSec, 7);
      assert.equal(result.warnings.length >= 2, true);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it("preserves string approval_mode values and warns on non-string ones", async () => {
    const wd = await mkdtemp(join(tmpdir(), "rcs-mcp-registry-"));
    try {
      const registryPath = join(wd, "registry.json");
      await writeFile(
        registryPath,
        JSON.stringify({
          eslint: {
            command: "npx",
            args: ["@eslint/mcp@latest"],
            approval_mode: "never",
          },
          invalid_mode: {
            command: "npx",
            args: ["@example/mcp"],
            approval_mode: 42,
          },
        }),
      );

      const result = await loadUnifiedMcpRegistry({
        candidates: [registryPath],
      });
      assert.equal(result.servers.length, 2);
      assert.deepEqual(result.servers[0], {
        name: "eslint",
        command: "npx",
        args: ["@eslint/mcp@latest"],
        enabled: true,
        approval_mode: "never",
        startupTimeoutSec: undefined,
      });
      assert.deepEqual(result.servers[1], {
        name: "invalid_mode",
        command: "npx",
        args: ["@example/mcp"],
        enabled: true,
        startupTimeoutSec: undefined,
      });
      assert.deepEqual(result.warnings, [
        'registry entry "invalid_mode" has non-string approval_mode; ignoring approval_mode',
      ]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it("returns canonical home-based registry candidates", () => {
    const candidates = getUnifiedMcpRegistryCandidates("/tmp/home");
    assert.deepEqual(candidates, ["/tmp/home/.rcs/mcp-registry.json"]);
  });
  it("plans Claude settings sync by adding only missing shared servers", () => {
    const plan = planClaudeCodeMcpSettingsSync(
      JSON.stringify(
        {
          theme: "dark",
          mcpServers: {
            existing_server: {
              command: "custom-existing-server",
              args: ["serve"],
              enabled: true,
            },
          },
        },
        null,
        2,
      ),
      [
        {
          name: "existing_server",
          command: "existing-server",
          args: ["mcp"],
          enabled: true,
        },
        {
          name: "eslint",
          command: "npx",
          args: ["@eslint/mcp@latest"],
          enabled: false,
          startupTimeoutSec: 9,
        },
      ],
    );

    assert.deepEqual(plan.added, ["eslint"]);
    assert.deepEqual(plan.unchanged, ["existing_server"]);
    assert.deepEqual(plan.warnings, []);

    const parsed = JSON.parse(plan.content ?? "{}") as {
      theme?: string;
      mcpServers?: Record<
        string,
        {
          command: string;
          args: string[];
          enabled: boolean;
          approval_mode?: string;
        }
      >;
    };
    assert.equal(parsed.theme, "dark");
    assert.deepEqual(parsed.mcpServers?.existing_server, {
      command: "custom-existing-server",
      args: ["serve"],
      enabled: true,
    });
    assert.deepEqual(parsed.mcpServers?.eslint, {
      command: "npx",
      args: ["@eslint/mcp@latest"],
      enabled: false,
    });
  });

  it("includes approval_mode when adding missing Claude MCP servers", () => {
    const plan = planClaudeCodeMcpSettingsSync(
      JSON.stringify({ mcpServers: {} }, null, 2),
      [
        {
          name: "eslint",
          command: "npx",
          args: ["@eslint/mcp@latest"],
          enabled: false,
          approval_mode: "never",
        },
      ],
    );

    const parsed = JSON.parse(plan.content ?? "{}") as {
      mcpServers?: Record<
        string,
        {
          command: string;
          args: string[];
          enabled: boolean;
          approval_mode?: string;
        }
      >;
    };

    assert.deepEqual(parsed.mcpServers?.eslint, {
      command: "npx",
      args: ["@eslint/mcp@latest"],
      enabled: false,
      approval_mode: "never",
    });
  });

  it('warns when Claude settings.json has a non-object "mcpServers" field', () => {
    const plan = planClaudeCodeMcpSettingsSync(
      JSON.stringify({ mcpServers: [] }),
      [
        {
          name: "eslint",
          command: "npx",
          args: ["@eslint/mcp@latest"],
          enabled: true,
        },
      ],
    );

    assert.equal(plan.content, undefined);
    assert.deepEqual(plan.added, []);
    assert.deepEqual(plan.unchanged, []);
    assert.match(plan.warnings[0] ?? "", /mcpServers/);
  });
});
