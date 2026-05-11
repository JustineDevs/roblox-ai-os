import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

describe('nested help routing', () => {
  for (const [argv, expectedUsage] of [
    [['adapt', '--help'], /Usage:\s*rcs adapt <target> <probe\|status\|init\|envelope\|doctor>/i],
    [['ask', '--help'], /Usage:\s*rcs ask <claude\|gemini> <question or task>/i],
    [['question', '--help'], /rcs question - RCS-owned blocking user question entrypoint/i],
    [['autoresearch', '--help'], /hard-deprecated legacy command surface[\s\S]*\$autoresearch/i],
    [['hud', '--help'], /Usage:\s*\n\s*rcs hud\s+Show current HUD state/i],
    [['hooks', '--help'], /Usage:\s*\n\s*rcs hooks init/i],
    [['state', '--help'], /Usage:\s*rcs state <read\|write\|clear\|list-active\|get-status>/i],
    [['mcp-serve', '--help'], /Usage:\s*rcs mcp-serve <target>/i],
    [['tmux-hook', '--help'], /Usage:\s*\n\s*rcs tmux-hook init/i],
  ] satisfies Array<[string[], RegExp]>) {
    it(`routes ${argv.join(' ')} to command-local help`, async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-nested-help-'));
      try {
        const result = await runRcsCli(cwd, argv);
        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.match(result.stdout, expectedUsage);
        assert.doesNotMatch(result.stdout, /Roblox Creator Skills \(rcs\) - Creator workflow runtime for Codex CLI/i);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  }

  it('routes `rcs state read` through the top-level CLI', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-state-route-'));
    try {
      const result = await runRcsCli(cwd, ['state', 'read', '--input', '{"mode":"forge"}', '--json']);
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(result.stdout.trim(), /^\{"exists":false,"mode":"forge"\}$/);
      assert.doesNotMatch(result.stdout, /Unknown command: state/i);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
