# Forge Semantic Baseline

Internal semantic baseline for the lower-level persistent completion runtime now canonically surfaced as **Forge**.

- Pinned baseline commit SHA: `165c3688bfde275560c001a0de4c7563cf82ad69`
- Retrieved at (UTC): `2026-02-22T06:55:19Z`
- Historical baseline source: prior Forge/Forge completion-surface contract snapshot
- SHA256 (baseline file content): `2a16d9dd55a78ae9edf192fa36ab8370cb5f2dee4958fc458432429a36000917`

## Semantics retained under Forge

1. Iteration semantics
   - Forge is an iterative completion loop with persisted lifecycle state.
   - Iteration progress moves through start, execute, verify, fix, and terminal phases.

2. Retry semantics
   - Verification failure does not silently terminate the run.
   - The runtime re-enters fix/verify until success, cancellation, or hard failure.

3. Completion semantics
   - Completion requires fresh verification evidence.
   - Terminal success sets `active=false`, `current_phase=complete`, and writes `completed_at`.

4. Cancellation semantics
   - Cancellation is lifecycle terminalization, not silent deletion.
   - Linked cleanup of adjacent execution modes remains part of the contract.

## Audit note

Any future parity refresh must pin a new baseline commit SHA and content hash.

See `docs/reference/forge-parity-matrix.md`.
