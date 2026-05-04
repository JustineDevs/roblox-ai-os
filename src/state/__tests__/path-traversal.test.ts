import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

import { executeStateOperation } from '../operations.js';

describe('state CLI path traversal prevention', () => {
  it('rejects invalid workingDirectory inputs containing NUL bytes', async () => {
    const resp = await executeStateOperation('state_read', {
      mode: 'team',
      workingDirectory: 'bad\0path',
    });
    assert.equal(resp.isError, true);
    const body = resp.payload as { error?: string };
    assert.match(body.error || '', /NUL byte/);
  });

  it('rejects traversal in mode for state_write', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-traversal-'));
    try {
      const resp = await executeStateOperation('state_write', {
        mode: '../../outside',
        state: { active: true },
        workingDirectory: wd,
      });
      assert.equal(resp.isError, true);
      const body = resp.payload as { error?: string };
      assert.ok(typeof body.error === 'string' && body.error.length > 0);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('rejects unsupported mode names for state_read', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-traversal-'));
    try {
      const resp = await executeStateOperation('state_read', {
        mode: 'custom_mode',
        workingDirectory: wd,
      });
      assert.equal(resp.isError, true);
      const body = resp.payload as { error?: string };
      assert.ok(typeof body.error === 'string' && body.error.includes('mode must be one of'));
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
