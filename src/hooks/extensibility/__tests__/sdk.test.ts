import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { createHookPluginSdk, clearHookPluginState } from '../sdk.js';
import type { HookEventEnvelope } from '../types.js';

function makeEvent(event = 'session-start'): HookEventEnvelope {
  return {
    schema_version: '1',
    event,
    timestamp: '2026-01-01T00:00:00.000Z',
    source: 'native',
    context: {},
  };
}

async function writeRcsStateFixtureFile(cwd: string, fileName: string, value: unknown): Promise<void> {
  const stateDir = join(cwd, '.rcs', 'state');
  const targetPath = join(stateDir, fileName);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, JSON.stringify(value, null, 2));
}

describe('createHookPluginSdk', () => {
  describe('state', () => {
    it('reads undefined for missing key', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        const val = await sdk.state.read('nonexistent');
        assert.equal(val, undefined);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns fallback for missing key', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        const val = await sdk.state.read('missing', 42);
        assert.equal(val, 42);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('writes and reads state', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await sdk.state.write('counter', 5);
        const val = await sdk.state.read('counter');
        assert.equal(val, 5);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('deletes state key', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await sdk.state.write('key', 'value');
        await sdk.state.delete('key');
        const val = await sdk.state.read('key');
        assert.equal(val, undefined);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('delete is a no-op for nonexistent key', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await sdk.state.write('keep', 'yes');
        await sdk.state.delete('nonexistent');
        const val = await sdk.state.read('keep');
        assert.equal(val, 'yes');
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('reads all state', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await sdk.state.write('a', 1);
        await sdk.state.write('b', 'two');
        const all = await sdk.state.all();
        assert.deepEqual(all, { a: 1, b: 'two' });
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns empty object for all() with no state', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        const all = await sdk.state.all();
        assert.deepEqual(all, {});
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('rejects empty state key', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await assert.rejects(() => sdk.state.read(''), /state key is required/);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('rejects state key with path traversal', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await assert.rejects(() => sdk.state.read('../escape'), /invalid state key/);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('rejects state key starting with /', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        await assert.rejects(() => sdk.state.write('/absolute', 1), /invalid state key/);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  });

  describe('log', () => {
    it('exposes info, warn, error methods', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        // These should not throw
        await sdk.log.info('test info');
        await sdk.log.warn('test warn');
        await sdk.log.error('test error');
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  });

  describe('tmux.sendKeys', () => {
    it('returns side_effects_disabled when sideEffectsEnabled is false', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'test',
          event: makeEvent(),
          sideEffectsEnabled: false,
        });
        const result = await sdk.tmux.sendKeys({ text: 'hello' });
        assert.equal(result.ok, false);
        assert.equal(result.reason, 'side_effects_disabled');
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns invalid_text for empty text', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'test',
          event: makeEvent(),
          sideEffectsEnabled: true,
        });
        const result = await sdk.tmux.sendKeys({ text: '   ' });
        assert.equal(result.ok, false);
        assert.equal(result.reason, 'invalid_text');
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns loop_guard_input_marker when text contains loop marker', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      const originalMarker = process.env.RCS_HOOK_PLUGIN_LOOP_MARKER;
      try {
        process.env.RCS_HOOK_PLUGIN_LOOP_MARKER = '[TESTMARK]';
        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'test',
          event: makeEvent(),
          sideEffectsEnabled: true,
        });
        const result = await sdk.tmux.sendKeys({ text: 'hello [TESTMARK] world' });
        assert.equal(result.ok, false);
        assert.equal(result.reason, 'loop_guard_input_marker');
      } finally {
        if (originalMarker === undefined) {
          delete process.env.RCS_HOOK_PLUGIN_LOOP_MARKER;
        } else {
          process.env.RCS_HOOK_PLUGIN_LOOP_MARKER = originalMarker;
        }
        await rm(cwd, { recursive: true, force: true });
      }
    });


    it('prefers non-HUD codex pane when targeting a tmux session', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      const fakeBinDir = await mkdtemp(join(tmpdir(), 'rcs-sdk-bin-'));
      const fakeTmuxPath = join(fakeBinDir, 'tmux');
      const previousPath = process.env.PATH;
      try {
        await writeFile(fakeTmuxPath, `#!/usr/bin/env bash
set -eu
cmd="$1"
shift || true
if [[ "$cmd" == "list-panes" ]]; then
  printf "%%2	1	node /pkg/dist/cli/rcs.js hud --watch
%%42	0	codex --model gpt-5
"
  exit 0
fi
if [[ "$cmd" == "send-keys" ]]; then
  exit 0
fi
if [[ "$cmd" == "display-message" ]]; then
  target=""
  format=""
  while (($#)); do
    case "$1" in
      -p) shift ;;
      -t) target="$2"; shift 2 ;;
      *) format="$1"; shift ;;
    esac
  done
  if [[ "$format" == "#{pane_id}" ]]; then
    echo "$target"
    exit 0
  fi
  exit 0
fi
exit 1
`);
        await import('node:fs/promises').then((fs) => fs.chmod(fakeTmuxPath, 0o755));
        process.env.PATH = `${fakeBinDir}:${previousPath || ''}`;

        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'test',
          event: makeEvent(),
          sideEffectsEnabled: true,
        });
        const result = await sdk.tmux.sendKeys({ text: 'hello', sessionName: 'devsess' });
        assert.equal(result.ok, true);
        assert.equal(result.target, '%42');
      } finally {
        if (typeof previousPath === 'string') process.env.PATH = previousPath;
        else delete process.env.PATH;
        await rm(cwd, { recursive: true, force: true });
        await rm(fakeBinDir, { recursive: true, force: true });
      }
    });
    it('returns target_missing when no pane is resolvable', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      const originalPane = process.env.TMUX_PANE;
      try {
        delete process.env.TMUX_PANE;
        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'test',
          event: makeEvent(),
          sideEffectsEnabled: true,
        });
        const result = await sdk.tmux.sendKeys({ text: 'hello' });
        assert.equal(result.ok, false);
        assert.equal(result.reason, 'target_missing');
      } finally {
        if (originalPane !== undefined) {
          process.env.TMUX_PANE = originalPane;
        }
        await rm(cwd, { recursive: true, force: true });
      }
    });
  });

  describe('rcs', () => {
    it('exposes only the explicit read-only rcs readers', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });

        assert.deepEqual(Object.keys(sdk.rcs).sort(), ['hud', 'notifyFallback', 'session', 'updateCheck']);
        assert.equal(typeof sdk.rcs.session.read, 'function');
        assert.equal(typeof sdk.rcs.hud.read, 'function');
        assert.equal(typeof sdk.rcs.notifyFallback.read, 'function');
        assert.equal(typeof sdk.rcs.updateCheck.read, 'function');
        assert.equal('pluginState' in sdk, false);
        assert.equal('readJson' in sdk.rcs, false);
        assert.equal('list' in sdk.rcs, false);
        assert.equal('exists' in sdk.rcs, false);
        assert.equal('write' in sdk.rcs.session, false);
        assert.equal('delete' in sdk.rcs.session, false);
        assert.equal('write' in sdk.rcs.hud, false);
        assert.equal('delete' in sdk.rcs.hud, false);
        assert.equal('write' in sdk.rcs.notifyFallback, false);
        assert.equal('delete' in sdk.rcs.notifyFallback, false);
        assert.equal('write' in sdk.rcs.updateCheck, false);
        assert.equal('delete' in sdk.rcs.updateCheck, false);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('reads session state from .rcs/state/session.json', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        await writeRcsStateFixtureFile(cwd, 'session.json', {
          session_id: 'session-123',
          cwd,
          started_at: '2026-01-01T00:00:00.000Z',
        });

        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        const state = await sdk.rcs.session.read();
        assert.deepEqual(state, {
          session_id: 'session-123',
          cwd,
          started_at: '2026-01-01T00:00:00.000Z',
        });
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns null for invalid session state without session_id', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        await writeRcsStateFixtureFile(cwd, 'session.json', {
          started_at: '2026-01-01T00:00:00.000Z',
        });

        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        assert.equal(await sdk.rcs.session.read(), null);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('reads hud, notifyFallback, and updateCheck state from root-scoped rcs files', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        await writeRcsStateFixtureFile(cwd, 'hud-state.json', {
          last_turn_at: '2026-01-01T00:00:00.000Z',
          turn_count: 3,
        });
        await writeRcsStateFixtureFile(cwd, 'notify-fallback-state.json', {
          pid: 1234,
          stopping: false,
          tracked_files: 2,
        });
        await writeRcsStateFixtureFile(cwd, 'update-check.json', {
          last_checked_at: '2026-01-01T00:00:00.000Z',
          last_seen_latest: '0.11.0',
        });

        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        assert.deepEqual(await sdk.rcs.hud.read(), {
          last_turn_at: '2026-01-01T00:00:00.000Z',
          turn_count: 3,
        });
        assert.deepEqual(await sdk.rcs.notifyFallback.read(), {
          pid: 1234,
          stopping: false,
          tracked_files: 2,
        });
        assert.deepEqual(await sdk.rcs.updateCheck.read(), {
          last_checked_at: '2026-01-01T00:00:00.000Z',
          last_seen_latest: '0.11.0',
        });
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('reads hud state from the current session scope instead of stale root fallback', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-hud-session-'));
      try {
        await writeRcsStateFixtureFile(cwd, 'session.json', {
          session_id: 'sess-current',
          cwd,
          started_at: '2026-01-01T00:00:00.000Z',
        });
        await writeRcsStateFixtureFile(cwd, 'hud-state.json', {
          last_turn_at: 'root-stale',
          turn_count: 99,
          last_agent_output: 'Would you like me to continue?',
        });
        await writeRcsStateFixtureFile(cwd, join('sessions', 'sess-current', 'hud-state.json'), {
          last_turn_at: '2026-01-01T00:00:00.000Z',
          turn_count: 3,
          last_agent_output: 'Current session output',
        });

        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        assert.deepEqual(await sdk.rcs.hud.read(), {
          last_turn_at: '2026-01-01T00:00:00.000Z',
          turn_count: 3,
          last_agent_output: 'Current session output',
        });
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });

    it('returns null for missing rcs reader files', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
        assert.equal(await sdk.rcs.session.read(), null);
        assert.equal(await sdk.rcs.hud.read(), null);
        assert.equal(await sdk.rcs.notifyFallback.read(), null);
        assert.equal(await sdk.rcs.updateCheck.read(), null);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  });

  describe('plugin name sanitization', () => {
    it('sanitizes special characters in plugin name', async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-'));
      try {
        const sdk = createHookPluginSdk({
          cwd,
          pluginName: 'my plugin!@#',
          event: makeEvent(),
        });
        await sdk.state.write('test', 'value');
        const val = await sdk.state.read('test');
        assert.equal(val, 'value');
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  });
});

describe('clearHookPluginState', () => {
  it('removes data.json and tmux.json for plugin', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-clear-'));
    try {
      const pluginDir = join(cwd, '.rcs', 'state', 'hooks', 'plugins', 'my-plugin');
      await mkdir(pluginDir, { recursive: true });
      await writeFile(join(pluginDir, 'data.json'), '{}');
      await writeFile(join(pluginDir, 'tmux.json'), '{}');

      await clearHookPluginState(cwd, 'my-plugin');

      assert.equal(existsSync(join(pluginDir, 'data.json')), false);
      assert.equal(existsSync(join(pluginDir, 'tmux.json')), false);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('does not throw when files do not exist', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-clear-'));
    try {
      await clearHookPluginState(cwd, 'nonexistent');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
