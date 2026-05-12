import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { syncGithubWiki } from '../sync-github-wiki.js';

describe('sync-github-wiki', () => {
  it('renders docs/wiki into a wiki working tree with rewritten GitHub links', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-github-wiki-'));
    try {
      await mkdir(join(root, 'docs', 'wiki'), { recursive: true });
      await writeFile(
        join(root, 'package.json'),
        JSON.stringify({
          repository: { url: 'git+https://github.com/JustineDevs/roblox-ai-os.git' },
        }),
      );
      await writeFile(join(root, 'README.md'), '# Root README\n');
      await writeFile(
        join(root, 'docs', 'wiki', 'Home.md'),
        '# Home\n\n- [Roadmap](./ROADMAP.md)\n- [Root](../../README.md)\n',
      );
      await writeFile(join(root, 'docs', 'wiki', 'ROADMAP.md'), '# Roadmap\n');

      const result = syncGithubWiki({
        sourceDir: 'docs/wiki',
        outDir: '.tmp/wiki-out',
        branch: 'main',
        check: false,
      }, root);

      assert.equal(result.changed, true);
      const rendered = await readFile(join(root, '.tmp', 'wiki-out', 'Home.md'), 'utf8');
      assert.match(rendered, /Generated from docs\/wiki\/Home\.md/);
      assert.match(rendered, /https:\/\/github\.com\/JustineDevs\/roblox-ai-os\/wiki\/ROADMAP/);
      assert.match(rendered, /https:\/\/github\.com\/JustineDevs\/roblox-ai-os\/blob\/main\/README\.md/);
      assert.equal(existsSync(join(root, '.tmp', 'wiki-out', '.rcs-wiki-sync-manifest.json')), true);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('removes stale managed wiki pages from a previous manifest', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-github-wiki-stale-'));
    try {
      await mkdir(join(root, 'docs', 'wiki'), { recursive: true });
      await mkdir(join(root, '.tmp', 'wiki-out'), { recursive: true });
      await writeFile(
        join(root, 'package.json'),
        JSON.stringify({
          repository: { url: 'git+https://github.com/JustineDevs/roblox-ai-os.git' },
        }),
      );
      await writeFile(join(root, 'docs', 'wiki', 'Home.md'), '# Home\n');
      await writeFile(join(root, '.tmp', 'wiki-out', 'Roadmap.md'), '# stale\n');
      await writeFile(
        join(root, '.tmp', 'wiki-out', '.rcs-wiki-sync-manifest.json'),
        JSON.stringify({ managedFiles: ['Roadmap.md'] }, null, 2),
      );

      const result = syncGithubWiki({
        sourceDir: 'docs/wiki',
        outDir: '.tmp/wiki-out',
        branch: 'main',
        check: false,
      }, root);

      assert.equal(result.deletedFiles.includes('Roadmap.md'), true);
      assert.equal(existsSync(join(root, '.tmp', 'wiki-out', 'Roadmap.md')), false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('fails in check mode when the wiki output is stale', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-github-wiki-check-'));
    try {
      await mkdir(join(root, 'docs', 'wiki'), { recursive: true });
      await writeFile(
        join(root, 'package.json'),
        JSON.stringify({
          repository: { url: 'git+https://github.com/JustineDevs/roblox-ai-os.git' },
        }),
      );
      await writeFile(join(root, 'docs', 'wiki', 'Home.md'), '# Home\n');

      assert.throws(
        () =>
          syncGithubWiki({
            sourceDir: 'docs/wiki',
            outDir: '.tmp/wiki-out',
            branch: 'main',
            check: true,
          }, root),
        /github_wiki_sync_out_of_date/,
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
