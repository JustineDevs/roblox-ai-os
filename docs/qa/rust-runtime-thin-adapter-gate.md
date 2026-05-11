# Rust Runtime Thin-Adapter Release Gate

This gate tracks the release checks for the Rust runtime-core plus thin-adapter lane.
CI and release validation must fail when any required scenario below is missing or
failing.

## Verification Matrix

| ID | Scenario | Required evidence | Status |
|---|---|---|---|
| G1 | Team status readers survive the manifest-authority compatibility view | `src/compat/__tests__/rust-runtime-compat.test.ts` | [x] |
| G2 | Doctor preserves manifest-first tmux/session precedence | `src/compat/__tests__/rust-runtime-compat.test.ts` | [x] |
| G3 | HUD preserves session-scoped state precedence over root fallback | `src/compat/__tests__/rust-runtime-compat.test.ts` | [x] |
| G4 | Thin-adapter contract docs stay aligned with the reader compatibility lane | `docs/contracts/rust-runtime-thin-adapter-contract.md` + `src/verification/__tests__/rust-runtime-thin-adapter-gate.test.ts` | [x] |
| G5 | Watcher send-keys parity and mailbox/dispatch paths remain stable after adapter changes | `src/hooks/__tests__/notify-hook-team-dispatch.test.ts` | [x] |

## Pre-mortem Mapping

- Semantic leakage survives into legacy readers:
  Covered by G1, G2, and G3.
- Watcher send-keys parity breaks:
  Covered by G5.
- Mux contract stays tmux-shaped instead of canonical runtime-shaped:
  Covered by G4 and the compatibility test lane.

## Required Docs

- `docs/contracts/rust-runtime-thin-adapter-contract.md`
- `src/compat/__tests__/rust-runtime-compat.test.ts`
- `src/hooks/__tests__/notify-hook-team-dispatch.test.ts`
- `src/verification/__tests__/rust-runtime-thin-adapter-gate.test.ts`
