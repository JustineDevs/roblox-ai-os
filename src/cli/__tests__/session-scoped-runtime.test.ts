import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile, readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, '..', '..', '..');
const rcsBin = join(repoRoot, 'dist', 'cli', 'rcs.js');

function runRcsCli(cwd: string, ...args: string[]) {
  return spawnSync(process.execPath, [rcsBin, ...args], {
    cwd,
    encoding: 'utf-8',
  });
}

describe('CLI session-scoped state parity', () => {
  it('status and cancel include session-scoped states', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-cli-session-scope-'));
    try {
      await mkdir(join(wd, '.rcs', 'state'), { recursive: true });
      await writeFile(join(wd, '.rcs', 'state', 'session.json'), JSON.stringify({ session_id: 'sess1' }));
      const scopedDir = join(wd, '.rcs', 'state', 'sessions', 'sess1');
      await mkdir(scopedDir, { recursive: true });
      await writeFile(join(scopedDir, 'team-state.json'), JSON.stringify({
        active: true,
        current_phase: 'team-exec',
      }));

      const statusResult = runRcsCli(wd, 'status');
      if (statusResult.error && /(EPERM|EACCES)/i.test(statusResult.error.message)) return;
      assert.equal(statusResult.status, 0, statusResult.stderr || statusResult.stdout);
      assert.match(statusResult.stdout, /team: ACTIVE/);

      const cancelResult = runRcsCli(wd, 'cancel');
      assert.equal(cancelResult.status, 0, cancelResult.stderr || cancelResult.stdout);
      assert.match(cancelResult.stdout, /Cancelled: team/);

      const updated = JSON.parse(await readFile(join(scopedDir, 'team-state.json'), 'utf-8'));
      assert.equal(updated.active, false);
      assert.equal(updated.current_phase, 'cancelled');
      assert.ok(typeof updated.completed_at === 'string' && updated.completed_at.length > 0);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('status does not report a root fallback mode as active after current-session clear', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-cli-session-clear-fallback-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionId = 'sess-clear';
      const sessionDir = join(stateDir, 'sessions', sessionId);
      await mkdir(sessionDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: sessionId }));
      await writeFile(join(stateDir, 'deep-interview-state.json'), JSON.stringify({
        active: true,
        mode: 'deep-interview',
        current_phase: 'legacy-root',
      }));
      await writeFile(join(sessionDir, 'deep-interview-state.json'), JSON.stringify({
        active: true,
        mode: 'deep-interview',
        current_phase: 'session-active',
      }));

      const clearResult = runRcsCli(
        wd,
        'state',
        'clear',
        '--input',
        '{"mode":"deep-interview"}',
        '--json',
      );
      assert.equal(clearResult.status, 0, clearResult.stderr || clearResult.stdout);
      assert.match(clearResult.stdout, /"cleared":true/);

      const statusResult = runRcsCli(wd, 'status');
      assert.equal(statusResult.status, 0, statusResult.stderr || statusResult.stdout);
      assert.doesNotMatch(statusResult.stdout, /deep-interview: ACTIVE/);
      assert.match(statusResult.stdout, /deep-interview: inactive \(phase: cleared\)/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('cancels linked ultrawork when Ralph is active', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-cli-ralph-link-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionId = 'sess-link';
      const sessionDir = join(stateDir, 'sessions', sessionId);
      await mkdir(sessionDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: sessionId }));

      await writeFile(join(sessionDir, 'ralph-state.json'), JSON.stringify({
        active: true,
        iteration: 2,
        max_iterations: 10,
        current_phase: 'executing',
        started_at: '2026-02-22T00:00:00.000Z',
        linked_ultrawork: true,
      }));
      await writeFile(join(sessionDir, 'ultrawork-state.json'), JSON.stringify({
        active: true,
        current_phase: 'executing',
      }));

      const cancelResult = runRcsCli(wd, 'cancel');
      assert.equal(cancelResult.status, 0, cancelResult.stderr || cancelResult.stdout);
      assert.match(cancelResult.stdout, /Cancelled: ralph/);
      assert.match(cancelResult.stdout, /Cancelled: ultrawork/);

      const ralph = JSON.parse(await readFile(join(sessionDir, 'ralph-state.json'), 'utf-8'));
      assert.equal(ralph.active, false);
      assert.equal(ralph.current_phase, 'cancelled');
      assert.ok(typeof ralph.completed_at === 'string');

      const ultrawork = JSON.parse(await readFile(join(sessionDir, 'ultrawork-state.json'), 'utf-8'));
      assert.equal(ultrawork.active, false);
      assert.equal(ultrawork.current_phase, 'cancelled');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('does not mutate unrelated sessions when cancelling current session mode', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-cli-cross-session-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionA = join(stateDir, 'sessions', 'sessA');
      const sessionB = join(stateDir, 'sessions', 'sessB');
      await mkdir(sessionA, { recursive: true });
      await mkdir(sessionB, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: 'sessA' }));

      await writeFile(join(sessionA, 'ralph-state.json'), JSON.stringify({
        active: true,
        current_phase: 'executing',
        started_at: '2026-02-22T00:00:00.000Z',
      }));
      await writeFile(join(sessionB, 'ralph-state.json'), JSON.stringify({
        active: true,
        current_phase: 'executing',
        started_at: '2026-02-22T00:00:00.000Z',
      }));

      const cancelResult = runRcsCli(wd, 'cancel');
      assert.equal(cancelResult.status, 0, cancelResult.stderr || cancelResult.stdout);
      assert.match(cancelResult.stdout, /Cancelled: ralph/);

      const aState = JSON.parse(await readFile(join(sessionA, 'ralph-state.json'), 'utf-8'));
      const bState = JSON.parse(await readFile(join(sessionB, 'ralph-state.json'), 'utf-8'));
      assert.equal(aState.active, false);
      assert.equal(aState.current_phase, 'cancelled');
      assert.equal(bState.active, true);
      assert.equal(bState.current_phase, 'executing');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
