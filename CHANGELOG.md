# Changelog

All notable changes to this project are documented in this file.

> **Provenance:** Earlier per-release notes for this codebase are preserved in **git history** on this repository. Canonical **Roblox Creator Skills** ownership is **JustineDevs**, **`@jstn-sdk/rcs`**, **`https://github.com/JustineDevs/roblox-ai-os`**, the **`rcs`** CLI entrypoint, **`RCS_*`** configuration, and the **`.rcs/`** runtime directory.

## [Unreleased]

## [0.1.9] - 2026-05-11

Contributor-workflow, release-surface, and platform-compatibility follow-up for **`@jstn-sdk/rcs@0.1.9`**. This ship line adds a real contributor wiki + roadmap, official newcomer labels and label sync automation, a clean GitHub Releases/GitHub Packages contract, and a typed platform target manifest for concrete delivery/adapter lanes.

### Summary

- **Contributor onramp** — added `docs/wiki/` with contributor home, roadmap, good-first-issue guidance, and release playbook; updated README, docs home, issue templates, PR template, and localized READMEs to point at those surfaces.
- **GitHub release/package hardening** — release automation now treats GitHub Releases, GitHub Packages, and npmjs as separate surfaces with explicit workflow/testing contracts and official `.github/release.yml` release-notes categories.
- **Platform target manifest** — added a typed manifest for concrete lanes:
  - `codex-native`
  - `codex-plugin`
  - `claude-like`
  - `marketplace-bundle`
  - `adapter-openclaw`
  - `adapter-hermes`
- **Architecture clarity** — added explicit docs for the actual multi-agent compatibility architecture used by RCS instead of leaving registry/adapter/policy structure implicit.

### Verification (this release line)

- `npm run build`
- `node --test dist/verification/__tests__/contributor-workflow-templates.test.js dist/verification/__tests__/explore-harness-release-workflow.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/agents/__tests__/definitions.test.js dist/agents/__tests__/native-config.test.js dist/adapt/__tests__/foundation.test.js dist/scripts/__tests__/verify-native-agents.test.js dist/verification/__tests__/multi-agent-compatibility-architecture.test.js`
- `node --test dist/platform-targets/__tests__/manifest.test.js dist/verification/__tests__/agentic-platform-compatibility.test.js dist/verification/__tests__/multi-agent-compatibility-architecture.test.js dist/agents/__tests__/definitions.test.js dist/adapt/__tests__/foundation.test.js`

## [0.1.8] - 2026-05-11

MCP/reference-layer activation release for **`@jstn-sdk/rcs@0.1.8`**. This ship line enables the GitMCP Roblox reference servers by default in the managed Codex config path, documents the MCP activation split more clearly in the README and localized README files, and adds the supporting config/reference verification tests.

### Summary

- **Default Roblox reference MCP layer** — `rcs setup` now seeds GitMCP-backed Roblox reference servers for `creator_docs`, `roblox_skills`, `devprod_docs`, and `roblox_scripts_corpus` in the managed Codex config path.
- **Clear MCP split** — README and localized README variants now explain the recommended activation model: first-party `rcs mcp-serve` plus default GitMCP references, with `robloxstudio-mcp` still kept manual for live Studio connections.
- **Verification hardening** — Added config and verification tests for the Roblox external MCP reference layer and updated generator expectations to cover the expanded default MCP set.

### Verification (this release line)

- `npm run build`
- `node --test dist/config/__tests__/roblox-reference-mcp.test.js dist/config/__tests__/generator-idempotent.test.js dist/verification/__tests__/roblox-mcp-reference-layer.test.js dist/verification/__tests__/robloxstudio-mcp-compatibility.test.js`

## [0.1.7] - 2026-05-11

Documentation and prompt-surface hardening release for **`@jstn-sdk/rcs@0.1.7`**. This ship line removes the remaining archive lane, makes the demo guide fully Roblox-first, upgrades the internal prompt roles from “generic first, Roblox later” to Roblox-native primary framing, and replaces the fake localized README stubs with real localized bodies.

### Summary

- **Archive removed** — `docs/archive/` and the remaining historical readiness/report/issue/benchmark collateral are no longer part of the repository surface.
- **Roblox-first demos** — `DEMO.md` now demonstrates the creator workflow, Creator Labs, workspace standard, optional live Studio MCP compatibility, and advanced team runtime without generic REST/task-management examples.
- **Prompt strictness** — key internal prompts now declare Roblox-native primary framing in their identity/goal sections, and malformed duplicated prompt-tail metadata was cleaned up.
- **Real localized READMEs** — localized README variants now contain actual language-specific content instead of English placeholder stubs.

### Verification (this release line)

- `npm run build`
- `node --test dist/hooks/__tests__/prompt-guidance-contract.test.js dist/hooks/__tests__/prompt-guidance-wave-two.test.js dist/hooks/__tests__/surface-taxonomy-contract.test.js`
- `node --test dist/hooks/__tests__/semantic-system-contract.test.js dist/hooks/__tests__/surface-taxonomy-contract.test.js dist/verification/__tests__/roblox-workspace-standard.test.js dist/verification/__tests__/robloxstudio-mcp-compatibility.test.js`
- `node dist/scripts/surface-taxonomy.js`

## [0.1.6] - 2026-05-11

