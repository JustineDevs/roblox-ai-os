# MCP-capable IDE presets (RCS `mcp-serve`)

Status: **reference delivery** for the `mcp-capable-ide` platform target. Canonical MCP wiring for Codex lives in TypeScript SSOT ([`src/config/rcs-first-party-mcp.ts`](../../src/config/rcs-first-party-mcp.ts)); this page gives **host-local JSON** you can paste into editors that support the [Model Context Protocol](https://modelcontextprotocol.io/) (Cursor, VS Code MCP extensions, etc.).

## Preconditions

1. **`rcs` on `PATH`** — install globally so the MCP host can spawn it:

   ```bash
   npm install -g @jstn-sdk/rcs
   ```

2. **Built artifacts** — first-party servers load from the published package’s `dist/mcp/*.js`. Use a **global** install of `@jstn-sdk/rcs`, or point `cwd` / `command`+`args` at a **git clone** where you ran `npm run build` (advanced).

3. **Not a substitute for Codex setup** — these presets only expose **stdio MCP servers**. They do **not** install Codex hooks, native agents, or `.rcs/` runtime state.

## First-party server names

| MCP server id | `rcs mcp-serve` target |
|---------------|-------------------------|
| `rcs_state` | `state` |
| `rcs_memory` | `memory` |
| `rcs_code_intel` | `code-intel` |
| `rcs_trace` | `trace` |
| `rcs_wiki` | `wiki` |

These names match [`buildRcsPluginMcpManifest()`](../../src/config/rcs-first-party-mcp.ts) (`rcs` + `["mcp-serve", "<target>"]`).

## Combined preset (`mcp.json` shape)

Use the structure your editor expects (Cursor often uses `mcpServers` at the top level). Example — **all five** first-party servers:

```json
{
  "mcpServers": {
    "rcs_state": {
      "command": "rcs",
      "args": ["mcp-serve", "state"]
    },
    "rcs_memory": {
      "command": "rcs",
      "args": ["mcp-serve", "memory"]
    },
    "rcs_code_intel": {
      "command": "rcs",
      "args": ["mcp-serve", "code-intel"]
    },
    "rcs_trace": {
      "command": "rcs",
      "args": ["mcp-serve", "trace"]
    },
    "rcs_wiki": {
      "command": "rcs",
      "args": ["mcp-serve", "wiki"]
    }
  }
}
```

### Minimal preset (wiki + trace only)

```json
{
  "mcpServers": {
    "rcs_wiki": {
      "command": "rcs",
      "args": ["mcp-serve", "wiki"]
    },
    "rcs_trace": {
      "command": "rcs",
      "args": ["mcp-serve", "trace"]
    }
  }
}
```

## Git clone + local `rcs.js` (advanced)

If you develop from a workspace where `rcs` is not global, use Node on the compiled CLI:

```json
{
  "mcpServers": {
    "rcs_wiki": {
      "command": "node",
      "args": ["/absolute/path/to/roblox-ai-os/dist/cli/rcs.js", "mcp-serve", "wiki"]
    }
  }
}
```

Adjust the path per machine; prefer global `rcs` for teams.

## Related

- [Cursor + RCS integration](./cursor-rcs-integration.md)
- [Integrations hub](../integrations.html)
- [Agentic platform compatibility](./agentic-platform-compatibility.md)
