> Release context: minor release for Cursor + MCP-capable IDE reference docs, manifest activation at the reference layer, and contributor-facing README / compat hardening.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.2.0

## Summary

`v0.2.0` is the first **minor** line after the `0.1.x` patch series: it ships **reference-level** integration for **Cursor** and **MCP-capable editors** while keeping **Codex native setup** as Tier 1. This release documents how to consume canonical `skills/` and `templates/AGENTS.md` without pretending Codex hooks, native agents, or `.rcs/` runtime semantics port one-to-one.

## Highlights

- **Cursor + RCS** — [`docs/reference/cursor-rcs-integration.md`](./docs/reference/cursor-rcs-integration.md): project rules, SSOT boundaries, optional MCP pointer.
- **MCP IDE presets** — [`docs/reference/mcp-capable-ide-presets.md`](./docs/reference/mcp-capable-ide-presets.md): copy-paste `mcp.json` for first-party `rcs mcp-serve` targets.
- **Platform manifest** — `cursor` and `mcp-capable-ide` lanes move to **active** at the reference-doc layer; `claude-like` stays **planned** until a similar ship.
- **README support matrix** — Tier 2 points at the shipped reference docs and clarifies `claude-like` vs Cursor/MCP.
- **Release tooling** — `package.json`, workspace `Cargo.toml`, root `package-lock.json`, and `Cargo.lock` workspace crate versions stay aligned for the RCS Release **Verify version sync** job.

## Verification

- `npm run build`
- `npm run sync:release-notes:check`
- `node --test dist/platform-targets/__tests__/manifest.test.js dist/verification/__tests__/agentic-platform-compatibility.test.js dist/compat/__tests__/doctor-contract.test.js`

## Contributors

Release contributors will be injected during release generation.

**Full Changelog**: see **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.2.0]`** entry and release summary.
