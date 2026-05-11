import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const visualVerdictSkill = readFileSync(join(__dirname, '../../../skills/visual-verdict/SKILL.md'), 'utf-8');
const forgeSkill = readFileSync(join(__dirname, '../../../skills/forge/SKILL.md'), 'utf-8');

describe('visual-verdict skill contract', () => {
  it('documents required JSON fields', () => {
    for (const field of ['"score"', '"verdict"', '"category_match"', '"differences"', '"suggestions"', '"reasoning"']) {
      assert.ok(visualVerdictSkill.includes(field), `missing field ${field}`);
    }
  });

  it('documents threshold and pixel diff guidance', () => {
    assert.match(visualVerdictSkill, /90\+/);
    assert.match(visualVerdictSkill, /pixel diff/i);
    assert.match(visualVerdictSkill, /pixelmatch/i);
  });
});

describe('forge visual loop integration guidance', () => {
  it('requires running $visual-verdict before next edit', () => {
    assert.match(forgeSkill, /\$visual-verdict/);
    assert.match(forgeSkill, /before every next edit/i);
  });

  it('documents -i and --images-dir flags', () => {
    assert.match(forgeSkill, /-i <image-path>/);
    assert.match(forgeSkill, /--images-dir <directory>/);
  });

  it('requires persisting visual feedback to forge-progress ledger', () => {
    assert.match(forgeSkill, /forge-progress\.json/);
    assert.match(forgeSkill, /numeric \+ qualitative feedback/i);
  });
});
