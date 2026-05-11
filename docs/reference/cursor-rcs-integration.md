# Cursor IDE + RCS (reference integration)

Status: **reference delivery** for the `cursor` platform target in [`src/platform-targets/manifest.json`](../../src/platform-targets/manifest.json). Tier 1 remains **Codex CLI + `rcs setup`**; this page explains how to reuse **canonical RCS artifacts** inside Cursor without forking skill bodies.

## What you are integrating

| Canonical surface | Role |
|-------------------|------|
| [`skills/`](../../skills/) | Workflow `SKILL.md` files (`$brief`, `$forge`, psychology commands, etc.) |
| [`templates/AGENTS.md`](../../templates/AGENTS.md) | Orchestration brain / operating contract template |
| [`docs/reference/agentic-platform-compatibility.md`](./agentic-platform-compatibility.md) | SSOT rules: delivery vs adapter vs Codex-native |

RCS **does not** ship a first-party Cursor extension in this release line. You wire Cursor yourself using rules, optional MCP, and repo layout discipline.

## Recommended layout (project-local)

1. **Keep editing canonical skills in `skills/`** in this repository. Do not maintain a divergent “Cursor-only” copy of the same skill text long term.
2. **Project rules** — under `.cursor/rules/`, add focused rule files that:
   - point agents at `skills/<name>/SKILL.md` for the workflow they should load,
   - require Roblox-native vocabulary and the pre-action gate for Luau work,
   - link [`roblox-pre-action-protocol.md`](./roblox-pre-action-protocol.md) when touching gameplay implementation.
3. **Optional MCP** — attach first-party RCS MCP servers the same way other MCP-capable hosts do; see **[MCP-capable IDE presets](./mcp-capable-ide-presets.md)** for copy-paste `mcp.json` fragments using `rcs mcp-serve`.

## Boundaries (avoid confusion)

- **Not equivalent to `rcs setup`:** Cursor will not install Codex native-agent TOMLs, Codex hooks, or `.rcs/` runtime state. Those remain **Codex-native** concerns unless you add a deliberate adapter.
- **Skills vs rules:** Cursor “rules” should **reference** canonical markdown under `skills/`; they should not silently rewrite `$forge` semantics into unrelated generic coding advice.
- **Windows:** Full `npm test` parity is Linux-first; use WSL2 or CI when validating RCS itself. Cursor on Windows is fine for **reading** repo docs and skills.

## Related

- README **Agentic IDE support matrix** (tier table): [`../../README.md`](../../README.md)
- Claude-like / Anthropic posture (same SSOT idea, different host): [`agentic-platform-compatibility.md`](./agentic-platform-compatibility.md)
