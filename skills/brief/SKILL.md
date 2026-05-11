---
name: brief
description: Canonical creator briefing surface for Roblox Creator Skills
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "skill"
---

# Brief

Use `$brief` to capture the request, audience, goals, constraints, non-goals, genre, and desired creator outcome before blueprinting or forging.

For Roblox tasks, `$brief` is also the **mandatory pre-action start**. Do not generate code, file scaffolds, systems, UI, monetization logic, or refactors until the pre-action plan is complete.

Required first artifact:
- `templates/roblox/pre-action-plan.md`

Use the protocol in:
- `docs/reference/roblox-pre-action-protocol.md`

`PRE_ACTION_COMPLETE` remains `false` until:
- Roblox references were gathered
- official terms were normalized
- the modular file tree exists
- category ownership is defined
- implementation phases and validation checkpoints are written

Follow with:
- `$brief:audience`
- `$brief:motivation`
surface-class: "canonical"
domain: "creator-runtime"
audience: "creator"
