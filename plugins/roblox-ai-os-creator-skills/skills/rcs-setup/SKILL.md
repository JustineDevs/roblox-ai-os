---
name: rcs-setup
description: Setup and configure Roblox Creator Skills using current CLI behavior
---

# RCS Setup

Use this skill when users want to install or refresh Roblox Creator Skills for the **current project plus user-level RCS directories**.

## Command

```bash
rcs setup [--force] [--merge-agents] [--dry-run] [--verbose] [--scope <user|project>] [--plugin|--legacy|--install-mode <legacy|plugin>]
```

If you only want lightweight `AGENTS.md` scaffolding for an existing repo or subtree, use `rcs agents-init [path]` instead of full setup.

Supported setup flags (current implementation):
- `--force`: overwrite/reinstall managed artifacts where applicable
- `--merge-agents`: when `AGENTS.md` already exists, preserve user-authored content and insert/refresh RCS-managed generated sections between explicit `<!-- RCS:AGENTS:START -->` / `<!-- RCS:AGENTS:END -->` markers
- `--dry-run`: print actions without mutating files
- `--verbose`: print per-file/per-step details
- `--scope`: choose install scope (`user`, `project`)
- `--plugin`: use Codex plugin delivery for bundled skills while archiving/removing legacy RCS-managed prompts/native agents and keeping setup-owned runtime hooks
- `--legacy`: use legacy setup delivery, overriding any persisted plugin install mode
- `--install-mode`: explicitly choose setup delivery mode (`legacy` or `plugin`); canonical form for scripted setup

## What this setup actually does

`rcs setup` performs these steps:

1. Resolve setup scope:
   - `--scope` explicit value
   - else persisted `./.rcs/setup-scope.json` (with automatic migration of legacy values)
   - if a TTY user has persisted setup preferences, `rcs setup` first summarizes the recorded choices and asks whether to **keep**, **review/change**, or **reset** them
   - else interactive prompt on TTY (default `user`)
   - else default `user` (safe for CI/tests)
2. If scope is `user`, resolve user skill delivery mode:
   - explicit `--plugin`, `--legacy`, or `--install-mode legacy|plugin`, if present
   - persisted install mode in `./.rcs/setup-scope.json`, if present and the TTY review decision is `keep`
   - else discovered installed plugin cache under `${CODEX_HOME:-~/.codex}/plugins/cache/**/.codex-plugin/plugin.json` with `name: roblox-ai-os-creator-skills` makes `plugin` the default
   - else interactive prompt on TTY (`legacy` by default, or `plugin` when a plugin cache is discovered)
   - else default `legacy` unless a plugin cache is discovered
3. Create directories and persist effective scope/install mode
4. In legacy mode, install prompts/native agents/skills and merge full config.toml. In plugin mode, archive/remove legacy RCS-managed prompts/native agents/skills but keep native Codex hooks installed.
5. Verify Team CLI API interop markers exist in built `dist/cli/team.js`
6. Generate AGENTS.md defaults only when selected/allowed (or legacy behavior outside plugin mode)
7. Configure notify hook references outside plugin mode and write `./.rcs/hud-config.json`

## Important behavior notes

- `rcs setup` prompts for scope when no scope is provided and stdin/stdout are TTY. If `./.rcs/setup-scope.json` already exists, setup now summarizes the saved choices first and asks whether to keep them, review/change them, or reset and behave like a fresh setup run.
- Non-interactive setup never blocks for this review prompt: it keeps deterministic CLI/persisted/default behavior for CI and scripted installs.
- In `user` scope, `rcs setup` also prompts for skill delivery mode when no prior install mode is kept; installed plugin cache discovery makes plugin mode the default prompt/non-interactive choice.
- Local project orchestration file is `./AGENTS.md` (project root).
- If `AGENTS.md` exists and neither `--force` nor `--merge-agents` is used, interactive TTY runs ask whether to overwrite. Non-interactive runs preserve the file.
- Use `--merge-agents` to keep existing project guidance while allowing setup to refresh RCS-managed AGENTS sections and the generated model capability table idempotently.
- Scope targets:
  - `user`: user directories (`~/.codex`, `~/.codex/skills`, `~/.rcs/agents`)
  - `project`: local directories (`./.codex`, `./.codex/skills`, `./.rcs/agents`)
- User-scope skill delivery targets:
  - `legacy`: keep installing/updating RCS skills in the resolved user skill root
  - `plugin`: rely on Codex plugin discovery for bundled skills and archive/remove legacy RCS-managed prompts/skills/native agents; setup still installs native Codex hooks and `codex_hooks = true` because plugins do not carry hooks.
