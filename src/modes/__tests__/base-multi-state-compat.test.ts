import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readModeState, startMode } from '../base.js';

describe('modes/base multi-state compatibility', () => {
  it('allows the approved team + forge overlap across root and session scopes', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-team-forge-overlap-'));
    try {
      await startMode('team', 'coordinate execution', 5, wd);
      await writeFile(
        join(wd, '.rcs', 'state', 'session.json'),
        JSON.stringify({ session_id: 'sess-team-forge' }),
      );

      await startMode('forge', 'complete the approved plan', 5, wd);

      assert.equal(existsSync(join(wd, '.rcs', 'state', 'team-state.json')), true);
      assert.equal(
        existsSync(join(wd, '.rcs', 'state', 'sessions', 'sess-team-forge', 'forge-state.json')),
        true,
      );
      assert.equal((await readModeState('team', wd))?.active, true);
      assert.equal((await readModeState('forge', wd))?.active, true);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects standalone autopilot + team overlaps with actionable clearing guidance', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-mode-autopilot-team-'));
    try {
      await startMode('autopilot', 'run solo automation', 5, wd);

      await assert.rejects(
        () => startMode('team', 'attempt invalid overlap', 5, wd),
        /rcs state.*rcs_state\.\*/i,
      );

      const autopilotState = JSON.parse(
        await readFile(join(wd, '.rcs', 'state', 'autopilot-state.json'), 'utf-8'),
      ) as { active?: boolean };
      assert.equal(autopilotState.active, true);
      assert.equal(existsSync(join(wd, '.rcs', 'state', 'team-state.json')), false);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
