# Mission: CLI discoverability hardening

Improve command discoverability across the RCS CLI, with emphasis on:
- top-level help
- nested help routing
- sparkshell discoverability
- session-search discoverability

## Goal
Find the smallest changes that improve operator success when trying to discover the right CLI surface from help text alone.

## Focus areas
- `README.md`
- `src/cli/index.ts`
- `src/cli/__tests__/index.test.ts`
- `src/cli/__tests__/nested-help-routing.test.ts`
- `src/cli/__tests__/sparkshell-cli.test.ts`
- `src/cli/__tests__/session-search-help.test.ts`

## Desired output
Produce a compact improvement set that:
1. preserves existing command routing semantics
2. improves help clarity/discoverability
3. keeps targeted CLI discoverability tests green

## Success hints
- prefer small help-text or routing-clarity changes
- avoid widening scope into unrelated command behavior
- preserve existing docs/contracts unless a discoverability improvement requires aligned edits
