# Studio Plugin Source

This directory is the canonical source layout for Roblox Studio plugin work.

Expected modules:
- `PluginMain.luau` — plugin bootstrap
- `Toolbar.luau` — toolbar/button registration
- `Widget.luau` — `DockWidgetPluginGui` creation and binding
- `Commands.luau` — command registry/actions
- `State.luau` — plugin-local state and persistence boundaries

These files define the source standard even if plugin packaging/build integration evolves later.
