---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "sandbox"
---

evaluation:
  command: node dist/scripts/eval/eval-gui-onboarding-clarity.js

scope:
  statement: Scope only Roblox onboarding and GUI state flow.

tightly_scoped_to:
- `playground/gui_onboarding_lab/`

out_of_scope:
- enterprise UX process language

required_services:
- `StarterGui`
- `PlayerGui`
- onboarding state modules

acceptance_signals:
- first-session players can identify the next action quickly
- HUD messaging stays aligned with authoritative progression state

anti_patterns:
- website admin panel framing
- modal overload during the first playable minute

forbidden_language:
- website admin panel
- page-router stack
- enterprise design-system jargon

reference_layers:
- `playground/gui_onboarding_lab/`
- `templates/roblox-scripts/` for UI anti-pattern review only

vocabulary_guardrail:
- keep language player-facing and creator-facing, not enterprise UX jargon