- Migration hint: in `user` scope, if historical `~/.agents/skills` still exists alongside `${CODEX_HOME:-~/.codex}/skills`, current setup prints a cleanup hint. **Why the paths differ**: `${CODEX_HOME:-~/.codex}/skills/` is the path current Codex CLI natively loads as its skill root; `~/.agents/skills/` was the skill root in an older Codex CLI release before `~/.codex` became the standard home directory. RCS writes only to the canonical `${CODEX_HOME:-~/.codex}/skills/` path. When both directories exist simultaneously, Codex discovers skills from both trees and may show duplicate entries in Enable/Disable Skills. Archive or remove `~/.agents/skills/` to resolve this.
- If persisted scope is `project`, `rcs` launch automatically uses `CODEX_HOME=./.codex` unless user explicitly overrides `CODEX_HOME`.
- Plugin mode prompts separately for optional AGENTS.md defaults and optional `developer_instructions` defaults. If `developer_instructions` already exists, setup asks before overwriting it; non-interactive runs preserve it.
- With `--force` or `--merge-agents`, AGENTS updates may still be skipped if an active RCS session is detected (safety guard).
- Legacy persisted scope values (`project-local`) are automatically migrated to `project` with a one-time warning.

## Setup-owned configuration surfaces

Use this map when reconciling setup behavior or debugging a confusing install:

| Surface | Owner | Notes |
| --- | --- | --- |
| `./.rcs/setup-scope.json` | `rcs setup` | Persists setup scope and user-scope skill delivery mode. TTY reruns summarize it and offer keep/review/reset. |
| `~/.codex/config.toml` / `./.codex/config.toml` | `rcs setup` generated blocks + user edits | Setup refreshes RCS-managed blocks while preserving supported manual content. |
| `~/.codex/hooks.json` / `./.codex/hooks.json` | `rcs setup` shared ownership | Setup owns RCS native hook wrappers and preserves user-owned hooks. |
| prompts, skills, native agents | `rcs setup` or Codex plugin delivery | Legacy mode installs local files; plugin mode relies on plugin discovery for bundled skills and archives/removes legacy RCS-managed prompt/native-agent copies. |
| `AGENTS.md` | `rcs setup` with overwrite safety | Generated defaults or managed refreshes are guarded by force/session checks. |
| `./.rcs/hud-config.json` | `rcs setup` / `$hud` | Setup creates the focused default; `$hud` can adjust it later. |
| notification hooks | `rcs setup` / `$configure-notifications` | Setup wires defaults outside plugin skill delivery; notification skill owns deeper provider configuration. |

## If `$rcs-setup` is missing or stale

The source repo ships `skills/rcs-setup/SKILL.md` and the catalog marks it active. If Codex does not show `$rcs-setup`, treat it as an installation/discovery issue rather than a missing source skill:

1. Run `rcs setup --verbose` in the intended scope.
2. Run `rcs doctor` and check the reported setup scope, Codex home, skill root, and hook/config status.
3. If using project scope, confirm `./.codex/skills/rcs-setup/SKILL.md` exists.
4. If using user scope, confirm `${CODEX_HOME:-~/.codex}/skills/rcs-setup/SKILL.md` exists in legacy mode, or that the Roblox Creator Skills plugin is installed/discovered in plugin mode.
5. If duplicate/stale skills appear, check for legacy `~/.agents/skills` overlap and follow the cleanup hint printed by setup/doctor.

## Recommended workflow

1. Run setup:

```bash
rcs setup --force --verbose
```

2. Verify installation:

```bash
rcs doctor
```

3. Start Codex with RCS in the target project directory.

## Expected verification indicators

From `rcs doctor`, expect:
- Prompts installed (scope-dependent: user or project)
- Skills installed (scope-dependent: user or project)
- AGENTS.md found in project root
- `.rcs/state` exists
- RCS MCP servers configured in scope target `config.toml` (`~/.codex/config.toml` or `./.codex/config.toml`)

## Troubleshooting

- If using local source changes, run build first:

```bash
npm run build
```

- If your global `rcs` points to another install, run local entrypoint:

```bash
node bin/rcs.js setup --force --verbose
node bin/rcs.js doctor
```

- If AGENTS.md was not overwritten during `--force`, stop active RCS session and rerun setup.
- If AGENTS.md was not merged during `--merge-agents`, stop active RCS session and rerun setup.
