import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { stateCommand } from '../state.js';

describe('stateCommand', () => {
  it('prints help for empty args', async () => {
    const out: string[] = [];
    await stateCommand([], {
      stdout: (line) => out.push(line),
      stderr: () => undefined,
    });
    assert.match(out.join('\n'), /Usage: rcs state/);
  });

  it('emits a frozen compact JSON envelope when --json is set', async () => {
    const out: string[] = [];
    await stateCommand(['read', '--input', '{"mode":"forge"}', '--json'], {
      stdout: (line) => out.push(line),
      stderr: () => undefined,
      execute: async () => ({ payload: { exists: false, mode: 'forge' } }),
    });
    assert.deepEqual(out, ['{"exists":false,"mode":"forge"}']);
  });

  it('writes errors to stderr and sets exitCode', async () => {
    const err: string[] = [];
    const previousExitCode = process.exitCode;
    try {
      process.exitCode = undefined;
      await stateCommand(['clear', '--input', '{"mode":"forge"}', '--json'], {
        stdout: () => undefined,
        stderr: (line) => err.push(line),
        execute: async () => ({ payload: { error: 'boom' }, isError: true }),
      });
      assert.equal(process.exitCode, 1);
      assert.deepEqual(err, ['{"error":"boom"}']);
    } finally {
      process.exitCode = previousExitCode;
    }
  });

  it('rejects malformed --input JSON', async () => {
    await assert.rejects(
      stateCommand(['read', '--input', '{bad-json'], {
        stdout: () => undefined,
        stderr: () => undefined,
      }),
      /valid JSON/i,
    );
  });
});
