import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const autopilotSkill = readFileSync(join(__dirname, '../../../skills/autopilot/SKILL.md'), 'utf-8');

describe('autopilot skill strict 3-phase contract', () => {
  it('makes blueprint -> forge -> code-review the primary contract', () => {
    assert.match(autopilotSkill, /\$blueprint\s*->\s*\$forge\s*->\s*\$code-review/);
    assert.match(autopilotSkill, /strict autonomous delivery loop/i);
  });

  it('returns non-clean code-review findings to blueprint', () => {
    assert.match(autopilotSkill, /If `\$code-review` is not clean, Autopilot returns to `\$blueprint`/i);
    assert.match(autopilotSkill, /COMMENT.*REQUEST CHANGES.*WATCH.*BLOCK/s);
  });

  it('requires tight phase, cycle, handoff, review state fields', () => {
    for (const field of [
      'current_phase',
      'iteration',
      'review_cycle',
      'phase_cycle',
      'handoff_artifacts',
      'review_verdict',
      'return_to_blueprint_reason',
    ]) {
      assert.match(autopilotSkill, new RegExp(field));
    }
  });

  it('does not preserve the old broad phase lifecycle as primary behavior', () => {
    assert.doesNotMatch(autopilotSkill, /All 5 phases completed/i);
    assert.doesNotMatch(autopilotSkill, /Phase 0 - Expansion/i);
    assert.doesNotMatch(autopilotSkill, /Phase 4 - Validation/i);
    assert.match(autopilotSkill, /must not run a separate broad expansion\/planning\/execution\/QA\/validation lifecycle as its primary behavior/i);
  });
});
