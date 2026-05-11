## Summary

> For normal contributions, target base branch `dev`. Use `main` only when a maintainer explicitly asks for it.

Describe the problem and why this change is needed.

## Problem

- What user/maintainer problem existed before this PR?
- Why is this the right fix or feature shape?

## Scope

- What is intentionally included?
- What is intentionally excluded?
- Which major surfaces are touched? (`src/`, `prompts/`, `skills/`, docs, workflows, release/config, Roblox workspace, etc.)

## Changes

-

## Validation

- [ ] `npm run build`
- [ ] `npm test`
- [ ] `rcs doctor` (when setup/config behavior changes)
- [ ] Focused verification added or updated for the changed surface

## Roblox-specific impact

- [ ] This PR is not creator-facing / Roblox-facing
- [ ] This PR changes Roblox Studio / Luau / remotes / DataStore / plugin / workspace behavior
- [ ] This PR changes creator workflow language or docs

If checked, summarize the Roblox-specific impact:

-

## Docs / localization impact

- [ ] No docs changed
- [ ] Canonical docs changed
- [ ] Root `README.md` changed
- [ ] Localized README files were reviewed/updated for locale domino effects

## Release / compatibility impact

- [ ] No release note needed
- [ ] Changelog / release note update needed
- [ ] Config / migration / compatibility impact considered

If compatibility or migration impact exists, explain it:

-

## Checklist

- [ ] PR is focused and avoids unrelated changes
- [ ] Docs updated (README/DEMO/COVERAGE/AGENTS template) when needed
- [ ] Backward-compatibility impact considered
- [ ] No misleading generic web/enterprise framing was introduced on active Roblox-facing surfaces
- [ ] If workflow/runtime behavior changed, the relevant GitHub Actions pre-flight or verification path was considered

## Related

Closes #
