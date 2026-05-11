# Roblox Creator Skills v0.1.6

## Summary

`v0.1.6` is the release-automation follow-up after the `0.1.1` hardening line. It introduces explicit latest-version command triggers, binds automated npm publishing to the guarded `npm-publish` GitHub Actions environment, and finishes the remaining README ownership/acknowledgement consistency work.

## What changed

- Added explicit update aliases:
  - `rcs latest`
  - `rcs @latest`
- Kept the direct npm install path explicit:
  - `npm install -g @jstn-sdk/rcs@latest`
- Bound automated npm publishing to:
  - GitHub Actions environment `npm-publish`
- Added `oh-my-codex` acknowledgement as a stepping-stone influence
- Synchronized canonical/localized README ownership, acknowledgement, and linked license surfaces

## Verification

- `npm run build`
- `node --test dist/cli/__tests__/index.test.js dist/cli/__tests__/update.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/verification/__tests__/explore-harness-release-workflow.test.js`

## Note on version numbering

This repo history already carried older local tags through `v0.1.5`, while the npm registry only had `0.1.0` and `0.1.1` published. `v0.1.6` was selected to avoid tag collisions and keep the automated release lane clean.
