# Mission
Fix the failing help-consistency regression so the CLI help text, compatibility fixture, and tests all describe the same `rcs autoresearch` wording.

Primary target:
- `src/cli/__tests__/session-search-help.test.ts`

Supporting surfaces that may need alignment:
- `src/cli/index.ts`
- `src/compat/fixtures/help.stdout.txt`
- any related help-routing/help-contract tests if needed

Success means:
1. `node --test dist/cli/__tests__/session-search-help.test.js` passes
2. top-level help wording for `rcs autoresearch` is internally consistent across source, built output expectations, and fixtures
3. no unrelated CLI help behavior regresses
