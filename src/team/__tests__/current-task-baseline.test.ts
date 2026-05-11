import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  assertCurrentTaskBranchAvailable,
  findActiveCurrentTaskByBranch,
  upsertCurrentTaskBaseline,
} from '../current-task-baseline.js';
import { ensureWorktree, planWorktreeTarget } from '../worktree.js';

async function initRepo(): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), 'rcs-current-task-baseline-'));
  execFileSync('git', ['init'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd, stdio: 'ignore' });
  await writeFile(join(cwd, 'README.md'), 'hello\n', 'utf-8');
  execFileSync('git', ['add', 'README.md'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd, stdio: 'ignore' });
  return cwd;
}

describe('current-task-baseline', () => {
  it('records a launch worktree branch baseline on successful ensureWorktree', async () => {
    const repo = await initRepo();
    try {
      const plan = planWorktreeTarget({
        cwd: repo,
        scope: 'launch',
        mode: { enabled: true, detached: false, name: 'feature/task-baseline' },
      });
      assert.equal(plan.enabled, true);
      if (!plan.enabled) return;

      const ensured = ensureWorktree(plan);
      assert.equal(ensured.enabled, true);
      if (!ensured.enabled) return;

      const entry = findActiveCurrentTaskByBranch(repo, 'feature/task-baseline');
      assert.ok(entry, 'baseline entry should exist');
      assert.equal(entry?.worktree_path, ensured.worktreePath);
      assert.equal(entry?.status, 'active');
      assert.equal(existsSync(join(repo, '.rcs', 'state', 'current-task-baseline.json')), true);
    } finally {
      await rm(repo, { recursive: true, force: true });
    }
  });

  it('blocks duplicate branch creation when baseline points at another worktree path', async () => {
    const repo = await initRepo();
    try {
      upsertCurrentTaskBaseline(repo, {
        branch_name: 'feature/already-active',
        worktree_path: join(repo, '..', 'some-other-worktree'),
        status: 'active',
      });

      assert.throws(
        () => assertCurrentTaskBranchAvailable(repo, 'feature/already-active', join(repo, '..', 'new-worktree')),
        /current_task_branch_guard:feature\/already-active:/,
      );
    } finally {
      await rm(repo, { recursive: true, force: true });
    }
  });

  it('updates branch lifecycle metadata when PR info is observed', async () => {
    const repo = await initRepo();
    try {
      upsertCurrentTaskBaseline(repo, {
        branch_name: 'feature/pr-lifecycle',
        worktree_path: repo,
        status: 'active',
      });

      upsertCurrentTaskBaseline(repo, {
        branch_name: 'feature/pr-lifecycle',
        worktree_path: repo,
        issue_number: 1407,
        pr_number: 1416,
        pr_url: 'https://github.com/JustineDevs/roblox-ai-os/pull/1416',
        status: 'merged',
      });

      const raw = JSON.parse(readFileSync(join(repo, '.rcs', 'state', 'current-task-baseline.json'), 'utf-8'));
      const entry = raw.tasks.find((item: { branch_name: string }) => item.branch_name === 'feature/pr-lifecycle');
      assert.equal(entry.issue_number, 1407);
      assert.equal(entry.pr_number, 1416);
      assert.equal(entry.status, 'merged');
    } finally {
      await rm(repo, { recursive: true, force: true });
    }
  });
});
