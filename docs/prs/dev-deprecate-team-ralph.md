> Archive context: retained release and migration collateral from the pre-v0.1.0 fork-to-RCS transition. Links are normalized to the canonical JustineDevs repository, but historical chronology and contributor references may still describe pre-fork development.

# PR Draft: Deprecate `rcs team ralph` and keep team standalone

## Target branch
`dev`

## Title
Deprecate `rcs team ralph` and remove linked team↔Ralph lifecycle machinery

## Summary
This PR removes the built-in linked `rcs team ralph` workflow and restores a clean separation between `team` and `ralph`.

After this change:
- `rcs team ...` / `$team ...` is the only supported team launch path
- `rcs ralph ...` / `$ralph ...` remains available as a separate, explicit follow-up
- team no longer creates, syncs, or depends on linked Ralph state
- legacy `rcs team ralph ...` usage now fails with a clear deprecation error instead of being tolerated silently

This matches the intended product model: team can own coordinated execution and verification itself, while Ralph remains an independent persistence loop that a leader or separate worker may choose to run later.

## Why
The old team↔Ralph linkage had become bloated orchestration glue:
- bridge code between team and Ralph mode state
- linked lifecycle/profile branching
- notify-hook terminal sync behavior
- cleanup/shutdown special-casing
- extra tests and documentation for behavior that should be two separate tools

That coupling made the runtime harder to reason about without providing enough value to justify the complexity.

## What changed
### Removed
- linked team↔Ralph runtime bridge
- linked notify-hook terminal sync
- linked cleanup/shutdown policy behavior
- `linked_ralph` lifecycle profile handling
- advertised/generated `rcs team ralph ...` launch hints
- linked-Ralph-specific tests and compatibility paths inside team runtime

### Updated
- team help/usage text now documents only `rcs team [N:agent-type] "<task>"`
- planning, ralplan, team, and deep-interview guidance now describe a **team verification path** rather than a built-in `team -> ralph` lifecycle
- follow-up planner and pipeline launch hints now generate plain `rcs team ...`
- shutdown/resume/state flows now operate on standalone team semantics only

### Behavior change
- `rcs team ralph ...` is now rejected with an explicit deprecation error:
  - use `rcs team ...` for coordinated team execution
  - use `rcs ralph ...` separately if a later persistent follow-up loop is still needed

## Notable implementation areas
- `src/cli/team.ts`
- `src/cli/index.ts`
- `src/team/runtime.ts`
- `src/team/runtime-cli.ts`
- `src/team/api-interop.ts`
- `src/team/state.ts`
- `src/team/state/types.ts`
- `src/scripts/notify-hook.ts`
- `src/team/followup-planner.ts`
- `src/pipeline/stages/team-exec.ts`

## Deleted surfaces
- `src/team/linked-ralph-bridge.ts`
- `src/scripts/notify-hook/linked-sync.ts`
- `src/cli/__tests__/team-linked-ralph.test.ts`
- `src/team/__tests__/linked-ralph-bridge.test.ts`
- `src/hooks/__tests__/notify-hook-linked-sync.test.ts`

## Impact
### Before
- `rcs team ralph ...` had special runtime behavior
- team state could carry linked Ralph metadata
- notify-hook and shutdown logic had linked team↔Ralph branches
- docs/planning artifacts promoted a built-in linked verification path

### After
- `rcs team ...` runs coordinated team execution only
- team owns its own verification lanes and shutdown evidence
- `rcs ralph ...` is separate and explicit
- a leader or separate worker may still choose to run Ralph later
- there is no built-in linked team+Ralph lifecycle anymore

## Validation
- [x] `npm run build`
- [x] targeted tests covering CLI parsing, runtime/state behavior, team API interop, planner handoff generation, and hook/contract expectations

Verification command:
```bash
npm run build && node --test   dist/cli/__tests__/team.test.js   dist/team/__tests__/followup-planner.test.js   dist/pipeline/__tests__/stages.test.js   dist/hooks/__tests__/keyword-detector.test.js   dist/hooks/__tests__/consensus-execution-handoff.test.js   dist/hooks/__tests__/deep-interview-contract.test.js   dist/team/__tests__/runtime.test.js   dist/team/__tests__/state.test.js   dist/team/__tests__/api-interop.test.js
```

Result:
- `428 pass, 0 fail`

## Risks / notes
- This is an intentional CLI behavior break for users still invoking `rcs team ralph ...`
- The break is now explicit and easier to understand than the previous silent compatibility path
- Separate Ralph execution remains supported, but it must be initiated intentionally rather than being baked into team runtime semantics
