#!/usr/bin/env node
import { mkdtemp, rm, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { performance } from 'node:perf_hooks';

import { initTeamState, createTask, claimTask, readTask, writeAtomic } from '../team/state.js';
import { monitorTeam } from '../team/runtime.js';
import { planWorktreeTarget, ensureWorktree } from '../team/worktree.js';

async function initRepo(): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-bench-repo-'));
  execFileSync('git', ['init'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd, stdio: 'ignore' });
  await writeFile(join(cwd, 'README.md'), 'hello\n', 'utf-8');
  execFileSync('git', ['add', 'README.md'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd, stdio: 'ignore' });
  return cwd;
}

async function benchReclaim(iterations = 10): Promise<number[]> {
  const samples: number[] = [];
  for (let i = 0; i < iterations; i += 1) {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-bench-reclaim-'));
    try {
      await initTeamState('team-bench', 'bench reclaim', 'executor', 2, cwd);
      const task = await createTask('team-bench', { subject: 'recover', description: 'd', status: 'pending' }, cwd);
      const claim = await claimTask('team-bench', task.id, 'worker-1', task.version ?? 1, cwd);
      if (!claim.ok) throw new Error('claim failed');

      const taskPath = join(cwd, '.rcs', 'state', 'team', 'team-bench', 'tasks', `task-${task.id}.json`);
      const current = JSON.parse(await readFile(taskPath, 'utf-8')) as Record<string, unknown>;
      (current.claim as Record<string, unknown>).leased_until = new Date(Date.now() - 1000).toISOString();
      await writeAtomic(taskPath, JSON.stringify(current, null, 2));

      const start = performance.now();
      await monitorTeam('team-bench', cwd);
      const elapsed = performance.now() - start;
      const reopened = await readTask('team-bench', task.id, cwd);
      if (reopened?.status !== 'pending') throw new Error('task not reclaimed');
      samples.push(elapsed);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  }
  return samples;
}

async function benchDirtyWorktree(iterations = 10): Promise<number[]> {
  const samples: number[] = [];
  for (let i = 0; i < iterations; i += 1) {
    const repo = await initRepo();
    try {
      const plan = planWorktreeTarget({ cwd: repo, scope: 'launch', mode: { enabled: true, detached: true, name: null } });
      if (!plan.enabled) throw new Error('plan disabled');
      const first = ensureWorktree(plan);
      if (!first.enabled) throw new Error('ensure disabled');
      await writeFile(join(first.worktreePath, 'DIRTY.txt'), 'dirty\n', 'utf-8');
      const start = performance.now();
      let blocked = false;
      try {
        ensureWorktree(plan);
      } catch (error) {
        blocked = /worktree_dirty/.test(String(error));
      }
      const elapsed = performance.now() - start;
      if (!blocked) throw new Error('dirty reuse was not blocked');
      samples.push(elapsed);
    } finally {
      await rm(repo, { recursive: true, force: true });
    }
  }
  return samples;
}

function summarize(name: string, values: number[]): void {
  const sorted = [...values].sort((a, b) => a - b);
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  console.log(`${name}: n=${sorted.length} avg_ms=${avg.toFixed(2)} median_ms=${median.toFixed(2)} p95_ms=${p95.toFixed(2)}`);
}

const reclaim = await benchReclaim(10);
const dirty = await benchDirtyWorktree(10);
console.log('team-hardening benchmark');
summarize('expired-claim-reclaim', reclaim);
summarize('dirty-worktree-detection', dirty);
