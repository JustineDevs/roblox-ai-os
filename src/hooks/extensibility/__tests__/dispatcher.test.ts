import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { isHookPluginFeatureEnabled, dispatchHookEvent } from '../dispatcher.js';
import { buildHookEvent } from '../events.js';

describe('isHookPluginFeatureEnabled', () => {
  it('returns true when RCS_HOOK_PLUGINS=1', () => {
    assert.equal(isHookPluginFeatureEnabled({ RCS_HOOK_PLUGINS: '1' }), true);
  });

  it('returns true when env var is missing', () => {
    assert.equal(isHookPluginFeatureEnabled({}), true);
  });

  it('returns false for "0"', () => {
    assert.equal(isHookPluginFeatureEnabled({ RCS_HOOK_PLUGINS: '0' }), false);
  });
});

describe('dispatchHookEvent', () => {
  it('returns disabled summary when plugins are disabled', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: {},
        enabled: false,
      });

      assert.equal(result.enabled, false);
      assert.equal(result.reason, 'disabled');
      assert.equal(result.event, 'session-start');
      assert.equal(result.plugin_count, 0);
      assert.deepEqual(result.results, []);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('returns enabled summary with zero plugins for native events even when env is unset', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: {},
      });

      assert.equal(result.enabled, true);
      assert.equal(result.reason, 'ok');
      assert.equal(result.plugin_count, 0);
      assert.deepEqual(result.results, []);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('reports invalid_export for plugins without onHookEvent', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'bad.mjs'), 'export const x = 1;');

      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: { RCS_HOOK_PLUGINS: '1' },
      });

      assert.equal(result.enabled, true);
      assert.equal(result.plugin_count, 1);
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].ok, false);
      assert.equal(result.results[0].status, 'invalid_export');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('dispatches valid plugins successfully', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, 'good.mjs'),
        'export async function onHookEvent(event, sdk) { await sdk.state.write("ran", true); }',
      );

      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1' },
      });

      assert.equal(result.enabled, true);
      assert.equal(result.plugin_count, 1);
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].ok, true);
      assert.equal(result.results[0].plugin, 'good');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('does not execute plugin top-level code in the parent process', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, 'top-level-side-effect.mjs'),
        `import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
appendFileSync(join(process.cwd(), '.rcs', 'top-level-pids.log'), String(process.pid) + '\\n');
export async function onHookEvent() {}
`,
      );

      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1' },
      });

      assert.equal(result.enabled, true);
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].ok, true);

      const pids = (await readFile(join(cwd, '.rcs', 'top-level-pids.log'), 'utf-8'))
        .trim()
        .split('\n')
        .filter(Boolean);
      assert.equal(pids.length, 1);
      assert.notEqual(pids[0], String(process.pid));
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('respects explicit enabled=true option', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: {},
        enabled: true,
      });

      assert.equal(result.enabled, true);
      assert.equal(result.plugin_count, 0);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('includes source from event in summary', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const event = buildHookEvent('needs-input');
      const result = await dispatchHookEvent(event, {
        cwd,
      });

      assert.equal(result.source, 'derived');
      assert.equal(result.event, 'needs-input');
      assert.equal(result.enabled, true);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('disables side effects for team workers by default', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, 'se-test.mjs'),
        `export async function onHookEvent(event, sdk) {
          const result = await sdk.tmux.sendKeys({ text: 'hello' });
          await sdk.state.write('send_result', result.reason);
        }`,
      );

      const event = buildHookEvent('session-start');
      const result = await dispatchHookEvent(event, {
        cwd,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1', RCS_TEAM_WORKER: 'worker-1' },
      });

      assert.equal(result.enabled, true);
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].ok, true);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('returns timeout promptly when plugin ignores SIGTERM', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, 'ignore-sigterm.mjs'),
        `export async function onHookEvent() {
          process.on('SIGTERM', () => {});
          setInterval(() => {}, 60_000);
          await new Promise(() => {});
        }`,
      );

      const event = buildHookEvent('session-start');
      const startedAt = Date.now();
      const result = await dispatchHookEvent(event, {
        cwd,
        timeoutMs: 50,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1' },
      });
      const elapsedMs = Date.now() - startedAt;

      assert.equal(result.enabled, true);
      assert.equal(result.plugin_count, 1);
      assert.equal(result.results.length, 1);
      assert.equal(result.results[0].ok, false);
      assert.equal(result.results[0].status, 'timeout');
      assert.ok(elapsedMs < 1500, `dispatch should timeout promptly (elapsed=${elapsedMs}ms)`);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('dedupes repeated native lifecycle hook dispatches for the same session/turn fingerprint', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-dispatch-dedupe-'));
    try {
      const dir = join(cwd, '.rcs', 'hooks');
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, 'good.mjs'),
        'export async function onHookEvent(event, sdk) { const count = Number((await sdk.state.read("count", 0)) || 0); await sdk.state.write("count", count + 1); }',
      );

      const event = buildHookEvent('keyword-detector', {
        source: 'native',
        session_id: 'sess-1',
        thread_id: 'thread-1',
        turn_id: 'turn-1',
        context: { phase: 'prompt-submitted', marker: 'same-turn' },
      });

      const first = await dispatchHookEvent(event, {
        cwd,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1' },
      });
      const second = await dispatchHookEvent(event, {
        cwd,
        env: { ...process.env, RCS_HOOK_PLUGINS: '1' },
      });

      assert.equal(first.enabled, true);
      assert.equal(first.results.length, 1);
      assert.equal(first.results[0].ok, true);

      assert.equal(second.enabled, true);
      assert.equal(second.reason, 'deduped');
      assert.equal(second.results.length, 0);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
