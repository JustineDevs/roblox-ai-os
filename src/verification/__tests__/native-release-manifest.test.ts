import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('native release manifest generator', () => {
  it('annotates Linux libc variants and sorts musl assets before glibc fallbacks', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-native-release-manifest-'));
    try {
      const artifactsDir = join(root, 'artifacts');
      await mkdir(artifactsDir, { recursive: true });

      const muslArchive = 'rcs-sparkshell-x86_64-unknown-linux-musl.tar.gz';
      const glibcArchive = 'rcs-sparkshell-x86_64-unknown-linux-gnu.tar.gz';
      await writeFile(join(artifactsDir, muslArchive), 'musl');
      await writeFile(join(artifactsDir, `${muslArchive}.sha256`), 'musl-checksum\n');
      await writeFile(join(artifactsDir, glibcArchive), 'glibc');
      await writeFile(join(artifactsDir, `${glibcArchive}.sha256`), 'glibc-checksum\n');

      const planPath = join(root, 'dist-plan.json');
      await writeFile(planPath, JSON.stringify({
        announcement_tag: 'v0.10.2',
        releases: [
          { app_name: 'rcs-sparkshell', app_version: '0.10.2' },
        ],
        artifacts: {
          linuxGlibc: {
            kind: 'executable-zip',
            name: glibcArchive,
            checksum: `${glibcArchive}.sha256`,
            target_triples: ['x86_64-unknown-linux-gnu'],
            assets: [
              {
                kind: 'executable',
                name: 'rcs-sparkshell',
                path: 'rcs-sparkshell',
              },
            ],
          },
          linuxMusl: {
            kind: 'executable-zip',
            name: muslArchive,
            checksum: `${muslArchive}.sha256`,
            target_triples: ['x86_64-unknown-linux-musl'],
            assets: [
              {
                kind: 'executable',
                name: 'rcs-sparkshell',
                path: 'rcs-sparkshell',
              },
            ],
          },
        },
      }, null, 2));

      const outputPath = join(root, 'native-release-manifest.json');
      const result = spawnSync(process.execPath, [
        join(process.cwd(), 'dist', 'scripts', 'generate-native-release-manifest.js'),
        '--plan',
        planPath,
        '--artifacts-dir',
        artifactsDir,
        '--out',
        outputPath,
        '--release-base-url',
        'https://github.com/example/releases/download/v0.10.2',
      ], {
        cwd: process.cwd(),
        encoding: 'utf-8',
      });
      assert.equal(result.status, 0, result.stderr || result.stdout);

      const manifest = JSON.parse(await readFile(outputPath, 'utf-8')) as {
        assets: Array<{ archive: string; libc?: string; target?: string }>;
      };
      assert.deepEqual(
        manifest.assets.map((asset) => asset.archive),
        [muslArchive, glibcArchive],
      );
      assert.deepEqual(
        manifest.assets.map((asset) => asset.libc),
        ['musl', 'glibc'],
      );
      assert.deepEqual(
        manifest.assets.map((asset) => asset.target),
        ['x86_64-unknown-linux-musl', 'x86_64-unknown-linux-gnu'],
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
