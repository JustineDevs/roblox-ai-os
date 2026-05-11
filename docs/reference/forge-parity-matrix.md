# Forge To RCS Parity Matrix

Archive compatibility reference for the lower-level persistent completion runtime.

Baseline source: `docs/reference/forge-upstream-baseline.md`

| Rule ID | Semantic rule | RCS implementation point(s) | Status | Verification |
|---|---|---|---|---|
| R1 | Iterations are persisted with `iteration`, `max_iterations`, and `current_phase`. | `src/state/operations.ts`, `src/forge/persistence.ts` | adopted | V1, V4 |
| R2 | Legacy phase labels normalize into the canonical Forge phase set. | `src/forge/contract.ts`, `src/mcp/state-server.ts` | adapted | V4 |
| R3 | Completion is terminalized with `active=false` and `completed_at`. | `src/cli/index.ts`, `src/modes/base.ts` | adopted | V5 |
| R4 | Cancellation propagates to linked execution state where required. | `src/cli/index.ts`, `skills/cancel/SKILL.md` | adapted | V6, V7 |
| R5 | Session-scoped state is authoritative when a session exists. | `src/mcp/state-paths.ts`, `src/state/skill-active.ts`, `src/hud/state.ts` | adopted | V1, V2, V8 |
| R6 | Legacy PRD/progress artifacts migrate one-way into canonical files. | `src/forge/persistence.ts`, `src/forge/__tests__/persistence.test.ts` | adapted | V3 |
| R7 | Release is blocked if persistence contract scenarios are not covered. | `docs/qa/forge-persistence-gate.md`, `src/verification/__tests__/forge-persistence-gate.test.ts` | adopted | V10 |

## Status legend

- `adopted`: implemented directly in the current runtime
- `adapted`: preserved with RCS-specific adjustments
- `out-of-scope`: intentionally not reintroduced as runtime behavior

References:
- `docs/contracts/forge-state-contract.md`
- `docs/contracts/forge-cancel-contract.md`
- `docs/qa/forge-persistence-gate.md`
