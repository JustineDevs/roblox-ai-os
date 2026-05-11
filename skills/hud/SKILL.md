---
name: "hud"
description: "Show or configure the RCS HUD (two-layer statusline)"
role: "display"
scope: ".rcs/**"
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# HUD Skill

The RCS HUD uses a two-layer architecture:

1. **Layer 1 - Codex built-in statusLine**: Real-time TUI footer showing model, git branch, and context usage. Configured via `[tui] status_line` in `~/.codex/config.toml`. Zero code required.

2. **Layer 2 - `rcs hud` CLI command**: Shows RCS-specific workflow state (forge, ultrawork, autopilot, team, pipeline, ecomode, turns). Reads `.rcs/state/` files.

## Quick Commands

| Command | Description |
|---------|-------------|
| `rcs hud` | Show current HUD (modes, turns, activity) |
| `rcs hud --watch` | Live-updating display (polls every 1s) |
| `rcs hud --json` | Raw state output for scripting |
| `rcs hud --preset=minimal` | Minimal display |
| `rcs hud --preset=focused` | Default display |
| `rcs hud --preset=full` | All elements |

## Presets

### minimal
```
[RCS] forge:3/10 | turns:42
```

### focused (default)
```
[RCS] forge:3/10 | ultrawork | team:3 workers | turns:42 | last:5s ago
```

### full
```
[RCS] forge:3/10 | ultrawork | autopilot:execution | team:3 workers | pipeline:exec | turns:42 | last:5s ago | total-turns:156
```

## Setup

`rcs setup` automatically configures both layers:
- Adds `[tui] status_line` to `~/.codex/config.toml` (Layer 1)
- Writes `.rcs/hud-config.json` with default preset (Layer 2)
- Default preset is `focused`; if HUD/statusline changes do not appear, restart Codex CLI once.

## Layer 1: Codex Built-in StatusLine

Configured in `~/.codex/config.toml`:
```toml
[tui]
status_line = ["model-with-reasoning", "git-branch", "context-remaining"]
```

Available built-in items (Codex CLI v0.101.0+):
`model-name`, `model-with-reasoning`, `current-dir`, `project-root`, `git-branch`, `context-remaining`, `context-used`, `five-hour-limit`, `weekly-limit`, `codex-version`, `context-window-size`, `used-tokens`, `total-input-tokens`, `total-output-tokens`, `session-id`

## Layer 2: RCS Workflow HUD

The `rcs hud` command reads these state files:
- `.rcs/state/forge-state.json` - Forge loop iteration
- `.rcs/state/ultrawork-state.json` - Ultrawork mode
- `.rcs/state/autopilot-state.json` - Autopilot phase
- `.rcs/state/team-state.json` - Team workers
- `.rcs/state/pipeline-state.json` - Pipeline stage
- `.rcs/state/ecomode-state.json` - Ecomode active
- `.rcs/state/hud-state.json` - Last activity (from notify hook)
- `.rcs/metrics.json` - Turn counts

## Configuration

HUD config stored at `.rcs/hud-config.json`:
```json
{
  "preset": "focused"
}
```

## Color Coding

- **Green**: Normal/healthy
- **Yellow**: Warning (forge >70% of max)
- **Red**: Critical (forge >90% of max)

## Troubleshooting

If the TUI statusline is not showing:
1. Ensure Codex CLI v0.101.0+ is installed
2. Run `rcs setup` to configure `[tui]` section
3. Restart Codex CLI

If `rcs hud` shows "No active modes":
- This is expected when no workflows are running
- Start a workflow (forge, autopilot, etc.) and check again
