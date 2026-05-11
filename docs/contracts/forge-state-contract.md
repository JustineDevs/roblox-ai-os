# Forge State Contract

## Canonical Forge state schema

Forge runtime state is stored at:
- `.rcs/state/forge-state.json`
- `.rcs/state/sessions/<session_id>/forge-state.json`

Required active fields:
- `active: boolean`
- `iteration: number`
- `max_iterations: number`
- `current_phase: string`
- `started_at: ISO8601 string`

Optional terminal and audit fields:
- `completed_at`
- `error`
- `owner_rcs_session_id`
- `owner_codex_session_id`
- `owner_codex_thread_id`
- `tmux_pane_id`
- `tmux_pane_set_at`
- `stop_reason`

## Canonical phase vocabulary

`current_phase` must be one of:
- `starting`
- `executing`
- `verifying`
- `fixing`
- `blocked_on_user`
- `complete`
- `failed`
- `cancelled`

Unknown phase values must be rejected.

## Scope rules

1. Session-scoped state is authoritative when a session id exists.
2. Root scope is compatibility fallback only.
3. Writes target one authoritative scope only.
4. Cross-session migration must preserve single-owner semantics and must not overwrite an already-authoritative current session file.

## Canonical PRD and progress

- Canonical PRD: `.rcs/plans/prd-{slug}.md`
- Startup validation compatibility source: `.rcs/prd.json`
- Canonical progress ledger: `.rcs/state/{scope}/forge-progress.json`
- Legacy compatibility reader: prior pre-Forge progress ledgers are imported forward when encountered.
