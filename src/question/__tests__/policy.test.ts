import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { evaluateQuestionPolicy } from '../policy.js';

const tempDirs: string[] = [];

async function makeRepo(): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), 'rcs-question-policy-'));
  tempDirs.push(cwd);
  await mkdir(join(cwd, '.rcs', 'state'), { recursive: true });
  return cwd;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => import('node:fs/promises').then(({ rm }) => rm(dir, { recursive: true, force: true }))));
});

describe('evaluateQuestionPolicy', () => {
  it('allows non-team leader sessions with no blocked modes', async () => {
    const cwd = await makeRepo();
    await writeFile(join(cwd, '.rcs', 'state', 'session.json'), JSON.stringify({ session_id: 'sess-1' }));
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-1', env: { ...process.env, RCS_TEAM_WORKER: '' } });
    assert.equal(result.allowed, true);
  });

  it('blocks worker contexts immediately', async () => {
    const cwd = await makeRepo();
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-1', env: { ...process.env, RCS_TEAM_WORKER: 'demo/worker-1' } });
    assert.equal(result.allowed, false);
    assert.equal(result.code, 'worker_blocked');
    assert.equal(result.fallbackAllowed, false);
  });

  it('blocks canonical active team ownership for the current session', async () => {
    const cwd = await makeRepo();
    const teamRoot = join(cwd, '.rcs', 'state', 'team', 'alpha');
    await mkdir(teamRoot, { recursive: true });
    await writeFile(join(teamRoot, 'manifest.v2.json'), JSON.stringify({
      schema_version: 2,
      name: 'alpha',
      task: 'demo',
      leader: { session_id: 'sess-team', worker_id: 'leader-fixed', role: 'coordinator' },
      policy: { display_mode: 'auto', worker_launch_mode: 'interactive', dispatch_mode: 'hook_preferred_with_fallback', dispatch_ack_timeout_ms: 2000 },
      governance: { approvals: 'leader', merge_strategy: 'sequential' },
      lifecycle_profile: 'default',
      permissions_snapshot: { sandbox_mode: 'workspace-write', approval_policy: 'never' },
      tmux_session: 'alpha:0',
      worker_count: 1,
      workers: [],
      next_task_id: 1,
      created_at: new Date().toISOString(),
      leader_pane_id: null,
      hud_pane_id: null,
      resize_hook_name: null,
      resize_hook_target: null,
    }));
    await writeFile(join(teamRoot, 'phase.json'), JSON.stringify({ current_phase: 'team-exec', max_fix_attempts: 3, current_fix_attempt: 0, transitions: [], updated_at: new Date().toISOString() }));
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-team', env: { ...process.env, RCS_TEAM_WORKER: '' } });
    assert.equal(result.allowed, false);
    assert.equal(result.code, 'team_blocked');
    assert.equal(result.fallbackAllowed, false);
  });

  it('blocks active execution-like workflows for the current session', async () => {
    const cwd = await makeRepo();
    const sessionDir = join(cwd, '.rcs', 'state', 'sessions', 'sess-forge');
    await mkdir(sessionDir, { recursive: true });
    await writeFile(join(sessionDir, 'forge-state.json'), JSON.stringify({ mode: 'forge', active: true }));
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-forge', env: { ...process.env, RCS_TEAM_WORKER: '' } });
    assert.equal(result.allowed, false);
    assert.equal(result.code, 'active_execution_mode_blocked');
    assert.equal(result.fallbackAllowed, false);
  });

  it('does not falsely block from another session team state', async () => {
    const cwd = await makeRepo();
    const teamRoot = join(cwd, '.rcs', 'state', 'team', 'beta');
    await mkdir(teamRoot, { recursive: true });
    await writeFile(join(teamRoot, 'manifest.v2.json'), JSON.stringify({
      schema_version: 2,
      name: 'beta',
      task: 'demo',
      leader: { session_id: 'sess-other', worker_id: 'leader-fixed', role: 'coordinator' },
      policy: { display_mode: 'auto', worker_launch_mode: 'interactive', dispatch_mode: 'hook_preferred_with_fallback', dispatch_ack_timeout_ms: 2000 },
      governance: { approvals: 'leader', merge_strategy: 'sequential' },
      lifecycle_profile: 'default',
      permissions_snapshot: { sandbox_mode: 'workspace-write', approval_policy: 'never' },
      tmux_session: 'beta:0',
      worker_count: 1,
      workers: [],
      next_task_id: 1,
      created_at: new Date().toISOString(),
      leader_pane_id: null,
      hud_pane_id: null,
      resize_hook_name: null,
      resize_hook_target: null,
    }));
    await writeFile(join(teamRoot, 'phase.json'), JSON.stringify({ current_phase: 'team-exec', max_fix_attempts: 3, current_fix_attempt: 0, transitions: [], updated_at: new Date().toISOString() }));
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-main', env: { ...process.env, RCS_TEAM_WORKER: '' } });
    assert.equal(result.allowed, true);
  });

  it('allows deep-interview state when no execution-like workflow is active', async () => {
    const cwd = await makeRepo();
    const sessionDir = join(cwd, '.rcs', 'state', 'sessions', 'sess-di');
    await mkdir(sessionDir, { recursive: true });
    await writeFile(join(sessionDir, 'deep-interview-state.json'), JSON.stringify({ mode: 'deep-interview', active: true }));
    const result = await evaluateQuestionPolicy({ cwd, explicitSessionId: 'sess-di', env: { ...process.env, RCS_TEAM_WORKER: '' } });
    assert.equal(result.allowed, true);
    assert.equal(result.fallbackAllowed, true);
  });
});
