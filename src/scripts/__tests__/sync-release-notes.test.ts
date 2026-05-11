import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { syncReleaseNotes } from '../sync-release-notes.js';

const TEMPLATE = `<!-- RCS:RELEASE-NOTES:START -->
# Release Notes v{{VERSION}}

**Package:** \`@jstn-sdk/rcs@{{VERSION}}\`  
**Tag:** \`v{{VERSION}}\`  
**Release date:** \`{{DATE}}\`
<!-- RCS:RELEASE-NOTES:END -->

## Summary

Fill me in.

## Contributors

Release contributors will be injected during release generation.

**Full Changelog**: placeholder
`;

describe('sync-release-notes', () => {
  it('creates a versioned release-notes file from the template when missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-release-notes-'));
    try {
      await mkdir(join(root, 'docs'), { recursive: true });
      await writeFile(join(root, 'docs', 'release-notes-template.md'), TEMPLATE);

      const result = syncReleaseNotes({
        version: '0.2.0',
        date: '2026-05-11',
        templatePath: 'docs/release-notes-template.md',
        outPath: 'docs/release-notes-v0.2.0.md',
        check: false,
      }, root);

      assert.equal(result.changed, true);
      const output = await readFile(join(root, 'docs', 'release-notes-v0.2.0.md'), 'utf-8');
      assert.match(output, /Release Notes v0\.2\.0/);
      assert.match(output, /@jstn-sdk\/rcs@0\.2\.0/);
      assert.match(output, /2026-05-11/);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('updates only the managed block while preserving handwritten body sections', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-release-notes-update-'));
    try {
      await mkdir(join(root, 'docs'), { recursive: true });
      await writeFile(join(root, 'docs', 'release-notes-template.md'), TEMPLATE);
      await writeFile(
        join(root, 'docs', 'release-notes-v0.2.0.md'),
        `<!-- RCS:RELEASE-NOTES:START -->
# Release Notes v0.1.0
<!-- RCS:RELEASE-NOTES:END -->

## Summary

Keep this handwritten summary.
`,
      );

      const result = syncReleaseNotes({
        version: '0.2.0',
        date: '2026-05-11',
        templatePath: 'docs/release-notes-template.md',
        outPath: 'docs/release-notes-v0.2.0.md',
        check: false,
      }, root);

      assert.equal(result.changed, true);
      const output = await readFile(join(root, 'docs', 'release-notes-v0.2.0.md'), 'utf-8');
      assert.match(output, /Release Notes v0\.2\.0/);
      assert.match(output, /Keep this handwritten summary\./);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('fails in check mode when the versioned release note file is stale', async () => {
    const root = await mkdtemp(join(tmpdir(), 'rcs-sync-release-notes-check-'));
    try {
      await mkdir(join(root, 'docs'), { recursive: true });
      await writeFile(join(root, 'docs', 'release-notes-template.md'), TEMPLATE);
      await writeFile(
        join(root, 'docs', 'release-notes-v0.2.0.md'),
        `<!-- RCS:RELEASE-NOTES:START -->
# Release Notes v0.1.0
<!-- RCS:RELEASE-NOTES:END -->
`,
      );

      assert.throws(
        () => syncReleaseNotes({
          version: '0.2.0',
          date: '2026-05-11',
          templatePath: 'docs/release-notes-template.md',
          outPath: 'docs/release-notes-v0.2.0.md',
          check: true,
        }, root),
        /release_notes_sync_out_of_date:stale/,
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
