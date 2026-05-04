import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { executeStateOperation } from '../operations.js';

describe('state operations Ralph phase contract', () => {
  it('normalizes legacy Ralph phase aliases on state_write', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-ralph-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'ralph',
        active: true,
        current_phase: 'execution',
        started_at: '2026-02-22T00:00:00.000Z',
      });
      assert.equal(response.isError, undefined);

      const file = join(wd, '.rcs', 'state', 'ralph-state.json');
      const state = JSON.parse(await readFile(file, 'utf-8'));
      assert.equal(state.current_phase, 'executing');
      assert.equal(state.ralph_phase_normalized_from, 'execution');
      assert.equal(state.run_outcome, 'continue');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('accepts blocked_on_user as an explicit terminal Ralph outcome', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-ralph-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'ralph',
        active: false,
        current_phase: 'blocked_on_user',
      });
      assert.equal(response.isError, undefined);

      const file = join(wd, '.rcs', 'state', 'ralph-state.json');
      const state = JSON.parse(await readFile(file, 'utf-8'));
      assert.equal(state.current_phase, 'blocked_on_user');
      assert.equal(state.run_outcome, 'blocked_on_user');
      assert.equal(typeof state.completed_at, 'string');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects unknown Ralph phases on state_write', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-ralph-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'ralph',
        active: true,
        current_phase: 'bananas',
      });
      assert.equal(response.isError, true);
      const body = response.payload as { error?: string };
      assert.match(body.error || '', /Invalid Ralph phase|must be one of/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects terminal Ralph phase when active=true', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-ralph-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'ralph',
        active: true,
        current_phase: 'complete',
      });
      assert.equal(response.isError, true);
      const body = response.payload as { error?: string };
      assert.match(body.error || '', /terminal Ralph phases require active=false/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects fractional iteration values for Ralph state', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-ralph-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'ralph',
        active: true,
        current_phase: 'executing',
        iteration: 0.25,
        max_iterations: 10.5,
      });
      assert.equal(response.isError, true);
      const body = response.payload as { error?: string };
      assert.match(body.error || '', /finite integer/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
