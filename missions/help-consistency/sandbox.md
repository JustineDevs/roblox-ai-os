---
evaluator:
  command: node scripts/eval-help-consistency.js
  format: json
  keep_policy: pass_only
---
Stay tightly scoped to help/test/fixture consistency for `rcs autoresearch`.

Allowed changes:
- CLI help text
- help fixtures
- targeted tests that assert help output

Avoid:
- runtime behavior changes
- worktree/runtime/autoresearch loop changes
- unrelated documentation churn

A passing outcome is one where the focused help-consistency test passes and nearby help assertions remain coherent.
