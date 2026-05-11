import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildSurfaceMapMarkdown,
  collectSurfaceTaxonomy,
  validateSurfaceTaxonomy,
  validateVocabularyDiscipline,
} from '../../scripts/surface-taxonomy.js';

const root = process.cwd();

describe('surface taxonomy contract', () => {
  it('active prompts, skills, missions, and sandboxes expose valid taxonomy metadata', () => {
    const records = collectSurfaceTaxonomy(root);
    assert.ok(records.length > 0);
    assert.deepEqual(validateSurfaceTaxonomy(records), []);
  });

  it('representative surfaces stay in the intended canonical/operator/internal/historical lanes', () => {
    const records = collectSurfaceTaxonomy(root);
    const byPath = new Map(records.map((record) => [record.path, record]));

    assert.equal(byPath.get('prompts/analyst.md')?.surfaceClass, 'internal');
    assert.equal(byPath.get('skills/forge/SKILL.md')?.surfaceClass, 'canonical');
    assert.equal(byPath.get('skills/worker/SKILL.md')?.surfaceClass, 'internal');
    assert.equal(byPath.get('skills/web-clone/SKILL.md')?.surfaceClass, 'historical');
    assert.equal(byPath.get('missions/remote-contract-hardening/mission.md')?.surfaceClass, 'canonical');
    assert.equal(byPath.get('missions/remote-contract-hardening/sandbox.md')?.artifactType, 'sandbox');
  });

  it('active taxonomy surfaces stay free of removed generic role labels and unguarded enterprise vocabulary', () => {
    const records = collectSurfaceTaxonomy(root);
    assert.deepEqual(validateVocabularyDiscipline(records, root), []);
  });

  it('surface-map reference doc stays synchronized with taxonomy metadata', () => {
    const expected = `${buildSurfaceMapMarkdown(collectSurfaceTaxonomy(root))}\n`;
    const actual = readFileSync(join(root, 'docs/reference/surface-map.md'), 'utf8');
    assert.equal(actual, expected);
  });
});
