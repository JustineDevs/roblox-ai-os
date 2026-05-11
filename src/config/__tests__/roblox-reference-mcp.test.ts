import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getRobloxReferenceMcpServers } from "../roblox-reference-mcp.js";
import { buildMergedConfig } from "../generator.js";

describe("Roblox reference MCP servers", () => {
  it("defines the default GitMCP-backed Roblox reference lane", () => {
    const servers = getRobloxReferenceMcpServers();
    assert.ok(servers.length >= 4);
    assert.deepEqual(
      servers.map((server) => server.name),
      ["creator_docs", "roblox_skills", "devprod_docs", "roblox_scripts_corpus"],
    );

    for (const server of servers) {
      assert.equal(server.command, "npx");
      assert.deepEqual(server.args.slice(0, 1), ["mcp-remote"]);
      assert.match(server.args[1] ?? "", /^https:\/\/gitmcp\.io\//);
      assert.equal(server.enabled, true);
    }
  });

  it("emits the Roblox reference MCP servers into managed config.toml by default", () => {
    const toml = buildMergedConfig("", process.cwd(), {});

    assert.match(toml, /^\[mcp_servers\.creator_docs\]$/m);
    assert.match(toml, /^\[mcp_servers\.roblox_skills\]$/m);
    assert.match(toml, /^\[mcp_servers\.devprod_docs\]$/m);
    assert.match(toml, /^\[mcp_servers\.roblox_scripts_corpus\]$/m);
    assert.match(toml, /command = "npx"/);
    assert.match(toml, /args = \["mcp-remote", "https:\/\/gitmcp\.io\/Roblox\/creator-docs"\]/);
    assert.match(toml, /args = \["mcp-remote", "https:\/\/gitmcp\.io\/sentinelcore\/roblox-skills"\]/);
    assert.match(toml, /args = \["mcp-remote", "https:\/\/gitmcp\.io\/Corecii\/Devprod"\]/);
    assert.match(toml, /args = \["mcp-remote", "https:\/\/gitmcp\.io\/retpirato\/Roblox-Scripts"\]/);
  });
});
