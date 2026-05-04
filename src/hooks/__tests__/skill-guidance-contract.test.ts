import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKILL_CONTRACTS } from '../prompt-guidance-contract.js';
import { assertContractSurface, loadSurface } from './prompt-guidance-test-helpers.js';

describe('execution-heavy skill guidance contract', () => {
  for (const contract of SKILL_CONTRACTS) {
    it(`${contract.id} satisfies the execution-heavy skill guidance contract`, () => {
      assertContractSurface(contract);
    });
  }

  it('ultrawork guidance stays RCS-native and avoids upstream-only runtime taxonomy', () => {
    const content = loadSurface('skills/ultrawork/SKILL.md');
    assert.doesNotMatch(content, /@opencode-ai\/plugin|bun:sqlite|\.sisyphus/i);
    assert.doesNotMatch(content, /\boracle\b|\blibrarian\b|\bartistry\b|\bPrometheus\b/i);
    assert.match(content, /Ralph owns persistence, architect verification, deslop, and the full verified-completion promise/i);
  });

  it('Roblox creator workflow skills enforce the pre-action gate before implementation', () => {
    const brief = loadSurface('skills/brief/SKILL.md');
    const blueprint = loadSurface('skills/blueprint/SKILL.md');
    const forge = loadSurface('skills/forge/SKILL.md');
    const autoforge = loadSurface('skills/autoforge/SKILL.md');

    assert.match(brief, /PRE_ACTION_COMPLETE/i);
    assert.match(brief, /templates\/roblox\/pre-action-plan\.md/i);
    assert.match(blueprint, /creator-docs as canonical/i);
    assert.match(forge, /Do not generate implementation code until/i);
    assert.match(autoforge, /PRE_ACTION_COMPLETE/i);
  });
});
