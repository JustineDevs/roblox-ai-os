> Release context: patch release for the strict Roblox-native product surface, semantic system, workspace standard, and CI proof lane.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.1

## Summary

`v0.1.1` is the Roblox-native hardening release for **Roblox Creator Skills**. It finishes the public cleanup away from older compatibility branding, adds strict semantic/taxonomy enforcement, introduces a real Roblox Studio workspace standard, documents optional `robloxstudio-mcp` live Studio compatibility, and upgrades CI/readme release proof surfaces.

## Highlights

- **Strict Roblox-native product surface** — prompts, skills, missions, docs, generated catalog, and README now align to creator-first Roblox Studio language.
- **Semantic enforcement** — canonical vocabulary, semantic design system, surface taxonomy metadata, generated surface map, and contract tests now block surface drift.
- **Workspace foundation** — Rojo/Wally/Aftman/StyLua/Selene configs, a canonical Luau source tree, and a Studio plugin source layout are now part of the repo.
- **Optional live Studio connection** — `robloxstudio-mcp` is adopted as the documented real-time Studio compatibility lane without silently expanding the default trust boundary.
- **Release proof** — CI now uploads a `final-ci-proof` artifact and README/onboarding surfaces were tightened for faster setup and clearer presentation.

## Verification

- `npm run build`
- semantic/taxonomy/workspace/compatibility verification contracts
- CI proof artifact contract
- top-level `npm test` rerun plus post-checks (`generate-catalog-docs --check`, `surface:map:check`)

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.1]`** entry and release summary.
