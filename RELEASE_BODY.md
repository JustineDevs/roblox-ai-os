> Release context: patch release for archive removal, Roblox-first demos, stricter prompt framing, and real localized README bodies.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.7

## Summary

`v0.1.7` removes the remaining legacy doc/archive lane, makes the demo guide fully Roblox-first, tightens the internal prompts around Roblox-native primary framing, and upgrades the localized README variants from English stubs to actual localized content.

## Highlights

- **No archive lane** — `docs/archive/` and the leftover historical readiness/report/benchmark/issue collateral are gone from the repo.
- **Roblox-first demo surface** — `DEMO.md` now teaches creator workflow, Creator Labs, workspace standard, and live Studio compatibility instead of generic enterprise demos.
- **Prompt-native framing** — key internal prompts now lead with Roblox Studio, Luau, remotes, DataStore, plugin, and creator-runtime concepts in their primary identity/goal sections.
- **Real localized READMEs** — localized README files now contain actual language-specific content instead of English placeholder text.

## Verification

- `npm run build`
- `node --test dist/hooks/__tests__/prompt-guidance-contract.test.js dist/hooks/__tests__/prompt-guidance-wave-two.test.js dist/hooks/__tests__/surface-taxonomy-contract.test.js`
- `node --test dist/hooks/__tests__/semantic-system-contract.test.js dist/hooks/__tests__/surface-taxonomy-contract.test.js dist/verification/__tests__/roblox-workspace-standard.test.js dist/verification/__tests__/robloxstudio-mcp-compatibility.test.js`
- `node dist/scripts/surface-taxonomy.js`

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.7]`** entry and release summary.
