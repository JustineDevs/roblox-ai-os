<!-- RCS:RELEASE-NOTES:START -->
# Release Notes v0.1.9

**Package:** `@jstn-sdk/rcs@0.1.9`  
**Tag:** `v0.1.9`  
**Release date:** `2026-05-11`
<!-- RCS:RELEASE-NOTES:END -->

## Summary

`v0.1.9` is the clean follow-up after the already-published `0.1.8` npm release. It packages the contributor/onboarding hardening, GitHub release/package cleanup, and the new concrete platform target manifest into one explicit patch line.

## Highlights

- Added a contributor wiki under `docs/wiki/` with:
  - contributor home
  - roadmap
  - good first issues / labels guidance
  - release playbook
- Added `.github/labels.yml` plus `Sync Labels` workflow for newcomer and roadmap labels.
- Hardened GitHub Releases and GitHub Packages as first-class release surfaces.
- Added explicit architecture docs for:
  - multi-agent compatibility
  - agentic platform compatibility
- Added typed concrete platform target lanes:
  - `codex-native`
  - `codex-plugin`
  - `claude-like`
  - `marketplace-bundle`
  - `adapter-openclaw`
  - `adapter-hermes`

## Why this release exists

`0.1.8` was already published to npm. These follow-up changes materially extend the release surface and compatibility contract, so they belong on a new patch version instead of silently reusing the existing `v0.1.8` tag.

## Verification

- `npm run build`
- `node --test dist/verification/__tests__/contributor-workflow-templates.test.js dist/verification/__tests__/explore-harness-release-workflow.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/agents/__tests__/definitions.test.js dist/agents/__tests__/native-config.test.js dist/adapt/__tests__/foundation.test.js dist/scripts/__tests__/verify-native-agents.test.js dist/verification/__tests__/multi-agent-compatibility-architecture.test.js`
- `node --test dist/platform-targets/__tests__/manifest.test.js dist/verification/__tests__/agentic-platform-compatibility.test.js dist/verification/__tests__/multi-agent-compatibility-architecture.test.js dist/agents/__tests__/definitions.test.js dist/adapt/__tests__/foundation.test.js`

## Contributors

Release contributors will be injected during release generation.

**Full Changelog**: placeholder
