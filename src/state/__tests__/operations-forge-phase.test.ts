import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { executeStateOperation } from '../operations.js';

describe('state operations forge phase contract', () => {
  it('normalizes legacy forge phase aliases on state_write', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-forge-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'forge',
        active: true,
        current_phase: 'execution',
        started_at: '2026-02-22T00:00:00.000Z',
      });
      assert.equal(response.isError, undefined);

      const file = join(wd, '.rcs', 'state', 'forge-state.json');
      const state = JSON.parse(await readFile(file, 'utf-8'));
      assert.equal(state.current_phase, 'executing');
      assert.equal(state.forge_phase_normalized_from, 'execution');
      assert.equal(state.run_outcome, 'continue');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('accepts blocked_on_user as an explicit terminal forge outcome', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-forge-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'forge',
        active: false,
        current_phase: 'blocked_on_user',
      });
      assert.equal(response.isError, undefined);

      const file = join(wd, '.rcs', 'state', 'forge-state.json');
      const state = JSON.parse(await readFile(file, 'utf-8'));
      assert.equal(state.current_phase, 'blocked_on_user');
      assert.equal(state.run_outcome, 'blocked_on_user');
      assert.equal(typeof state.completed_at, 'string');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects unknown forge phases on state_write', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-forge-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'forge',
        active: true,
        current_phase: 'bananas',
      });
      assert.equal(response.isError, true);
      const body = response.payload as { error?: string };
      assert.match(body.error || '', /forge\.current_phase must be one of|must be one of/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects terminal forge phase when active=true', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-forge-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'forge',
        active: true,
        current_phase: 'complete',
      });
      assert.equal(response.isError, true);
      const body = response.payload as { error?: string };
      assert.match(body.error || '', /terminal Forge phases require active=false/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects fractional iteration values for forge state', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-forge-phase-'));
    try {
      const response = await executeStateOperation('state_write', {
        workingDirectory: wd,
        mode: 'forge',
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
