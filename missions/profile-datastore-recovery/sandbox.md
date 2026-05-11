---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "sandbox"
---

evaluation:
  command: node dist/scripts/eval/eval-profile-datastore-recovery.js

scope:
  statement: Scope only Roblox persistence and recovery flows.

tightly_scoped_to:
- `playground/profile_datastore_lab/`

out_of_scope:
- generic backend persistence redesign

required_services:
- `DataStoreService`
- profile/session lock modules
- retry/backoff queue

acceptance_signals:
- stale writes are bounded and rejected safely
- reconnect recovery does not trust stale client mirrors

anti_patterns:
- SQL-shaped persistence redesign proposals
- unconstrained retry loops

forbidden_language:
- generic database failover
- backend service tier
- ORM-style persistence framing

reference_layers:
- `playground/profile_datastore_lab/`
- `templates/roblox-scripts/` for recovery anti-pattern review only

vocabulary_guardrail:
- do not introduce generic backend persistence jargon where a Roblox pattern is enough
