<!-- RCS:RELEASE-NOTES:START -->
# Release Notes v0.2.0

**Package:** `@jstn-sdk/rcs@0.2.0`  
**Tag:** `v0.2.0`  
**Release date:** `2026-05-11`
<!-- RCS:RELEASE-NOTES:END -->

## Summary

`v0.2.0` is the first **minor** line after the `0.1.x` patch series: it ships **reference-level** integration for **Cursor** and **MCP-capable editors** while keeping **Codex native setup** as Tier 1. This release documents how to consume canonical `skills/` and `templates/AGENTS.md` without pretending Codex hooks, native agents, or `.rcs/` runtime semantics port one-to-one.

## Highlights

- **Cursor + RCS** — new [`docs/reference/cursor-rcs-integration.md`](./reference/cursor-rcs-integration.md): project rules, SSOT boundaries, optional MCP pointer.
- **MCP IDE presets** — new [`docs/reference/mcp-capable-ide-presets.md`](./reference/mcp-capable-ide-presets.md): copy-paste `mcp.json` for all first-party `rcs mcp-serve` targets (`state`, `memory`, `code-intel`, `trace`, `wiki`), aligned with `src/config/rcs-first-party-mcp.ts`.
- **Platform manifest** — `cursor` and `mcp-capable-ide` lanes move to **`active`** at the reference-doc layer; `claude-like` stays **planned** until a similar ship.
- **README support matrix** — Tier 2 now points at the shipped reference docs and clarifies `claude-like` vs Cursor/MCP.
- **Corpora clarity** — expanded [`corpora/README.md`](../../corpora/README.md) (quarantine, npm vs clone, CI vs Windows testing expectations).
- **Compat doctor tests** — cross-platform normalization for `doctor` contract fixtures (Windows short paths, `tmux.cmd` stub, `RCS_RUNTIME_BRIDGE` isolation) and onboarding fixture alignment.

## Verification

- `npm run build`
- `npm run sync:release-notes:check`
- `node --test dist/platform-targets/__tests__/manifest.test.js dist/verification/__tests__/agentic-platform-compatibility.test.js dist/compat/__tests__/doctor-contract.test.js`

## Contributors

Release contributors will be injected during release generation.

**Full Changelog**: see root [`CHANGELOG.md`](../../CHANGELOG.md) section `[0.2.0]`.
