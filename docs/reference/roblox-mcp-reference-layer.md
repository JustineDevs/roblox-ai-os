# Roblox MCP Reference Layer

Status: canonical external reference-source policy for Roblox-facing RCS work.

## Purpose

RCS has two different MCP/reference layers:

1. **First-party RCS MCP servers**
   - local stdio servers for state, memory, code-intel, trace, and wiki
2. **External Roblox reference sources**
   - official Creator Docs
   - serverless `gitmcp.io` mirrors
   - Roblox-specific skill repositories
   - implementation corpora

This file defines how those external sources should be used.

## Canonical Source Order

### Tier 1: Official platform truth

Use these first when the question is about correctness, APIs, platform behavior, or Creator Hub rules:

- `https://github.com/Roblox/creator-docs`
- `https://gitmcp.io/Roblox/creator-docs`

These define the canonical platform truth.

### Tier 2: High-signal Roblox implementation references

Use these to improve implementation awareness after the official baseline is grounded:

- `https://github.com/sentinelcore/roblox-skills`
- `https://gitmcp.io/sentinelcore/roblox-skills`
- `https://github.com/greedychipmunk/agent-skills/tree/main/roblox-game-developer`
- `https://github.com/omer-metin/skills-for-antigravity/tree/main/skills/roblox-development`
- `https://github.com/dig1t/skills`
- `https://github.com/Corecii/Devprod`
- `https://gitmcp.io/Corecii/Devprod`

### Tier 3: Raw script corpora and broad pattern mining

Use these only as inspiration or anti-pattern review, never as canonical truth:

- `https://github.com/retpirato/Roblox-Scripts`
- `https://gitmcp.io/retpirato/Roblox-Scripts`
- `https://gitmcp.io/frosteen/Roblox_LUA_Weapon_Scripts`
- `https://gitmcp.io/uhub/awesome-lua`
- `https://gitmcp.io/LewisJEllis/awesome-lua`
- `https://gitmcp.io/forhappy/awesome-lua`
- `http://lua-users.org/wiki/SampleCode`

## Usage Rules

- Official Roblox docs decide correctness.
- Skill repositories improve implementation strategy, workflow framing, and checklist quality.
- Raw script corpora are weak signals only; treat them as inspiration or anti-pattern mining.
- Never present a third-party script repository as if it overrides official Roblox platform guidance.
- Prefer the serverless `gitmcp.io` mirror when fast MCP-style browsing helps, but do not confuse the mirror with official product ownership.

## RCS Fit

This repo should treat the layer like this:

- **RCS first-party MCP** = local runtime/state/control plane
- **Creator Docs / `gitmcp.io`** = external Roblox platform truth
- **Roblox skill repos** = implementation guidance and workflow references
- **Raw script corpora** = non-canonical pattern support only

## Template

Reference inventory shipped with the repo:

- `templates/roblox/reference-sources.md`
