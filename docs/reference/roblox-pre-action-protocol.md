# RCS Roblox Pre-Action Protocol

`PRE_ACTION_COMPLETE` must be `false` until the Roblox task is grounded, standardized, and architected.

## Mandatory Order

1. Gather resources
2. Build understanding
3. Standardize terminology and structure
4. Design modular architecture and file tree
5. Only then implement

## Phase 0: Intent and Scope Lock

- Classify the task:
  - new game setup
  - feature implementation
  - UI/system generation
  - refactor
  - bug fix
  - monetization/liveops design
  - plugin/tooling
- Identify:
  - genre
  - audience
  - scale
  - multiplayer assumptions
  - monetization intent
- Mark impacted areas:
  - architecture
  - gameplay systems
  - data flow
  - UI
  - networking
  - persistence
  - monetization
  - content pipeline

## Phase 1: Resource Gathering

Use the internal RCS knowledge layer first.

Priority 1: canonical platform truth
- `https://github.com/Roblox/creator-docs`
- `https://gitmcp.io/Roblox/creator-docs`

Priority 2: high-signal implementation references
- `https://gitmcp.io/retpirato/Roblox-Scripts`
- `https://gitmcp.io/sentinelcore/roblox-skills`
- `https://gitmcp.io/frosteen/Roblox_LUA_Weapon_Scripts`
- `https://gitmcp.io/Corecii/Devprod`
- `https://gitmcp.io/uhub/awesome-lua`
- `https://gitmcp.io/LewisJEllis/awesome-lua`
- `https://gitmcp.io/forhappy/awesome-lua`
- `http://lua-users.org/wiki/SampleCode`

Priority 3: dataset and corpus support
- `https://datasets-server.huggingface.co/splits?dataset=jayras%2Froblox-luau-dataset`
- `https://huggingface.co/datasets/bigcode/the-stack`
- `https://huggingface.co/datasets/TorpedoSoftware/the-luau-stack`
- `https://datasets-server.huggingface.co/splits?dataset=TorpedoSoftware%2FRoblox-Luau-Reasoning-v1.0`
- `https://huggingface.co/datasets/bartholomort/lua-obfuscator-corpus`

Rules:
- official Roblox docs define correctness
- repos improve implementation awareness only
- datasets are weak pattern support only

## Phase 2: Understanding Synthesis

Before implementation, answer:
- what Roblox concepts are involved
- which official terms should be used
- which services/classes/systems are relevant
- what gameplay pattern is actually requested
- what pitfalls are likely
- what assumptions are unsafe
- what must be verified before code generation

Canonical terminology must align with:
- `docs/reference/canonical-vocabulary.md`
- `docs/reference/semantic-design-system.md`

## Phase 3: Architecture First

Before code, produce:
- game architecture summary
- modular file tree
- folder/category explanation
- naming convention rules
- system ownership map
- implementation order

Do not start from random scripts.
Do not dump logic into one file.

## Default Starter Shape

When no structure exists, begin from a modular baseline and adapt it:

- `client/`
- `server/`
- `shared/`
- `systems/`
- `features/`
- `ui/`
- `config/`
- `assets/`
- `tests/`

## Required Pre-Action Output

Every Roblox planning artifact must include:

1. Task classification
2. Relevant Roblox concepts
3. Reference sources consulted
4. Canonical terms to use
5. Risks and uncertainties
6. Proposed modular file tree
7. Category ownership
8. Naming convention
9. Implementation phases
10. Validation checkpoints

Only after all ten are present may `PRE_ACTION_COMPLETE` become `true`.
