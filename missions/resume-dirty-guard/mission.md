# Mission
Ensure `rcs autoresearch --resume <run-id>` fails cleanly when the referenced worktree is dirty.

Primary target:
- resume validation / guard behavior in autoresearch CLI/runtime

Success means:
1. resume rejects dirty worktrees with an actionable error
2. no silent reset or unsafe continuation occurs
3. focused resume-guard tests pass
