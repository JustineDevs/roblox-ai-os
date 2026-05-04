# Hooks Extension (Custom Plugins)

RCS supports an additive hooks extension point for user plugins under `.rcs/hooks/*.mjs`.

The official packaged Codex plugin at `plugins/roblox-ai-os-creator-skills` also ships plugin-scoped
companion metadata files (`.mcp.json`, `.app.json`) so the plugin bundle describes those
surfaces from inside the plugin root. Native/runtime hooks are intentionally separate:
they stay on the runtime/config side (`.codex/hooks.json` plus `.rcs/hooks/*.mjs`) rather
than inside the installable plugin manifest.

Native Codex hook ownership is documented separately in
[Codex native hook mapping](./codex-native-hooks.md). In short:

- `.codex/hooks.json` = native Codex hook registrations installed by `rcs setup`
- `.rcs/hooks/*.mjs` = RCS plugin hooks dispatched by runtime/native events
- `rcs tmux-hook` / notify-hook / derived watcher = tmux/runtime fallback surfaces

`rcs setup` treats `.codex/hooks.json` as a shared-ownership file: it refreshes only the RCS-managed
wrapper entries that invoke `dist/scripts/codex-native-hook.js` and preserves user hook entries in the
same file. `rcs uninstall` removes only those RCS-managed wrappers and leaves `.codex/hooks.json` in
place when user hooks remain.

> Compatibility guarantee: `rcs tmux-hook` remains fully supported and unchanged.
> The new `rcs hooks` command group is additive and does **not** replace tmux-hook workflows.

## Quick start

```bash
rcs hooks init
rcs hooks status
rcs hooks validate
rcs hooks test
```

This creates a scaffold plugin at:

- `.rcs/hooks/sample-plugin.mjs`

## Enablement model

Plugins are **enabled by default**.

Disable plugin dispatch explicitly:

```bash
export RCS_HOOK_PLUGINS=0
```

Optional timeout tuning (default: 1500ms):

```bash
export RCS_HOOK_PLUGIN_TIMEOUT_MS=1500
```

## Native event pipeline (v1)

Native/derived plugin events come from two places:

1. Existing lifecycle/notify paths
2. Native Codex hook entrypoint dispatch (`dist/scripts/codex-native-hook.js`)

Current event vocabulary exposed to RCS plugins:

- `session-start`
- `keyword-detector`
- `pre-tool-use`
- `post-tool-use`
- `stop`
- `session-end`
- `turn-complete`
- `session-idle`

RCS keeps this existing event vocabulary rather than exposing raw Codex hook names directly.
That lets native Codex hooks and fallback/derived paths feed one shared plugin/runtime surface.

For clawhip-oriented operational routing, see [Clawhip Event Contract](./clawhip-event-contract.md).

Envelope fields include:

- `schema_version: "1"`
- `event`
- `timestamp`
- `source` (`native` or `derived`)
- `context`
- optional IDs: `session_id`, `thread_id`, `turn_id`, `mode`

## Derived signals (opt-in)

Best-effort derived events are gated and disabled by default.

```bash
export RCS_HOOK_DERIVED_SIGNALS=1
```

Derived signals include:

- `needs-input`
- `pre-tool-use`
- `post-tool-use`

Derived events are labeled with:

- `source: "derived"`
- `confidence`
- parser-specific context hints

## Team-safety behavior

In team-worker sessions (`RCS_TEAM_WORKER` set), plugin side effects are skipped by default.
This keeps the lead session as the canonical side-effect emitter and avoids duplicate sends.

## Plugin contract

Each plugin must export:

```js
export async function onHookEvent(event, sdk) {
  // handle event
}
```

SDK surface includes:

- `sdk.tmux.sendKeys(...)`
- `sdk.log.info|warn|error(...)`
- `sdk.state.read|write|delete|all(...)` (plugin namespace scoped)
- `sdk.rcs.session.read()`
- `sdk.rcs.hud.read()`
- `sdk.rcs.notifyFallback.read()`
- `sdk.rcs.updateCheck.read()`

`sdk.rcs` is intentionally narrow and read-only in pass one. These helpers read the
repo-root `.rcs/state/*.json` runtime files for the current workspace.

Compatibility notes:

- `rcs tmux-hook` remains a CLI/runtime workflow, not `sdk.rcs.tmuxHook.*`
- pass one does not add `sdk.rcs.tmuxHook.*`; tmux plugin behavior stays on `sdk.tmux.sendKeys(...)`
- pass one does not add generic `sdk.rcs.readJson(...)`, `sdk.rcs.list()`, or `sdk.rcs.exists()`
- pass one does not add `sdk.pluginState`; keep using `sdk.state`

## Logs

Plugin dispatch and plugin logs are written to:

- `.rcs/logs/hooks-YYYY-MM-DD.jsonl`
