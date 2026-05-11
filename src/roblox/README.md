# Roblox Source Tree

This directory is the canonical Roblox Studio workspace source tree for active Luau-facing work.

Service layout:
- `ReplicatedFirst/` boot-time client bootstrap
- `ReplicatedStorage/` shared modules, remotes, design tokens, asset manifests
- `ServerScriptService/` authoritative server runtime
- `ServerStorage/` server-only config or templates
- `StarterGui/` GUI source
- `StarterPlayer/` client runtime bootstrap
- `TestService/` Luau specs and smoke checks
- `Workspace/` mapped workspace-authored objects/config

All active Luau files should default to `--!strict`.
