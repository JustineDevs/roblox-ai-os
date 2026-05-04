import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ENV_KEYS = [
  'CODEX_HOME',
  'RCS_NOTIFY_TEMP',
  'RCS_NOTIFY_TEMP_CONTRACT',
  'RCS_NOTIFY_PROFILE',
  'RCS_DISCORD_WEBHOOK_URL',
  'RCS_OPENCLAW',
] as const;

function clearEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

describe('session-idle tmux tail dedupe integration', () => {
  let notifyLifecycle: typeof import('../index.js').notifyLifecycle;
  let tempCodexHome = '';
  let projectPath = '';
  let originalFetch: typeof globalThis.fetch | undefined;
  const capturedBodies: Array<Record<string, unknown>> = [];

  beforeEach(async () => {
    clearEnv();
    const root = await mkdtemp(join(tmpdir(), 'rcs-session-idle-tail-'));
    tempCodexHome = join(root, '.codex');
    projectPath = join(root, 'project');
    await mkdir(tempCodexHome, { recursive: true });
    await mkdir(projectPath, { recursive: true });
    await writeFile(join(tempCodexHome, '.rcs-config.json'), JSON.stringify({
      notifications: {
        enabled: true,
        events: {
          'session-idle': {
            enabled: true,
            webhook: { enabled: true, url: 'https://example.com/webhook' },
          },
        },
        webhook: { enabled: true, url: 'https://example.com/webhook' },
      },
    }, null, 2));
    process.env.CODEX_HOME = tempCodexHome;
    ({ notifyLifecycle } = await import(`../index.js?session-idle-tail-dedupe=${Date.now()}`));
    originalFetch = globalThis.fetch;
    capturedBodies.length = 0;
    globalThis.fetch = (async (_url: string | URL | Request, init?: RequestInit) => {
      capturedBodies.push(JSON.parse(String(init?.body || '{}')));
      return {
        ok: true,
        status: 200,
      } as Response;
    }) as typeof globalThis.fetch;
  });

  afterEach(async () => {
    if (originalFetch === undefined) {
      Reflect.deleteProperty(globalThis, 'fetch');
    } else {
      globalThis.fetch = originalFetch;
    }
    const root = tempCodexHome ? join(tempCodexHome, '..') : '';
    clearEnv();
    if (root) await rm(root, { recursive: true, force: true });
  });

  it('drops unchanged stale tmux tails from repeated idle notifications but keeps fresh tails', async () => {
    const base = {
      sessionId: 'sess-idle-tail',
      projectPath,
      projectName: 'project',
    };

    const staleTail = [
      'risk summary',
      '{"severity":"error","message":"old metadata"}',
      'resolved setup failure',
    ].join('\n');

    const first = await notifyLifecycle('session-idle', { ...base, tmuxTail: staleTail });
    assert.equal(first?.anySuccess, true);
    assert.equal(capturedBodies.length, 1);
    assert.match(String(capturedBodies[0]?.message || ''), /risk summary/);

    const second = await notifyLifecycle('session-idle', { ...base, tmuxTail: staleTail });
    assert.equal(second?.anySuccess, true);
    assert.equal(capturedBodies.length, 2);
    assert.doesNotMatch(String(capturedBodies[1]?.message || ''), /risk summary/);
    assert.doesNotMatch(String(capturedBodies[1]?.message || ''), /severity/);

    const third = await notifyLifecycle('session-idle', { ...base, tmuxTail: 'fresh setup error' });
    assert.equal(third?.anySuccess, true);
    assert.equal(capturedBodies.length, 3);
    assert.match(String(capturedBodies[2]?.message || ''), /fresh setup error/);
  });
});
