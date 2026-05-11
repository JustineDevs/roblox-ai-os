import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const forgeSkill = readFileSync(join(__dirname, '../../../skills/forge/SKILL.md'), 'utf-8');

describe('forge deslop workflow contract', () => {
  it('requires a mandatory deslop pass after architect verification', () => {
    assert.match(forgeSkill, /Step 7\.5/i);
    assert.match(forgeSkill, /Mandatory Deslop Pass/i);
    assert.match(forgeSkill, /roblox-ai-os-creator-skills:ai-slop-cleaner/i);
    assert.match(forgeSkill, /changed files only/i);
    assert.match(forgeSkill, /standard mode/i);
    assert.match(forgeSkill, /not `--review`/i);
  });

  it('requires post-deslop regression re-verification', () => {
    assert.match(forgeSkill, /Step 7\.6/i);
    assert.match(forgeSkill, /Regression Re-verification/i);
    assert.match(forgeSkill, /re-run all tests\/build\/lint/i);
    assert.match(forgeSkill, /roll back cleaner changes or fix and retry/i);
  });

  it('extends the final checklist with deslop completion and post-deslop regression proof', () => {
    assert.match(
      forgeSkill,
      /\[ \] ai-slop-cleaner pass completed on changed files \(or --no-deslop specified\)/i,
    );
    assert.match(forgeSkill, /\[ \] Post-deslop regression tests pass/i);
  });
});
