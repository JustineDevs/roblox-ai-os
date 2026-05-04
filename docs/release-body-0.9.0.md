# roblox-ai-os-creator-skills v0.9.0

<p align="center">
  <img src="https://raw.githubusercontent.com/Yeachan-Heo/roblox-ai-os-creator-skills/v0.9.0/docs/shared/rcs-character-spark-initiative.jpg" alt="RCS character sparked for the Spark Initiative" width="720">
</p>

`0.9.0` is the Spark Initiative release: RCS now has a stronger native fast path for repository discovery, shell-native inspection, and cross-platform native distribution.

## Highlights

### `rcs explore`

- adds a dedicated read-only exploration entrypoint
- uses a Rust-backed explore harness
- keeps shell-native exploration constrained, allowlisted, and read-only
- supports packaged native resolution plus source/repo-local fallback paths

### `rcs sparkshell`

- adds an operator-facing native shell sidecar
- supports direct command execution
- summarizes long output into compact sections
- supports explicit tmux-pane summarization:

```bash
rcs sparkshell --tmux-pane %12 --tail-lines 400
```

### Explore ↔ sparkshell integration

- qualifying read-only shell-native `rcs explore` prompts can route through `rcs sparkshell`
- fallback behavior remains explicit and hardened
- guidance/docs/tests were aligned around this contract

### Worker follow-through polish

- worker mailbox guidance now asks for concrete progress updates without implying work should stop after replying
- inbox/mailbox trigger wording now tells workers to continue assigned or next feasible work after reporting status
- runtime/bootstrap wording and associated tests were aligned around this behavior

### Release pipeline upgrades

- cross-platform native publishing for:
  - `rcs-explore-harness`
  - `rcs-sparkshell`
- native release manifest generation with per-target metadata
- packed-install smoke verification in the release workflow
- `build:full` validated as the one-shot release-oriented build path

## Important Spark Initiative notes

- Users can install RCS normally with `npm install -g roblox-ai-os-creator-skills`.
- The npm tarball intentionally excludes staged cross-platform native binaries.
- Tagged releases publish verified native archives for `rcs-explore-harness` and `rcs-sparkshell`.
- Packaged installs hydrate the matching native binary through `native-release-manifest.json`.
- CI now hardens the Rust path with explicit toolchain setup, `cargo fmt --all --check`, and `cargo clippy --workspace --all-targets -- -D warnings`.

## Upgrade note

If you use project-scoped RCS installs, rerun:

```bash
rcs setup --force --scope project
```

after upgrading so managed config/native-agent paths are refreshed.

## Local release verification summary

Validated locally on `dev` before tagging:

- `node scripts/check-version-sync.mjs --tag v0.9.0`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run check:no-unused`
- `npm test`
- `npm run build:full`
- `npm run test:explore`
- `npm run test:sparkshell`
- `node bin/rcs.js doctor`
- `node bin/rcs.js setup --dry-run`
- `npm pack --dry-run`

## Notable PRs

- [#782](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/782) — explore routes qualifying read-only shell tasks via sparkshell
- [#784](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/784) — cross-platform native publishing and release-pipeline follow-through
- [#785](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/785) — team runtime lifecycle and cleanup hardening
- [#786](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/786) — nested help routing cleanup
- [#787](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/787) — centralized RCS default model resolution
- [#788](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/788) — HUD branch/config loading hardening
- [#789](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/789) — distribute generated aspect tasks across workers
- [#793](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/793) — Windows Codex command shim probing fix
- [#794](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/794) — merge `experimental/dev` into `dev`
- [#805](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/805) — keep workers running after mailbox replies

## Related issues

- [#781](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/pull/781) — sparkshell summary reasoning hardening
- [#744](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/issues/744) — lifecycle profile persistence
- [#745](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/issues/745) — cleanup policy hardening
- [#746](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/issues/746) — governance split follow-through
- [#741](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/issues/741) — linked Ralph/team runtime follow-up
- [#732](https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills/issues/732) — related team lifecycle follow-up
