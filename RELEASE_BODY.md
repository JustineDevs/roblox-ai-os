> Release context: patch release for explicit latest-version triggers, guarded automated npm publishing, and final README ownership/acknowledgement polish.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.6

## Summary

`v0.1.6` is the release-automation follow-up for **Roblox Creator Skills**. It adds explicit `@latest` trigger commands, binds automated npm publishing to the guarded `npm-publish` environment, and finishes README ownership/acknowledgement consistency work.

## Highlights

- **Blunt latest triggers** — `rcs latest` and `rcs @latest` now directly route to the same verified path as `rcs update`.
- **Publish environment** — the release workflow’s `publish-npm` job now uses the `npm-publish` GitHub Actions environment.
- **README consistency** — canonical and localized README surfaces now align on ownership links, acknowledgements, and linked MIT license wording.

## Verification

- `npm run build`
- `node --test dist/cli/__tests__/index.test.js dist/cli/__tests__/update.test.js dist/cli/__tests__/package-bin-contract.test.js`
- `node --test dist/verification/__tests__/explore-harness-release-workflow.test.js`

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.6]`** entry and release summary.
