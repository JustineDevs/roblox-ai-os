---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "mission"
---

# Live-Ops Reward Loop Balance

Tune a Roblox live-ops reward loop so event rewards, return cadence, urgency, and monetization prompts feel clear and motivating without unfair pressure.

## Creator Outcome

Give the creator a reward-loop balancing artifact they can use to tune cadence, urgency, and monetization guardrails.

## Player Outcome

Players should understand event rewards and urgency without feeling tricked, spammed, or unfairly pressured.

## Deliverable
- event reward loop summary
- cooldown / cadence notes
- retention and comeback hooks
- monetization guardrails
- verification notes for player clarity and fair urgency

## Roblox Touchpoints
- timed rewards
- streaks
- event shops
- currency pacing
- creator marketing hooks

## Required Services
- timed reward state modules
- streak or comeback tracking
- event shop/economy configuration
- monetization prompt placement rules

## Acceptance Signals
- cadence, urgency, and reward value are understandable without manipulative ambiguity
- timed reward grants respect cooldown and progression rules
- the creator can point to explicit guardrails separating fair motivation from pressure tactics

## Server-Authority Risks

- timed rewards granted too often
- urgency messaging disconnected from actual cooldown/state rules
- monetization pressure overriding fair progression pacing

## Anti-Patterns
- fake urgency not backed by real timers or state
- monetization prompts interrupting core progression at every login
- reward loops that depend on vague spreadsheet-only tuning without player-state evidence

## Forbidden Language
- growth-hack or funnel-only framing
- billing-system metaphors for Roblox reward loops
- pressure tactics disguised as retention optimization

## Reference Layers
- `playground/liveops_reward_lab/`
- `templates/roblox-scripts/` for cadence anti-pattern review only

## Validation

- verify clarity of cadence and reward rules
- verify fairness/urgency guardrails
