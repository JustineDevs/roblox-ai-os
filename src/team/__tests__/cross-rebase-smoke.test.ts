import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  initTeamState,
  listMailboxMessages,
  readMonitorSnapshot,
  readTeamConfig,
  saveTeamConfig,
  writeWorkerStatus,
} from '../state.js';
import { monitorTeam } from '../runtime.js';
import { readTeamEvents } from '../state/events.js';

function execFileSyncCompat(command: string, args: string[], options: Parameters<typeof execFileSync>[2] = {}): string {
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    ...options,
  });
  if (result.status !== 0 && !result.error) {
    throw new Error(String(result.stderr || `spawnSync ${command} failed`));
  }
  if (result.status !== 0 && result.error) {
    throw result.error;
  }
  return String(result.stdout ?? '');
}

async function initRepo(): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), 'rcs-cross-rebase-smoke-repo-'));
  execFileSync('git', ['init'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd, stdio: 'ignore' });
  await writeFile(join(cwd, 'README.md'), 'hello\n', 'utf-8');
  execFileSync('git', ['add', 'README.md'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd, stdio: 'ignore' });
  return cwd;
}

async function addWorktree(repo: string, branchName: string, prefix: string): Promise<string> {
  const worktreePath = await mkdtemp(join(tmpdir(), prefix));
  execFileSync('git', ['worktree', 'add', '-b', branchName, worktreePath, 'HEAD'], { cwd: repo, stdio: 'ignore' });
  return worktreePath;
}

async function configureWorkers(
  teamName: string,
  repo: string,
  workers: Array<{ path: string; branch: string }>,
): Promise<void> {
  await initTeamState(teamName, 'cross rebase smoke', 'executor', workers.length, repo);
  const cfg = await readTeamConfig(teamName, repo);
  assert.ok(cfg);
  if (!cfg) throw new Error('missing team config');
  cfg.leader_pane_id = '';
  workers.forEach((worker, index) => {
    cfg.workers[index] = {
      ...cfg.workers[index],
      assigned_tasks: [String(index + 1)],
      worktree_repo_root: repo,
      worktree_path: worker.path,
      worktree_branch: worker.branch,
      worktree_detached: false,
      worktree_created: false,
    };
  });
  await saveTeamConfig(cfg, repo);
}

