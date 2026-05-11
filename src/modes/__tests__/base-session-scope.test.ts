import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readModeState, startMode, updateModeState } from '../base.js';

describe('modes/base session-scoped persistence', () => {
  it('writes mode state into the current session scope when session.json exists', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-session-scope-'));
    try {
      await mkdir(join(wd, '.rcs', 'state'), { recursive: true });
      await writeFile(join(wd, '.rcs', 'state', 'session.json'), JSON.stringify({ session_id: 'sess-base-write' }));

      await startMode('blueprint', 'write in session scope', 5, wd);

      const scopedPath = join(wd, '.rcs', 'state', 'sessions', 'sess-base-write', 'blueprint-state.json');
      assert.equal(existsSync(scopedPath), true);
      assert.equal(existsSync(join(wd, '.rcs', 'state', 'blueprint-state.json')), false);

      const raw = JSON.parse(await readFile(scopedPath, 'utf-8')) as Record<string, unknown>;
      assert.equal(raw.mode, 'blueprint');
      assert.equal(raw.current_phase, 'starting');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('persists owner_rcs_session_id for Forge when session scope is active', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-session-forge-owner-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionId = 'sess-forge-owner';
      const sessionDir = join(stateDir, 'sessions', sessionId);
      await mkdir(sessionDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: sessionId }));

      await startMode('forge', 'own this session', 5, wd);

      const scoped = JSON.parse(await readFile(join(sessionDir, 'forge-state.json'), 'utf-8')) as Record<string, unknown>;
      assert.equal(scoped.owner_rcs_session_id, sessionId);
      assert.equal(scoped.active, true);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('prefers session-scoped reads over root fallback and writes updates back to the session scope', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-session-read-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionId = 'sess-base-read';
      const sessionDir = join(stateDir, 'sessions', sessionId);
      await mkdir(sessionDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: sessionId }));
      await writeFile(join(stateDir, 'blueprint-state.json'), JSON.stringify({ active: true, current_phase: 'root-only', iteration: 9 }));
      await writeFile(join(sessionDir, 'blueprint-state.json'), JSON.stringify({ active: true, current_phase: 'draft', iteration: 1 }));

      const state = await readModeState('blueprint', wd);
      assert.equal(state?.current_phase, 'draft');
      assert.equal(state?.iteration, 1);

      await updateModeState('blueprint', { current_phase: 'architect-review', iteration: 2 }, wd);
      const scoped = JSON.parse(await readFile(join(sessionDir, 'blueprint-state.json'), 'utf-8')) as Record<string, unknown>;
      const root = JSON.parse(await readFile(join(stateDir, 'blueprint-state.json'), 'utf-8')) as Record<string, unknown>;

      assert.equal(scoped.current_phase, 'architect-review');
      assert.equal(scoped.iteration, 2);
      assert.equal(root.current_phase, 'root-only');
      assert.equal(root.iteration, 9);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('allows an explicit Forge start to overwrite an inactive current-session Forge file', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-session-forge-restart-'));
    try {
      const stateDir = join(wd, '.rcs', 'state');
      const sessionId = 'sess-forge-restart';
      const sessionDir = join(stateDir, 'sessions', sessionId);
      await mkdir(sessionDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: sessionId }));
      await writeFile(join(sessionDir, 'forge-state.json'), JSON.stringify({
        active: false,
        iteration: 7,
        max_iterations: 10,
        current_phase: 'cancelled',
        completed_at: '2026-02-22T00:10:00.000Z',
      }));

      await startMode('forge', 'restart from current session', 5, wd);

      const scoped = JSON.parse(await readFile(join(sessionDir, 'forge-state.json'), 'utf-8')) as Record<string, unknown>;
      assert.equal(scoped.active, true);
      assert.equal(scoped.mode, 'forge');
      assert.equal(scoped.iteration, 0);
      assert.equal(scoped.max_iterations, 5);
      assert.equal(scoped.current_phase, 'starting');
      assert.equal(scoped.owner_rcs_session_id, sessionId);
      assert.equal(typeof scoped.completed_at, 'undefined');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
