# robloxstudio-mcp Compatibility

Status: optional live Roblox Studio connection standard for RCS.

## Purpose

RCS already provides:
- creator workflow guidance
- local CLI/runtime orchestration
- first-party MCP servers for state, memory, code-intel, trace, and wiki

What it does **not** provide by itself is a live bridge into an open Roblox Studio session for
real-time structure inspection, script reads, script writes, object creation, or screenshot capture.

For that lane, RCS adopts compatibility with the upstream standard:
- upstream repo: `https://github.com/boshyxd/robloxstudio-mcp`
- packages:
  - `robloxstudio-mcp`
  - `robloxstudio-mcp-inspector`

## Upstream Setup First

RCS does **not** replace the upstream plugin installation or activation guide.

If you want this running locally, do the upstream setup first:

- upstream repo and README: `https://github.com/boshyxd/robloxstudio-mcp`
- official Roblox Studio MCP docs: `https://create.roblox.com/docs/studio/mcp`

Use those upstream instructions for:
- installing the Studio plugin
- enabling/activating the Studio-side MCP lane
- confirming the plugin or Studio MCP server shows connected
- client-specific quick-connect or platform-specific path details

Then come back to the RCS docs for:
- Codex-compatible command examples
- inspector vs full-write lane choice
- trust-boundary guidance
- how this fits with `rcs mcp-serve` and GitMCP references

## When To Use It

Use `robloxstudio-mcp` when you need:
- live Roblox Studio hierarchy reads
- script edits against an open Studio session
- object/property inspection without exporting the place manually
- faster feedback for plugin/widget/UI iteration
- real-time environment truth instead of filesystem-only inference

Use `robloxstudio-mcp-inspector` when you want:
- read-only safety
- live inspection without write access
- lower-risk debugging or repo/studio comparison work

## Why It Fits RCS

RCS is the workflow/runtime layer.
`robloxstudio-mcp` is the live Studio transport layer.

They solve different problems and compose cleanly:
- RCS keeps the creator workflow strict and Roblox-native
- `robloxstudio-mcp` gives a live Studio connection when the creator wants real-time truth

## Recommended Standard

1. Follow the upstream plugin/server setup guide first.
2. Confirm the upstream plugin or Studio MCP lane shows connected.
3. Connect Codex with one of the standard commands:

### Full live Studio write lane

```bash
codex mcp add robloxstudio -- npx -y robloxstudio-mcp@latest
```

### Read-only live Studio inspection lane

```bash
codex mcp add robloxstudio-inspector -- npx -y robloxstudio-mcp-inspector@latest
```

### Windows fallback

If `npx` transport is unreliable on Windows shells, use:

```json
{
  "mcpServers": {
    "robloxstudio": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "robloxstudio-mcp@latest"]
    },
    "robloxstudio-inspector": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "robloxstudio-mcp-inspector@latest"]
    }
  }
}
```

## RCS Policy

RCS does **not** auto-install or silently auto-enable this third-party MCP server in setup.

Reasons:
- it depends on a separate Studio plugin
- it needs HTTP enabled in Studio
- it expands the live write surface into an open Studio session
- creators should opt into that trust boundary deliberately

RCS therefore treats this as an **optional standard compatibility lane**, not a forced default.

## How To Use It Inside RCS

When connected, prefer the live Studio MCP lane for:
- confirming current Explorer hierarchy
- reading actual live script contents from Studio
- checking whether a remote, widget, or GUI object already exists
- validating live plugin/widget state

Prefer the repo filesystem/Rojo/workspace lane for:
- source-of-truth Luau modules under version control
- PR review and deterministic diffs
- toolchain formatting/lint rules
- workspace structure and plugin source standards

Best practice:
- use the live Studio lane to inspect truth in the open session
- use the repo workspace lane to keep source-controlled artifacts canonical

## Templates

RCS ships ready examples:
- `templates/roblox/robloxstudio-mcp.codex.json`
- `templates/roblox/robloxstudio-mcp.windows.json`

Use them as starting points, not as proof that the live plugin is already installed.
