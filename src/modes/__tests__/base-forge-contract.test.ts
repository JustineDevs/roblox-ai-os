import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readModeState, startMode, updateModeState } from '../base.js';

describe('modes/base forge contract integration', () => {
  it('startMode rejects invalid forge max_iterations values', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-forge-contract-'));
    try {
      await assert.rejects(
        () => startMode('forge', 'demo', 0, wd),
        /forge\.max_iterations must be a finite (number|integer) > 0/,
      );
      assert.equal(existsSync(join(wd, '.rcs', 'state', 'forge-state.json')), false);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState rejects invalid forge phase and keeps previous persisted state', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-forge-contract-'));
    try {
      await startMode('forge', 'demo', 5, wd);
      const before = await readModeState('forge', wd);
      assert.ok(before);

      await assert.rejects(
        () => updateModeState(
          'forge',
          { current_phase: 'bananas', iteration: -1, max_iterations: 0 },
          wd,
        ),
        /forge\.current_phase must be one of:/,
      );

      const after = await readModeState('forge', wd);
      assert.ok(after);
      assert.equal(after?.current_phase, before?.current_phase);
      assert.equal(after?.iteration, before?.iteration);
      assert.equal(after?.max_iterations, before?.max_iterations);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState normalizes legacy forge phase aliases via shared contract', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-forge-contract-'));
    try {
      await startMode('forge', 'demo', 5, wd);
      const updated = await updateModeState('forge', { current_phase: 'verification' }, wd);
      assert.equal(updated.current_phase, 'verifying');
      assert.equal(updated.forge_phase_normalized_from, 'verification');
      assert.equal(updated.run_outcome, 'continue');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('updateModeState persists terminal run outcomes on blocked_on_user', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-forge-contract-'));
    try {
      await startMode('forge', 'demo', 5, wd);
      const updated = await updateModeState('forge', { active: false, current_phase: 'blocked_on_user' }, wd);
      assert.equal(updated.current_phase, 'blocked_on_user');
      assert.equal(updated.run_outcome, 'blocked_on_user');
      assert.equal(updated.active, false);
      assert.ok(typeof updated.completed_at === 'string' && updated.completed_at.length > 0);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
