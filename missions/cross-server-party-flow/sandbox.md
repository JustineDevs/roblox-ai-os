---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "sandbox"
---

evaluation:
  command: node dist/scripts/eval/eval-cross-server-party-flow.js

scope:
  statement: Scope only Roblox cross-server party and queue flow.

tightly_scoped_to:
- `playground/party_queue_lab/`

out_of_scope:
- generic distributed-systems redesign

required_services:
- `TeleportService`
- party state modules
- queue remotes

acceptance_signals:
- party ownership stays coherent across queue and teleport transitions
- stale members are cleaned up without deleting valid party state

anti_patterns:
- client-only party truth
- distributed-systems jargon without player-state mapping

forbidden_language:
- service-mesh bus
- generic shard-router framing
- client-trusted readiness

reference_layers:
- `playground/party_queue_lab/`
- `templates/roblox-scripts/` for handoff anti-pattern review only

vocabulary_guardrail:
- favor concrete player lifecycle rules over generic distributed-systems language
