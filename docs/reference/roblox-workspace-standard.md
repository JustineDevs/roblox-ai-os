# Roblox Workspace Standard

Status: canonical Roblox Studio workspace layer for active repository development.

## Purpose

This repo is no longer just a CLI/runtime layer. It now defines a baseline Roblox Studio
workspace standard so creator work can live in source-controlled Luau artifacts instead of
only in prompts, docs, and playground notes.

Optional live Studio truth can be layered on top through:
- [`docs/reference/robloxstudio-mcp-compatibility.md`](./robloxstudio-mcp-compatibility.md)

## Canonical Workspace Files

- `default.project.json` — Rojo source-of-truth mapping into Roblox Studio services
- `wally.toml` — Roblox package manifest
- `aftman.toml` — pinned local toolchain for Rojo, Wally, StyLua, Selene, and Lune
- `stylua.toml` — Luau formatter rules
- `selene.toml` — Luau lint rules

## Canonical Source Tree

Active Roblox source now lives under:

- `src/roblox/ReplicatedFirst/`
- `src/roblox/ReplicatedStorage/`
- `src/roblox/ServerScriptService/`
- `src/roblox/ServerStorage/`
- `src/roblox/StarterGui/`
- `src/roblox/StarterPlayer/`
- `src/roblox/TestService/`
- `src/roblox/Workspace/`

## GUI Stack Decision

Greenfield default for this repo is:
- strict Luau
- `ScreenGui` / `Frame` / `TextLabel` / `TextButton` / `UIListLayout` style Studio primitives
- shared design-token modules under `ReplicatedStorage`
- client controllers under `StarterPlayerScripts` or `StarterGui`

Do not assume Roact, ReactLua, or Fusion as the default stack unless repo evidence explicitly
introduces one. RCS should prefer a plain Studio-native baseline first.

## Plugin Source Standard

Studio plugin source should live under:
- `src/studio-plugin/`

Expected module slices:
- `PluginMain.luau`
- `Toolbar.luau`
- `Widget.luau`
- `Commands.luau`
- `State.luau`

This is the canonical source layout for plugin work, even if plugin packaging/build flow
evolves later.

## Test Standard

Roblox workspace verification should include:
- `--!strict` Luau modules by default
- `TestService` specs for critical shared/runtime contracts
- lint/format toolchain via Selene + StyLua
- optional future package/framework adoption only when repo evidence justifies it
- optional live Studio MCP inspection/write lane only when the creator explicitly enables the upstream plugin/server standard

## Asset and GUI Artifact Standard

Shared creator-facing asset contracts should live under:
- `ReplicatedStorage/Assets/`
- `ReplicatedStorage/Gui/`

Use manifest modules for:
- icons
- sounds
- image ids
- design tokens
- widget/layout constants

Do not scatter raw asset ids or visual constants across unrelated scripts.
