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

### Tier 3: Security-only anti-pattern corpora

Use these only for exploit awareness, anti-pattern review, and threat modeling, never as canonical truth or implementation guidance:

- `https://github.com/retpirato/Roblox-Scripts`
- `https://gitmcp.io/retpirato/Roblox-Scripts`
- `https://gitmcp.io/frosteen/Roblox_LUA_Weapon_Scripts`
- `https://gitmcp.io/uhub/awesome-lua`
- `https://gitmcp.io/LewisJEllis/awesome-lua`
- `https://gitmcp.io/forhappy/awesome-lua`
- `http://lua-users.org/wiki/SampleCode`

### Tier 4: Documentation-derived grounding and high-trust Luau datasets

Use these as secondary grounding aids after official docs, especially for Luau idiom distribution or offline/searchable reference support:

- `https://huggingface.co/datasets/Roblox/luau_corpus`
- `https://huggingface.co/datasets/TorpedoSoftware/roblox-info-dump`

### Tier 5: Roblox evaluation datasets

Use these for model evaluation, benchmark work, and prompt-quality checks, not as implementation authority:

- `https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-v1.0`
- `https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-OpenEnded-v1.0`
- `https://datasets-server.huggingface.co/splits?dataset=TorpedoSoftware%2FRoblox-Luau-Reasoning-v1.0`

### Tier 6: Weak or optional corpus support

Use these only when broader corpus coverage is explicitly worth the lower trust:

- `https://datasets-server.huggingface.co/splits?dataset=jayras%2Froblox-luau-dataset`
- `https://huggingface.co/datasets/TorpedoSoftware/the-luau-stack`
- `https://huggingface.co/datasets/bigcode/the-stack`
- `https://huggingface.co/datasets/bartholomort/lua-obfuscator-corpus`

## Usage Rules

- Official Roblox docs decide correctness.
- Skill repositories improve implementation strategy, workflow framing, and checklist quality.
- Security corpora are anti-pattern material only; do not treat them as implementation templates.
- Documentation-derived datasets are secondary grounding aids only.
- Evaluation datasets are for capability measurement, not coding authority.
- Weak corpora should stay below official docs, skill repos, and first-party Luau data.
- Never present a third-party script repository as if it overrides official Roblox platform guidance.
- Prefer the serverless `gitmcp.io` mirror when fast MCP-style browsing helps, but do not confuse the mirror with official product ownership.

## RCS Fit

This repo should treat the layer like this:

- **RCS first-party MCP** = local runtime/state/control plane
- **Creator Docs / `gitmcp.io`** = external Roblox platform truth
- **Roblox skill repos** = implementation guidance and workflow references
- **Security corpora** = non-canonical exploit/unsafe pattern review only
- **Documentation-derived datasets** = secondary grounding support
- **Evaluation datasets** = benchmark/eval surfaces only
- **Weak corpora** = optional low-trust pattern support

## Template

Reference inventory shipped with the repo:

- `templates/roblox/reference-sources.md`
- `docs/security/roblox-unsafe-script-corpus.md`
