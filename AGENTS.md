## Learned User Preferences

- Keep public docs, changelog, and release notes free of legacy `.omx` / oh-my-codex naming; align shipped narrative with RCS / roblox-ai-os branding rather than local-only `.omx` paths.
- When doing migration or repo cleanup, treat the user’s local `.omx/` folders on disk as out-of-repo scope unless they explicitly ask to delete or rewrite those local directories.

## Learned Workspace Facts

- Notify-fallback-watcher work spans `src/scripts/notify-fallback-watcher.ts`, `src/scripts/notify-hook/` (for example team leader nudge, process runner, tmux injection), and `src/hooks/__tests__/notify-fallback-watcher.test.ts` for Ralph steer, authority handoff, and related hook behavior.
- On Windows, Node tests in this tree that shell out to fake `tmux` or prepend fake bins to `PATH` should use `path.delimiter`, resolve `dist/` script paths with `fileURLToPath(new URL(..., import.meta.url))` instead of `URL#pathname`, and use bash-backed shims when the harness relies on `#!/usr/bin/env bash` stubs.
