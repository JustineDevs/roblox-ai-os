import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readModeState, startMode, updateModeState } from '../base.js';

describe('modes/base ralph contract integration', () => {
  it('startMode rejects invalid Ralph max_iterations values', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-ralph-contract-'));
    try {
      await assert.rejects(
        () => startMode('ralph', 'demo', 0, wd),
        /ralph\.max_iterations must be a finite (number|integer) > 0/,
      );
      assert.equal(existsSync(join(wd, '.rcs', 'state', 'ralph-state.json')), false);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState rejects invalid Ralph phase and keeps previous persisted state', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-ralph-contract-'));
    try {
      await startMode('ralph', 'demo', 5, wd);
      const before = await readModeState('ralph', wd);
      assert.ok(before);

      await assert.rejects(
        () => updateModeState(
          'ralph',
          { current_phase: 'bananas', iteration: -1, max_iterations: 0 },
          wd,
        ),
        /ralph\.current_phase must be one of:/,
      );

      const after = await readModeState('ralph', wd);
      assert.ok(after);
      assert.equal(after?.current_phase, before?.current_phase);
      assert.equal(after?.iteration, before?.iteration);
      assert.equal(after?.max_iterations, before?.max_iterations);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState normalizes legacy Ralph phase aliases via shared contract', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-ralph-contract-'));
    try {
      await startMode('ralph', 'demo', 5, wd);
      const updated = await updateModeState('ralph', { current_phase: 'verification' }, wd);
      assert.equal(updated.current_phase, 'verifying');
      assert.equal(updated.ralph_phase_normalized_from, 'verification');
      assert.equal(updated.run_outcome, 'continue');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState persists terminal run outcomes on blocked_on_user', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-ralph-contract-'));
    try {
      await startMode('ralph', 'demo', 5, wd);
      const updated = await updateModeState('ralph', { active: false, current_phase: 'blocked_on_user' }, wd);
      assert.equal(updated.current_phase, 'blocked_on_user');
      assert.equal(updated.run_outcome, 'blocked_on_user');
      assert.equal(updated.active, false);
      assert.ok(typeof updated.completed_at === 'string' && updated.completed_at.length > 0);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
