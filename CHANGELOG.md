# Changelog

All notable changes to this project are documented in this file.

> **Provenance:** Earlier per-release notes for this codebase are preserved in **git history** on this repository. Canonical **Roblox Creator Skills** ownership is **JustineDevs**, **`@jstn-sdk/rcs`**, **`https://github.com/JustineDevs/roblox-ai-os`**, the **`rcs`** CLI entrypoint, **`RCS_*`** configuration, and the **`.rcs/`** runtime directory.

## [Unreleased]

## [0.1.0] - 2026-05-04

First **npm** release of **Roblox Creator Skills** as **`@jstn-sdk/rcs@0.1.0`**: the Codex-oriented runtime, setup/doctor flows, team/Ralph orchestration, HUD + tmux integration, hooks and extensibility SDK, explore/sparkshell native harnesses, MCP parity surfaces, autoresearch/deep-interview workflows, plugin bundle (`roblox-ai-os-creator-skills`), and Rust crates **`rcs-runtime`**, **`rcs-sparkshell`**, **`rcs-explore-harness`**, and supporting libraries.

### Summary

- **Branding and packaging** — Public CLI is **`rcs`** (`dist/cli/rcs.js`); workspace and crates use the **`rcs-*`** prefix; first-party plugin and marketplace metadata align with Creator Skills distribution.
- **Merged earlier development trains** — Prior changelog sections are **folded into this single 0.1.0 entry**. Themes include: team worker/leader reliability, Ralph session authority, question/deep-interview UX, setup install modes (user/project/plugin), native-agent policy and model tables, explore routing and harness packaging, MCP cleanup and first-party servers, OpenClaw/adapt foundations, wiki and catalog SSOT, CI and release gates, Windows/tmux hardening, and broad hook/runtime correctness. **Line-level chronology** remains in **git history** (commits and tags on this repository).
- **Paths and env** — Operator-facing state, logs, plans, and adapters live under **`.rcs/`**. Prefer **`RCS_*`** env vars where applicable.

### Highlights (representative)

- Team runtime: startup/shutdown, handoffs, same-CWD isolation, mailbox and dispatch, JSON status surfaces.
- Interactive flows: blocking `rcs question`, deep-interview obligations, autoresearch intake and validators.
- Setup & doctor: Codex `config.toml` merge/repair, managed hooks, plugin mode, marketplace registration, AGENTS handling.
- HUD / tmux: watch panes, reconcile, injection safety, session-scoped state.
- Native: packaged `rcs-explore-harness` and `rcs-sparkshell`, release workflow checks, explore fallbacks and diagnostics.
- Quality: large Node test matrix, catalog doc generation, plugin bundle SSOT, Biome/TS baseline alignment.

### Upgrade / migration

- Install **`@jstn-sdk/rcs`** and use the **`rcs`** binary from `node_modules/.bin` or your global npm prefix.
- Run **`rcs doctor`** after upgrade; use **`rcs setup --force`** when changing install mode or recovering native hooks.
- Use **`.rcs/`** for all runtime state going forward.

### Verification (this release line)

- `npm run build`, `npm test`, and native/plugin verification scripts as defined in `package.json` for the `0.1.0` tag.
