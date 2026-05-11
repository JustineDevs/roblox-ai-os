---
name: help
description: Guide on using Roblox Creator Skills
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# RCS Help

RCS uses creator-facing workflow triggers as the primary public surface:

- `$brief` for request, audience, and goal clarification
- `$blueprint` for structured design and planning artifacts
- `$forge` for concrete creator-facing deliverables and specs
- `$crew` for coordinated multi-role creator workflows
- `$autoforge` for end-to-end creator workflow execution

## Psychology-aware commands

- `$brief:audience`
- `$brief:motivation`
- `$blueprint:psych`
- `$blueprint:loop`
- `$blueprint:retention`
- `$blueprint:social`
- `$forge:reward-loop`
- `$forge:daily-loop`
- `$forge:event-loop`
- `$forge:progression`
- `$forge:status`
- `$forge:fomo`
- `$forge:mastery`
- `$forge:community`

## Use the command family like this

```text
$brief "farming simulator for mobile-first Roblox sessions"
$brief:audience "who is this for and why do they return?"
$brief:motivation "rank progression, status, FOMO, mastery, and community"
$blueprint:psych "design the game from player desire backward"
$blueprint:loop "define session, daily, weekly, and comeback loops"
$forge:progression "write the progression ladder"
$forge:community "write the social stickiness systems"
```

## Runtime operators

These are advanced lower-level runtime surfaces, not the primary public creator workflow:

- `rcs setup` installs prompts, skills, hooks, and runtime wiring
- `rcs doctor` checks install health
- `rcs team` runs the lower-level durable tmux-backed team runtime
- `rcs forge` runs the lower-level persistent completion loop
- `rcs explore` and `rcs sparkshell` cover read-only repo lookup and bounded shell inspection

## Roblox Implementation Gate

Before any Roblox game setup, system design, code generation, UI work, monetization design, plugin work, or refactor:

1. gather resources
2. build understanding
3. standardize terminology and structure
4. design the modular architecture and file tree
5. only then execute implementation

Use:
- `docs/reference/roblox-pre-action-protocol.md`
- `templates/roblox/pre-action-plan.md`

## References

- `docs/reference/player-psychology-framework.md`
- `docs/reference/player-psychology-command-surfaces.md`
- `docs/reference/roblox-pre-action-protocol.md`
- `templates/psychology/`
- `templates/roblox/`
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