describe('cross-rebase smoke regression', () => {
  it('surfaces cross-rebase applied as an audit event without making it wakeable', async () => {
    const repo = await initRepo();
    let worker1Path = '';
    let worker2Path = '';
    try {
      worker1Path = await addWorktree(repo, 'wk1-cross-applied', 'rcs-cross-applied-w1-');
      worker2Path = await addWorktree(repo, 'wk2-cross-applied', 'rcs-cross-applied-w2-');

      await writeFile(join(worker1Path, 'w1.txt'), 'from worker 1\n', 'utf-8');
      execFileSync('git', ['add', 'w1.txt'], { cwd: worker1Path, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'worker-1 change'], { cwd: worker1Path, stdio: 'ignore' });

      await writeFile(join(worker2Path, 'w2.txt'), 'from worker 2\n', 'utf-8');
      execFileSync('git', ['add', 'w2.txt'], { cwd: worker2Path, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'worker-2 change'], { cwd: worker2Path, stdio: 'ignore' });

      await configureWorkers('cross-rebase-applied', repo, [
        { path: worker1Path, branch: 'wk1-cross-applied' },
        { path: worker2Path, branch: 'wk2-cross-applied' },
      ]);
      await writeWorkerStatus('cross-rebase-applied', 'worker-2', { state: 'idle', updated_at: new Date().toISOString() }, repo);

      await monitorTeam('cross-rebase-applied', repo);

      const events = await readTeamEvents('cross-rebase-applied', repo, { wakeableOnly: false });
      const wakeable = await readTeamEvents('cross-rebase-applied', repo, { wakeableOnly: true });
      const snapshot = await readMonitorSnapshot('cross-rebase-applied', repo);

      assert.equal(existsSync(join(worker2Path, 'w1.txt')), true);
      assert.equal(existsSync(join(worker2Path, 'w2.txt')), true);
      assert.equal(typeof snapshot?.integrationByWorker?.['worker-2']?.last_rebased_leader_head, 'string');
      assert.equal(events.some((event) => event.type === 'worker_cross_rebase_applied'), true);
      assert.equal(wakeable.some((event) => event.type === 'worker_cross_rebase_applied'), false);
    } finally {
      if (worker1Path) await rm(worker1Path, { recursive: true, force: true });
      if (worker2Path) await rm(worker2Path, { recursive: true, force: true });
      await rm(repo, { recursive: true, force: true });
    }
  });

  it('surfaces cross-rebase conflicts as wakeable and preserves cleanup/report evidence', async () => {
    const repo = await initRepo();
    let worker1Path = '';
    let worker2Path = '';
    try {
      await writeFile(join(repo, 'original.txt'), 'original content\n', 'utf-8');
      execFileSync('git', ['add', 'original.txt'], { cwd: repo, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'add original.txt'], { cwd: repo, stdio: 'ignore' });

      worker1Path = await addWorktree(repo, 'wk1-cross-conflict', 'rcs-cross-conflict-w1-');
      worker2Path = await addWorktree(repo, 'wk2-cross-conflict', 'rcs-cross-conflict-w2-');

      execFileSync('git', ['mv', 'original.txt', 'renamed-by-w1.txt'], { cwd: worker1Path, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'worker-1 renames original'], { cwd: worker1Path, stdio: 'ignore' });

      execFileSync('git', ['mv', 'original.txt', 'renamed-by-w2.txt'], { cwd: worker2Path, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'worker-2 renames original'], { cwd: worker2Path, stdio: 'ignore' });

      const worker2HeadBefore = execFileSyncCompat('git', ['rev-parse', 'HEAD'], { cwd: worker2Path }).trim();

      await configureWorkers('cross-rebase-conflict', repo, [
        { path: worker1Path, branch: 'wk1-cross-conflict' },
        { path: worker2Path, branch: 'wk2-cross-conflict' },
      ]);
      await writeWorkerStatus('cross-rebase-conflict', 'worker-2', { state: 'idle', updated_at: new Date().toISOString() }, repo);

      await monitorTeam('cross-rebase-conflict', repo);

      const worker2HeadAfter = execFileSyncCompat('git', ['rev-parse', 'HEAD'], { cwd: worker2Path }).trim();
      const worker2StatusOutput = execFileSyncCompat('git', ['status'], { cwd: worker2Path });
      const events = await readTeamEvents('cross-rebase-conflict', repo, { wakeableOnly: false });
      const wakeable = await readTeamEvents('cross-rebase-conflict', repo, { wakeableOnly: true });
      const leaderMailbox = await listMailboxMessages('cross-rebase-conflict', 'leader-fixed', repo);
      const reportPath = join(repo, '.rcs', 'state', 'team', 'cross-rebase-conflict', 'integration-report.md');
      const report = await readFile(reportPath, 'utf-8');

      assert.equal(worker2HeadAfter, worker2HeadBefore);
      assert.doesNotMatch(worker2StatusOutput, /rebase in progress/i);
      assert.equal(events.some((event) => event.type === 'worker_cross_rebase_conflict'), true);
      assert.equal(wakeable.some((event) => event.type === 'worker_cross_rebase_conflict'), true);
      assert.equal(
        leaderMailbox.some((message) => /rebase onto .* with -X ours failed/i.test(message.body)),
        true,
      );
      assert.equal(existsSync(reportPath), true);
      assert.match(report, /rebase/i);
    } finally {
      if (worker1Path) await rm(worker1Path, { recursive: true, force: true });
      if (worker2Path) await rm(worker2Path, { recursive: true, force: true });
      await rm(repo, { recursive: true, force: true });
    }
  });

  it('keeps cross-rebase skipped as audit-only when worker state is not eligible', async () => {
    const repo = await initRepo();
    let worker1Path = '';
    let worker2Path = '';
    try {
      worker1Path = await addWorktree(repo, 'wk1-cross-skipped', 'rcs-cross-skipped-w1-');
      worker2Path = await addWorktree(repo, 'wk2-cross-skipped', 'rcs-cross-skipped-w2-');

      await writeFile(join(worker1Path, 'w1.txt'), 'from worker 1\n', 'utf-8');
      execFileSync('git', ['add', 'w1.txt'], { cwd: worker1Path, stdio: 'ignore' });
      execFileSync('git', ['commit', '-m', 'worker-1 change'], { cwd: worker1Path, stdio: 'ignore' });

      const worker2HeadBefore = execFileSyncCompat('git', ['rev-parse', 'HEAD'], { cwd: worker2Path }).trim();

      await configureWorkers('cross-rebase-skipped', repo, [
        { path: worker1Path, branch: 'wk1-cross-skipped' },
        { path: worker2Path, branch: 'wk2-cross-skipped' },
      ]);
      await writeWorkerStatus('cross-rebase-skipped', 'worker-2', { state: 'working', updated_at: new Date().toISOString() }, repo);

      await monitorTeam('cross-rebase-skipped', repo);

      const worker2HeadAfter = execFileSyncCompat('git', ['rev-parse', 'HEAD'], { cwd: worker2Path }).trim();
      const events = await readTeamEvents('cross-rebase-skipped', repo, { wakeableOnly: false });
      const wakeable = await readTeamEvents('cross-rebase-skipped', repo, { wakeableOnly: true });

      assert.equal(worker2HeadAfter, worker2HeadBefore);
      assert.equal(existsSync(join(worker2Path, 'w1.txt')), false);
      assert.equal(events.some((event) => event.type === 'worker_cross_rebase_skipped'), true);
      assert.equal(wakeable.some((event) => event.type === 'worker_cross_rebase_skipped'), false);
    } finally {
      if (worker1Path) await rm(worker1Path, { recursive: true, force: true });
      if (worker2Path) await rm(worker2Path, { recursive: true, force: true });
      await rm(repo, { recursive: true, force: true });
    }
  });
});
