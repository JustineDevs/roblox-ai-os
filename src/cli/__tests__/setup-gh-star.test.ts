import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function runRcsCli(
  cwd: string,
  argv: string[],
  envOverrides: Record<string, string> = {}
): { status: number | null; stdout: string; stderr: string; error: string } {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(testDir, '..', '..', '..');
  const rcsBin = join(repoRoot, 'dist', 'cli', 'rcs.js');
  const r = spawnSync(process.execPath, [rcsBin, ...argv], {
    cwd,
    encoding: 'utf-8',
    env: { ...process.env, ...envOverrides },
  });
  return {
    status: r.status,
    stdout: r.stdout || '',
    stderr: r.stderr || '',
    error: r.error?.message || '',
  };
}

function shouldSkipForSpawnPermissions(err: string): boolean {
  return typeof err === 'string' && /(EPERM|EACCES)/i.test(err);
}

describe('rcs setup (gh star hint)', () => {
  it('prints the support link when GitHub CLI is configured', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-setup-gh-'));
    try {
      const fakeBin = join(wd, 'bin');
      await mkdir(fakeBin, { recursive: true });
      const ghPath = join(fakeBin, 'gh');
      await writeFile(
        ghPath,
        '#!/bin/sh\nif [ "$1" = "auth" ] && [ "$2" = "status" ]; then exit 0; fi\nexit 1\n'
      );
      await chmod(ghPath, 0o755);

      const home = join(wd, 'home');
      await mkdir(home, { recursive: true });

      const res = runRcsCli(wd, ['setup', '--dry-run'], {
        PATH: `${fakeBin}:${process.env.PATH || ''}`,
        HOME: home,
      });
      if (shouldSkipForSpawnPermissions(res.error)) return;
      assert.equal(res.status, 0, res.stderr || res.stdout);
      assert.match(res.stdout, /Support the project: https:\/\/github\.com\/JustineDevs\/roblox-ai-os/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('does not print the support link when GitHub CLI is missing', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-setup-gh-'));
    try {
      const home = join(wd, 'home');
      await mkdir(home, { recursive: true });

      const res = runRcsCli(wd, ['setup', '--dry-run'], { PATH: '', HOME: home });
      if (shouldSkipForSpawnPermissions(res.error)) return;
      assert.equal(res.status, 0, res.stderr || res.stdout);
      assert.doesNotMatch(res.stdout, /Support the project: https:\/\/github\.com\/JustineDevs\/roblox-ai-os/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
