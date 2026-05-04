import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readTeamConfig, saveTeamConfig } from '../state.js';
import { shutdownTeam, startTeam, type TeamRuntime } from '../runtime.js';

async function initRepo(): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), 'rcs-shutdown-fallback-'));
  execFileSync('git', ['init'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd, stdio: 'ignore' });
  await writeFile(join(cwd, 'README.md'), 'hello\n', 'utf-8');
  execFileSync('git', ['add', 'README.md'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd, stdio: 'ignore' });
  return cwd;
}

function withoutTeamWorkerEnv<T>(fn: () => Promise<T>): Promise<T> {
  const prev = process.env.RCS_TEAM_WORKER;
  delete process.env.RCS_TEAM_WORKER;
  return fn().finally(() => {
    if (typeof prev === 'string') process.env.RCS_TEAM_WORKER = prev;
    else delete process.env.RCS_TEAM_WORKER;
  });
}

function withMockPromptModeCodexAllowed<T>(fn: () => Promise<T>): Promise<T> {
  const previous = process.env.RCS_TEST_ALLOW_NONTTY_CODEX_PROMPT;
  process.env.RCS_TEST_ALLOW_NONTTY_CODEX_PROMPT = '1';
  return fn().finally(() => {
    if (typeof previous === 'string') process.env.RCS_TEST_ALLOW_NONTTY_CODEX_PROMPT = previous;
    else delete process.env.RCS_TEST_ALLOW_NONTTY_CODEX_PROMPT;
  });
}

describe('shutdown fallback worktree reports', () => {
  it('shutdownTeam checkpoints dirty detached worker worktrees, merges them, and writes a report', async () => {
    const repo = await initRepo();
    const binDir = await mkdtemp(join(tmpdir(), 'rcs-shutdown-fallback-bin-'));
    const fakeCodexPath = join(binDir, 'codex');
    await writeFile(
      fakeCodexPath,
      `#!/usr/bin/env node
process.stdin.resume();
setInterval(() => {}, 1000);
process.on('SIGTERM', () => process.exit(0));
`,
      { mode: 0o755 },
    );

    const prevPath = process.env.PATH;
    const prevTmux = process.env.TMUX;
    const prevLaunchMode = process.env.RCS_TEAM_WORKER_LAUNCH_MODE;
    const prevWorkerCli = process.env.RCS_TEAM_WORKER_CLI;

    process.env.PATH = `${binDir}:${prevPath ?? ''}`;
    delete process.env.TMUX;
    process.env.RCS_TEAM_WORKER_LAUNCH_MODE = 'prompt';
    process.env.RCS_TEAM_WORKER_CLI = 'codex';

    let runtime: TeamRuntime | null = null;
    let preservedWorktreePath: string | null = null;
    try {
      runtime = await withMockPromptModeCodexAllowed(() =>
        withoutTeamWorkerEnv(() =>
          startTeam(
            'team-shutdown-fallback-report',
            'shutdown fallback merge report',
            'executor',
            1,
            [],
            repo,
            { worktreeMode: { enabled: true, detached: true, name: null } },
          )));

      const worktreePath = runtime.config.workers[0]?.worktree_path;
      assert.ok(worktreePath, 'worker worktree path should be present');
      preservedWorktreePath = worktreePath ?? null;
      await writeFile(join(worktreePath as string, 'worker-note.txt'), 'from worker\n', 'utf-8');

      const config = await readTeamConfig(runtime.teamName, repo);
      assert.ok(config, 'team config should be readable before shutdown');
      if (!config) throw new Error('missing config');
      config.workers[0].worktree_created = false;
      await saveTeamConfig(config, repo);

      await shutdownTeam(runtime.teamName, repo);
      runtime = null;

      assert.equal(await readFile(join(repo, 'worker-note.txt'), 'utf-8'), 'from worker\n');
      assert.ok(preservedWorktreePath, 'preserved worktree path should be captured');
      assert.equal(existsSync(preservedWorktreePath as string), true);

      const reportPath = join(preservedWorktreePath as string, '.rcs', 'diff.md');
      assert.equal(existsSync(reportPath), true);
      const report = await readFile(reportPath, 'utf-8');
      assert.match(report, /merge_outcome: merged/);
      assert.doesNotMatch(report, /synthetic_commit: none/);
      assert.match(report, /worker-note\.txt/);

      const commitHygieneJsonPath = join(repo, '.rcs', 'reports', 'team-commit-hygiene', 'team-shutdown-fallback-report.context.json');
      const commitHygieneMarkdownPath = join(repo, '.rcs', 'reports', 'team-commit-hygiene', 'team-shutdown-fallback-report.md');
      assert.equal(existsSync(commitHygieneJsonPath), true, 'shutdown should preserve a structured commit hygiene context artifact');
      assert.equal(existsSync(commitHygieneMarkdownPath), true, 'shutdown should preserve a human-readable commit hygiene guide');

      const commitHygieneContext = JSON.parse(await readFile(commitHygieneJsonPath, 'utf-8')) as {
        lore_commit_protocol_required: boolean;
        runtime_commits_are_scaffolding: boolean;
        operational_entries: Array<{ operation: string; status: string }>;
        leader_finalization_prompt: string;
      };
      assert.equal(commitHygieneContext.lore_commit_protocol_required, true);
      assert.equal(commitHygieneContext.runtime_commits_are_scaffolding, true);
      assert.equal(commitHygieneContext.operational_entries.some((entry) => entry.operation === 'shutdown_checkpoint'), true);
      assert.equal(commitHygieneContext.operational_entries.some((entry) => entry.operation === 'shutdown_merge' && entry.status === 'applied'), true);
      assert.match(commitHygieneContext.leader_finalization_prompt, /Lore-format final commit/i);

      const commitHygieneGuide = await readFile(commitHygieneMarkdownPath, 'utf-8');
      assert.match(commitHygieneGuide, /temporary scaffolding/i);
      assert.match(commitHygieneGuide, /Suggested Leader Finalization Prompt/i);
    } finally {
      if (runtime) {
        await shutdownTeam(runtime.teamName, repo, { force: true }).catch(() => {});
      }
      if (typeof prevPath === 'string') process.env.PATH = prevPath;
      else delete process.env.PATH;
      if (typeof prevTmux === 'string') process.env.TMUX = prevTmux;
      else delete process.env.TMUX;
      if (typeof prevLaunchMode === 'string') process.env.RCS_TEAM_WORKER_LAUNCH_MODE = prevLaunchMode;
      else delete process.env.RCS_TEAM_WORKER_LAUNCH_MODE;
      if (typeof prevWorkerCli === 'string') process.env.RCS_TEAM_WORKER_CLI = prevWorkerCli;
      else delete process.env.RCS_TEAM_WORKER_CLI;
      await rm(binDir, { recursive: true, force: true }).catch(() => {});
      if (preservedWorktreePath) {
        await rm(preservedWorktreePath, { recursive: true, force: true }).catch(() => {});
      }
      await rm(repo, { recursive: true, force: true });
    }
  });
});
