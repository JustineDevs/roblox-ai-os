# Mission
Bring `rcs autoresearch` to parity with the currently approved full-parity plan in one bounded sweep.

Primary targets:
- fresh run-tagged lanes
- explicit `--resume <run-id>` behavior
- repo-root active-run pointer/lock
- authoritative per-run manifest state
- repo-root `candidate.json` handoff
- keep / discard / ambiguous / error handling
- reset-safe worktree-local runtime files
- aligned docs/help/contracts/tests

Success means:
1. build passes
2. focused parity tests pass
3. help/docs/contracts describe the same behavior
4. no remaining known parity blocker from the current PRD/test-spec remains unimplemented
