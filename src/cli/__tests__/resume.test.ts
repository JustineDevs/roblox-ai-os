import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function runRcsCli(
  cwd: string,
  argv: string[],
  envOverrides: Record<string, string> = {},
): { status: number | null; stdout: string; stderr: string; error: string } {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(testDir, '..', '..', '..');
  const rcsBin = join(repoRoot, 'dist', 'cli', 'rcs.js');
  const result = spawnSync(process.execPath, [rcsBin, ...argv], {
    cwd,
    encoding: 'utf-8',
    env: {
      ...process.env,
      ...envOverrides,
    },
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error?.message || '',
  };
}

describe('rcs resume', () => {
  it('forwards --last to codex resume through the normal launch wrapper', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-resume-cli-'));
    try {
      const home = join(wd, 'home');
      const fakeBin = join(wd, 'bin');
      const fakeCodexPath = join(fakeBin, 'codex');
      const fakePsPath = join(fakeBin, 'ps');

      await mkdir(home, { recursive: true });
      await mkdir(fakeBin, { recursive: true });
      await writeFile(fakeCodexPath, '#!/bin/sh\nprintf \'fake-codex:%s\\n\' \"$*\"\n');
      await chmod(fakeCodexPath, 0o755);
      await writeFile(fakePsPath, '#!/bin/sh\nexit 0\n');
      await chmod(fakePsPath, 0o755);

      const result = runRcsCli(wd, ['resume', '--last'], {
        HOME: home,
        PATH: `${fakeBin}:/usr/bin:/bin`,
        RCS_AUTO_UPDATE: '0',
        RCS_NOTIFY_FALLBACK: '0',
        RCS_HOOK_DERIVED_SIGNALS: '0',
      });

      assert.equal(result.status, 0, result.error || result.stderr || result.stdout);
      assert.match(result.stdout, /fake-codex:resume --last\b/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('passes resume --help through to codex instead of printing top-level rcs help', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-resume-cli-'));
    try {
      const home = join(wd, 'home');
      const fakeBin = join(wd, 'bin');
      const fakeCodexPath = join(fakeBin, 'codex');
      const fakePsPath = join(fakeBin, 'ps');

      await mkdir(home, { recursive: true });
      await mkdir(fakeBin, { recursive: true });
      await writeFile(fakeCodexPath, '#!/bin/sh\nprintf \'fake-codex:%s\\n\' \"$*\"\n');
      await chmod(fakeCodexPath, 0o755);
      await writeFile(fakePsPath, '#!/bin/sh\nexit 0\n');
      await chmod(fakePsPath, 0o755);

      const result = runRcsCli(wd, ['resume', '--help'], {
        HOME: home,
        PATH: `${fakeBin}:/usr/bin:/bin`,
        RCS_AUTO_UPDATE: '0',
        RCS_NOTIFY_FALLBACK: '0',
        RCS_HOOK_DERIVED_SIGNALS: '0',
      });

      assert.equal(result.status, 0, result.error || result.stderr || result.stdout);
      assert.match(result.stdout, /fake-codex:resume --help\b/);
      assert.doesNotMatch(result.stdout, /Unknown command: resume/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
