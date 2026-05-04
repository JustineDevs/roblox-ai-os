---
name: forge
description: Canonical creator forging surface for Roblox Creator Skills
---

# Forge

Use `$forge` to generate concrete creator-facing deliverables and system specs.

For Roblox tasks, `$forge` is gated by the pre-action protocol.

Do not generate implementation code until:
- `PRE_ACTION_COMPLETE` is `true`
- the modular file tree exists
- categories and naming are standardized
- unsafe Roblox assumptions have been called out and minimized

If the pre-action artifact is missing, stop and produce it first using:
- `docs/reference/roblox-pre-action-protocol.md`
- `templates/roblox/pre-action-plan.md`

Follow with:
- `$forge:reward-loop`
- `$forge:daily-loop`
- `$forge:event-loop`
- `$forge:progression`
- `$forge:status`
- `$forge:fomo`
- `$forge:mastery`
- `$forge:community`
