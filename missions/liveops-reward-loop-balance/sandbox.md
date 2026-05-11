---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "sandbox"
---

evaluation:
  command: node dist/scripts/eval/eval-liveops-reward-loop-balance.js

scope:
  statement: Scope only Roblox live-ops, retention, and reward-loop balancing.

tightly_scoped_to:
- `playground/liveops_reward_lab/`

out_of_scope:
- spreadsheet-only optimization detached from player experience

required_services:
- timed reward state modules
- streak or comeback tracking
- event shop configuration

acceptance_signals:
- urgency messaging matches actual cooldown and reward state
- monetization prompts respect fair progression pacing

anti_patterns:
- fake urgency
- reward tuning detached from creator or player experience

forbidden_language:
- growth-hack funnel
- billing-system metaphor
- pressure-first monetization framing

reference_layers:
- `playground/liveops_reward_lab/`
- `templates/roblox-scripts/` for cadence anti-pattern review only

vocabulary_guardrail:
- keep the language grounded in creator psychology and game design
