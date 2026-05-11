---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "mission"
---

# GUI Onboarding Clarity

Improve first-session onboarding and HUD clarity for a Roblox experience so players understand progression, controls, and next actions without noisy UI churn.

## Creator Outcome

Give the creator a clearer onboarding/UI contract they can implement inside Studio surfaces.

## Player Outcome

Players should understand controls, progression, and next actions quickly without confusing UI churn.

## Deliverable
- onboarding UI flow notes
- HUD state ownership boundaries
- client/server state mirrors
- player messaging and empty-state guidance
- verification notes for first-session comprehension

## Roblox Touchpoints
- `StarterGui`
- `PlayerGui`
- `ScreenGui`
- client `LocalScript`
- shared onboarding state modules

## Required Services
- `StarterGui`
- `PlayerGui`
- onboarding state modules
- authoritative progression or unlock state source

## Acceptance Signals
- first-session players can identify the next action without reading dense text walls
- HUD guidance reflects authoritative unlock or progression state
- the creator can name which UI states are purely presentational versus server-authoritative

## Server-Authority Risks

- stale UI mirroring non-authoritative state
- onboarding guidance implying actions the server later rejects

## Anti-Patterns
- stacking multiple modal interruptions at first spawn
- showing progression or unlock prompts from stale client guesses
- copying generic website layout patterns into Studio HUD work

## Forbidden Language
- website admin panel or page-router framing
- enterprise UX workshop jargon
- generic web onboarding metaphors

## Reference Layers
- `playground/gui_onboarding_lab/`
- `templates/roblox-scripts/` for UI anti-pattern spotting only

## Validation

- verify first-session comprehension path
- verify HUD state reflects authoritative game state
