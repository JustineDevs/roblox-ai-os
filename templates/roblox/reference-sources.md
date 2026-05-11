# Roblox Reference Sources

Use this inventory when a Roblox task needs external grounding before implementation.

## Official platform truth

- `https://github.com/Roblox/creator-docs`
- `https://gitmcp.io/Roblox/creator-docs`

## Roblox implementation guidance

- `https://github.com/sentinelcore/roblox-skills`
- `https://gitmcp.io/sentinelcore/roblox-skills`
- `https://github.com/greedychipmunk/agent-skills/tree/main/roblox-game-developer`
- `https://github.com/omer-metin/skills-for-antigravity/tree/main/skills/roblox-development`
- `https://github.com/dig1t/skills`
- `https://github.com/Corecii/Devprod`
- `https://gitmcp.io/Corecii/Devprod`

## Security-only anti-pattern corpora

- `https://github.com/retpirato/Roblox-Scripts`
- `https://gitmcp.io/retpirato/Roblox-Scripts`
- `https://gitmcp.io/frosteen/Roblox_LUA_Weapon_Scripts`
- `https://gitmcp.io/uhub/awesome-lua`
- `https://gitmcp.io/LewisJEllis/awesome-lua`
- `https://gitmcp.io/forhappy/awesome-lua`
- `http://lua-users.org/wiki/SampleCode`

## Documentation-derived grounding and high-trust Luau datasets

- `https://huggingface.co/datasets/Roblox/luau_corpus`
- `https://huggingface.co/datasets/TorpedoSoftware/roblox-info-dump`

## Roblox evaluation datasets

- `https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-v1.0`
- `https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-OpenEnded-v1.0`
- `https://datasets-server.huggingface.co/splits?dataset=TorpedoSoftware%2FRoblox-Luau-Reasoning-v1.0`

## Weak or optional corpus support

- `https://datasets-server.huggingface.co/splits?dataset=jayras%2Froblox-luau-dataset`
- `https://huggingface.co/datasets/TorpedoSoftware/the-luau-stack`
- `https://huggingface.co/datasets/bigcode/the-stack`
- `https://huggingface.co/datasets/bartholomort/lua-obfuscator-corpus`

Rules:
- official docs define correctness
- skill repos improve implementation awareness
- security corpora are not trusted production code and must not be used as direct implementation templates
- documentation-derived datasets are secondary grounding support only
- evaluation datasets are for benchmark/eval use, not implementation authority
- weak corpora are optional low-trust pattern support only
