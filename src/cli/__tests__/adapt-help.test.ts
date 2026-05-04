import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function runRcsCli(cwd: string, argv: string[]) {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(testDir, '..', '..', '..');
  const rcsBin = join(repoRoot, 'dist', 'cli', 'rcs.js');
  return spawnSync(process.execPath, [rcsBin, ...argv], {
    cwd,
    encoding: 'utf-8',
    env: {
      ...process.env,
      RCS_AUTO_UPDATE: '0',
      RCS_NOTIFY_FALLBACK: '0',
      RCS_HOOK_DERIVED_SIGNALS: '0',
    },
  });
}

describe('rcs adapt help', () => {
  it('documents adapt in top-level help and routes adapt-local help output', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-adapt-help-'));
    try {
      const mainHelp = runRcsCli(cwd, ['--help']);
      assert.equal(mainHelp.status, 0, mainHelp.stderr || mainHelp.stdout);

      const adaptHelp = runRcsCli(cwd, ['adapt', '--help']);
      assert.equal(adaptHelp.status, 0, adaptHelp.stderr || adaptHelp.stdout);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
