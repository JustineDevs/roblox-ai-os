import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';

function runNotifyHook(cwd: string, env: NodeJS.ProcessEnv) {
  return spawnSync(process.execPath, ['dist/scripts/notify-hook.js', JSON.stringify({
    cwd,
    type: 'agent-turn-complete',
    'thread-id': 'thread-1',
    'turn-id': 'turn-1',
    input_messages: ['work'],
    last_assistant_message: 'done',
  })], {
    cwd: process.cwd(),
    env,
    encoding: 'utf-8',
  });
}

describe('notify-hook team worker state-root fail-closed behavior', () => {
  it('does not create local team state when worker identity resolution fails', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-notify-worker-fail-closed-'));
    const result = runNotifyHook(cwd, {
      ...process.env,
      RCS_TEAM_WORKER: 'demo-team/worker-1',
      RCS_TEAM_STATE_ROOT: join(cwd, 'missing-shared-state'),
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(existsSync(join(cwd, '.rcs', 'state')), false);
    assert.equal(existsSync(join(cwd, '.rcs', 'logs')), true);
  });
});
