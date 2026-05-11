> Release context: patch release for contributor workflow hardening, GitHub release/package clarity, and concrete cross-platform target manifests.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.9

## Summary

`v0.1.9` adds a real contributor wiki and roadmap surface, formalizes GitHub Releases/GitHub Packages as separate release targets, and introduces a typed platform target manifest so RCS can describe concrete delivery and adapter lanes without pretending every agentic platform works like Codex.

## Highlights

- **Contributor onramp** — new `docs/wiki/` pages for contributor home, roadmap, good-first-issue guidance, and release playbook; issue/PR templates now route people there.
- **GitHub release/package clarity** — workflow + tests now explicitly separate npmjs publishing, GitHub Packages publishing, and GitHub Release object creation, with official `.github/release.yml` notes categories.
- **Concrete platform targets** — `src/platform-targets/manifest.json` now defines `codex-native`, `codex-plugin`, `claude-like`, `marketplace-bundle`, `adapter-openclaw`, and `adapter-hermes`.

## Verification

- `npm run build`
- `node --test dist/verification/__tests__/contributor-workflow-templates.test.js dist/verification/__tests__/explore-harness-release-workflow.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/platform-targets/__tests__/manifest.test.js dist/verification/__tests__/agentic-platform-compatibility.test.js dist/verification/__tests__/multi-agent-compatibility-architecture.test.js dist/agents/__tests__/definitions.test.js dist/adapt/__tests__/foundation.test.js`

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.9]`** entry and release summary.