Release-automation follow-up for **`@jstn-sdk/rcs@0.1.6`**. This ship line adds blunt latest-version triggers, binds automated npm publishing to the guarded `npm-publish` GitHub Actions environment, and finishes ownership/acknowledgement consistency on README surfaces.

### Summary

- **Latest-version triggers** — Added `rcs latest` and `rcs @latest` as explicit aliases for the verified `rcs update` path, while documenting the direct npm form `npm install -g @jstn-sdk/rcs@latest`.
- **Automated npm publish guardrail** — The release workflow now uses the `npm-publish` environment for the `publish-npm` job so maintainers can gate registry access separately from ordinary repo write access.
- **README consistency** — Ownership links, acknowledgements, and linked MIT license surfaces are now aligned across the canonical README and localized README variants, including explicit thanks to `oh-my-codex` as a stepping stone.

### Verification (this release line)

- `npm run build`
- `node --test dist/cli/__tests__/index.test.js dist/cli/__tests__/update.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/verification/__tests__/explore-harness-release-workflow.test.js`
- `npm view @jstn-sdk/rcs versions --json` to confirm only `0.1.0` and `0.1.1` were live on npm before selecting `0.1.6`

## [0.1.1] - 2026-05-11

Roblox-native hardening release for **`@jstn-sdk/rcs@0.1.1`**. This ship line finishes the public migration away from older compatibility branding, adds a strict semantic/taxonomy system for prompts/skills/missions, introduces a real Roblox Studio workspace standard, documents optional `robloxstudio-mcp` live Studio compatibility, adds a CI proof artifact, and tightens README/onboarding presentation.

### Summary

- **Roblox-native public surface** — Prompts, skills, missions, generated catalog, docs, and README now consistently present RCS as a Roblox Studio workflow/runtime product rather than a generic orchestration fork.
- **Strict semantic system** — Added canonical vocabulary, semantic design system rules, machine-readable taxonomy metadata, generated surface map, and contract tests that block drift across prompts, skills, missions, and sandboxes.
- **Workspace standard** — Added Rojo/Wally/Aftman/StyLua/Selene scaffolding, a canonical Luau source tree, and a Studio plugin source layout so the repo has an actual Roblox Studio workspace foundation instead of only docs and playgrounds.
- **Optional live Studio transport** — Adopted `robloxstudio-mcp` as the documented optional real-time Studio connection standard without silently forcing a third-party write surface into default setup.
- **Release proof and onboarding** — CI now uploads a final proof artifact, README setup was rewritten into a stricter step-by-step flow, and README presentation now includes branded cover art, badges, alerts, and acknowledgements.

### Highlights

- Full retirement of older public compatibility workflow names and their remaining active runtime/catalog exposure.
- New reference surfaces:
  - `canonical-vocabulary.md`
  - `semantic-design-system.md`
  - `surface-map.md`
  - `roblox-workspace-standard.md`
  - `robloxstudio-mcp-compatibility.md`
- New verification contracts for:
  - semantic system
  - surface taxonomy
  - Roblox workspace standard
  - `robloxstudio-mcp` compatibility
  - final CI proof artifact
- New `.devcontainer` setup for Node/Rust contributor parity.

### Upgrade / migration

- Update to **`@jstn-sdk/rcs@0.1.1`**.
- Run **`rcs setup`** after install/update so plugin mirrors, prompts, skills, and setup-owned runtime wiring stay aligned.
- If you want live Roblox Studio truth, opt into the upstream `robloxstudio-mcp` plugin/server lane using the shipped templates under `templates/roblox/`.

### Verification (this release line)

- `npm run build`
- targeted verification contracts for semantic system, surface taxonomy, Roblox workspace standard, `robloxstudio-mcp` compatibility, and CI proof artifact
- full top-level `npm test` release proof was re-run locally; the previously failing contract tests were fixed and the visible suite plus late-tail reruns stayed green, with the only remaining ambiguity being the local shell wrapper not printing a final exit line after child processes had already exited

## [0.1.0] - 2026-05-04

First **npm** release of **Roblox Creator Skills** as **`@jstn-sdk/rcs@0.1.0`**: the creator-focused Codex toolkit, setup/doctor flows, team/forge execution surfaces, HUD + tmux integration, hooks and extensibility SDK, explore/sparkshell native harnesses, MCP parity surfaces, autoresearch/deep-interview workflows, plugin bundle (`roblox-ai-os-creator-skills`), and Rust crates **`rcs-runtime`**, **`rcs-sparkshell`**, **`rcs-explore-harness`**, and supporting libraries.

### Summary

- **Branding and packaging** — Public CLI is **`rcs`** (`dist/cli/rcs.js`); workspace and crates use the **`rcs-*`** prefix; first-party plugin and marketplace metadata align with Creator Skills distribution.
- **Merged earlier development trains** — Prior changelog sections are **folded into this single 0.1.0 entry**. Themes include: team worker/leader reliability, forge compatibility/session authority, question/deep-interview UX, setup install modes (user/project/plugin), native-agent policy and model tables, explore routing and harness packaging, MCP cleanup and first-party servers, notification/adapt foundations, wiki and catalog SSOT, CI and release gates, Windows/tmux hardening, and broad hook/runtime correctness. **Line-level chronology** remains in **git history** (commits and tags on this repository).
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
