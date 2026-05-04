import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { main } from '../index.js';

async function runRcsCli(cwd: string, argv: string[]): Promise<{ status: number; stdout: string; stderr: string }> {
  const previousCwd = process.cwd();
  const previousEnv = {
    RCS_AUTO_UPDATE: process.env.RCS_AUTO_UPDATE,
    RCS_NOTIFY_FALLBACK: process.env.RCS_NOTIFY_FALLBACK,
    RCS_HOOK_DERIVED_SIGNALS: process.env.RCS_HOOK_DERIVED_SIGNALS,
  };
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalExitCode = process.exitCode;

  try {
    process.chdir(cwd);
    process.env.RCS_AUTO_UPDATE = '0';
    process.env.RCS_NOTIFY_FALLBACK = '0';
    process.env.RCS_HOOK_DERIVED_SIGNALS = '0';
    process.exitCode = 0;
    console.log = (...args: unknown[]) => {
      stdout.push(args.map((arg) => String(arg)).join(' '));
    };
    console.error = (...args: unknown[]) => {
      stderr.push(args.map((arg) => String(arg)).join(' '));
    };
    await main(argv);
    return {
      status: process.exitCode ?? 0,
      stdout: stdout.join('\n'),
      stderr: stderr.join('\n'),
    };
  } finally {
    process.chdir(previousCwd);
    process.exitCode = originalExitCode;
    console.log = originalLog;
    console.error = originalError;
    if (previousEnv.RCS_AUTO_UPDATE === undefined) delete process.env.RCS_AUTO_UPDATE;
    else process.env.RCS_AUTO_UPDATE = previousEnv.RCS_AUTO_UPDATE;
    if (previousEnv.RCS_NOTIFY_FALLBACK === undefined) delete process.env.RCS_NOTIFY_FALLBACK;
    else process.env.RCS_NOTIFY_FALLBACK = previousEnv.RCS_NOTIFY_FALLBACK;
    if (previousEnv.RCS_HOOK_DERIVED_SIGNALS === undefined) delete process.env.RCS_HOOK_DERIVED_SIGNALS;
    else process.env.RCS_HOOK_DERIVED_SIGNALS = previousEnv.RCS_HOOK_DERIVED_SIGNALS;
  }
}

describe('rcs session help', () => {
  it('documents the session search command in help output', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-session-help-'));
    try {
      const mainHelp = await runRcsCli(cwd, ['--help']);
      assert.equal(mainHelp.status, 0, mainHelp.stderr || mainHelp.stdout);
      assert.match(mainHelp.stdout, /rcs resume\s+Resume a previous interactive Codex session/i);
      assert.match(mainHelp.stdout, /rcs autoresearch\s+\[DEPRECATED\] Use \$autoresearch; direct CLI launch removed/i);
      assert.match(mainHelp.stdout, /rcs session\s+Search prior local session transcripts/i);

      const sessionHelp = await runRcsCli(cwd, ['session', '--help']);
      assert.equal(sessionHelp.status, 0, sessionHelp.stderr || sessionHelp.stdout);
      assert.match(sessionHelp.stdout, /rcs session search <query>/i);
      assert.match(sessionHelp.stdout, /--since <spec>/i);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
