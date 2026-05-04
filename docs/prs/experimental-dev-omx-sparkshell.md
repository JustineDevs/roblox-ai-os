> Archive context: retained release and migration collateral from the pre-v0.1.0 fork-to-RCS transition. Links are normalized to the canonical JustineDevs repository, but historical chronology and contributor references may still describe pre-fork development.

# PR Draft: Rebase `feat/rcs-sparkshell` onto `experimental/dev`

## Target branch
`experimental/dev`

## Summary
This PR rebases the `rcs sparkshell` feature line onto `experimental/dev` and preserves the follow-on team-status inspection work built on top of it.

It adds the native Rust-backed `rcs sparkshell <command> [args...]` flow, plus a long sequence of `rcs team status` improvements that surface pane-aware inspection metadata and ready-to-run sparkshell commands for leader triage.

## What’s included
### `rcs sparkshell`
- adds CLI dispatch/help for `rcs sparkshell`
- adds `src/cli/sparkshell.ts` for native binary discovery and launch
- adds the Rust crate under `native/rcs-sparkshell/`
- adds packaging/build helpers:
  - `scripts/build-sparkshell.mjs`
  - `scripts/test-sparkshell.mjs`
- stages the packaged native binary under `bin/native/linux-x64/rcs-sparkshell`
- adds focused CLI + packaging tests

### `rcs team status` inspection improvements
- leader/hud/worker pane ids in text and JSON output
- direct sparkshell inspection commands per pane
- prioritized inspection queue and `inspect_next`
- dead/non-reporting worker targeting
- richer recommended inspection metadata, including:
  - worker CLI, role, liveness, index, turn/activity context
  - task id, subject, description, status, lifecycle, approvals, claims, dependencies
  - worktree/runtime paths and team/worker state artifact paths
  - structured `recommended_inspect_items` JSON payloads

## Rebase / integration fixes included
- merged `experimental/dev` CLI/explore surfaces with sparkshell command routing
- excluded `native/rcs-sparkshell` from the root Cargo workspace so manifest-path cargo commands work again
- refreshed/added missing compat doctor fixtures after the rebase
- hardened MCP team-job cleanup to resolve the jobs directory from the current home directory dynamically
- updated tests for newly surfaced claim-lock inspection metadata

## Local verification
- `npm run lint`
- `npm run check:no-unused`
- `npm run build:full`
- `cargo test --manifest-path native/rcs-sparkshell/Cargo.toml`
- `node scripts/build-sparkshell.mjs`
- `node scripts/test-sparkshell.mjs`
- `node bin/rcs.js sparkshell cargo --version`
- `node bin/rcs.js sparkshell npm --version`
- `node bin/rcs.js sparkshell git log --oneline -3`
- `npm test`

## Notes
- `npm test` removes the staged packaged sparkshell binary as part of packaging cleanup; I restored the tracked binary afterward.
- Native Rust build artifacts under `native/rcs-sparkshell/target/` were removed after verification.
