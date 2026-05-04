# Autoresearch pilot missions

These mission bundles are **autoresearch-ready pilots** for this repo snapshot.

Each mission directory contains:
- `mission.md` — objective, scope, and expected deliverable
- `sandbox.md` — evaluator contract plus safety/operating rules

Current pilots / examples:
- `cli-discoverability-pilot/`
- `security-path-traversal-pilot/`
- `in-action-cat-shellout-demo/` — a small self-hosted RCS optimization demo that removes the autoresearch loop's manifest `cat` shell-out and proves the fix with a focused evaluator

You can run the evaluators directly today:

```bash
node scripts/eval-cli-discoverability.js
node scripts/eval-security-path-traversal.js
node scripts/eval-in-action-cat-shellout-demo.js
```

To see a real end-to-end run, launch:

```bash
rcs autoresearch missions/in-action-cat-shellout-demo
```

Then inspect `.rcs/logs/autoresearch/<run-id>/manifest.json`, `candidate.json`, and `iteration-ledger.json` to see the supervisor's keep/discard/stop decisions.

These bundles are designed to be first-class `rcs autoresearch` missions rather than generic prose examples.
