# Roblox Creator Skills v0.1.1

## Summary

`v0.1.1` is the first hardening release after the initial `0.1.0` ship line. It turns the repo into a more coherent Roblox Studio product/workspace by tightening public identity, enforcing a semantic system, adding a real workspace standard, and documenting optional live Studio MCP compatibility.

## Canonical product surface

- Package: `@jstn-sdk/rcs`
- Owner: `JustineDevs`
- Repository: `https://github.com/JustineDevs/roblox-ai-os`
- Product: `Roblox Creator Skills`
- Short identity: `RCS`

## What changed

- Public surface hardening:
  - Roblox-native prompts, skills, missions, docs, README, and generated catalog
  - cleanup of older compatibility wording on active surfaces
- Semantic enforcement:
  - canonical vocabulary
  - semantic design system
  - machine-readable surface taxonomy
  - generated surface map
  - contract tests for semantic/workflow drift
- Roblox workspace standard:
  - `default.project.json`
  - `wally.toml`
  - `aftman.toml`
  - `stylua.toml`
  - `selene.toml`
  - canonical Luau source tree
  - canonical Studio plugin source layout
- Optional live Studio connection:
  - documented `robloxstudio-mcp` compatibility lane
  - shipped Codex MCP template configs
- CI and release proof:
  - final CI proof artifact
  - stronger release/workflow verification contracts

## Verification

- `npm run build`
- targeted semantic/taxonomy/workspace/compatibility verification suites
- top-level release proof rerun with post-checks

## Notes

This release keeps `robloxstudio-mcp` as an explicit optional compatibility layer rather than silently enabling a third-party live Studio write transport during default RCS setup. That separation is intentional.
