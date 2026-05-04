> Archive context: retained release and migration collateral from the pre-v0.1.0 fork-to-RCS transition. Links are normalized to the canonical JustineDevs repository, but historical chronology and contributor references may still describe pre-fork development.

# PR Draft: Fix issue #715 team brain / role split

## Target branch
`dev`

## Summary
This follow-up PR fixes issue #715 by separating team-mode execution defaults from the generic executor lane.

I plan to fix #715 via this PR.

## Changes
- add a `team-executor` role prompt for supervised default team execution
- register `team-executor` in the catalog/setup path so the prompt and native agent are actually installable for real team runs
- keep explicit `N:agent-type` team launches unchanged
- add a conservative fanout guard so weakly structured small team tasks do not over-split by default
- add focused regression tests for role discovery and decomposition behavior

## Validation
- [x] `npm run lint`
- [x] `npm test`
