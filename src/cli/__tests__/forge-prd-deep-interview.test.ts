import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const forgeSkill = readFileSync(join(__dirname, '../../../skills/forge/SKILL.md'), 'utf-8');
const forgeInitSkill = readFileSync(join(__dirname, '../../../skills/forge-init/SKILL.md'), 'utf-8');

describe('forge PRD mode deep interview gate', () => {
  it('requires deep-interview --quick before PRD artifact creation', () => {
    assert.match(forgeSkill, /Run deep-interview in quick mode before creating PRD artifacts/i);
    assert.match(forgeSkill, /\$deep-interview\s+--quick/i);
    assert.match(forgeSkill, /\.rcs\/interviews\/\{slug\}-\{timestamp\}\.md/);
  });

  it('documents --no-deslop as a PRD-mode opt-out for the final deslop pass', () => {
    assert.match(forgeSkill, /--no-deslop/);
    assert.match(forgeSkill, /skip the deslop pass/i);
  });

  it('keeps forge-init aligned with the PRD startup compatibility contract', () => {
    assert.match(forgeInitSkill, /startup still validates machine-readable story state from `\.rcs\/prd\.json`/i);
    assert.match(forgeInitSkill, /canonical PRD markdown is not yet the startup validation source/i);
  });
});
