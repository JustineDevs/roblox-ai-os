---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "sandbox"
---

evaluation:
  command: node dist/scripts/eval/eval-remote-contract-hardening.js

scope:
  statement: Scope only Roblox remote boundaries and server-authority rules.

tightly_scoped_to:
- `playground/remote_contract_lab/`

out_of_scope:
- unrelated CLI/runtime work

required_services:
- `RemoteEvent`
- `RemoteFunction`
- server-side validator modules

acceptance_signals:
- authoritative server validation precedes protected mutations
- duplicate submissions resolve without double grants

anti_patterns:
- client-authored currency or inventory truth
- generic API handler framing without Roblox remote ownership

forbidden_language:
- REST endpoint
- controller/repository
- backend gateway

reference_layers:
- `playground/remote_contract_lab/`
- `templates/roblox-scripts/` for anti-pattern review only

vocabulary_guardrail:
- prefer RemoteEvent / RemoteFunction / server authority language over generic API or backend terminology
