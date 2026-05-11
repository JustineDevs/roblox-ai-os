import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf-8');
}

describe('semantic design system contract', () => {
  it('defines a canonical vocabulary source and semantic design system source', () => {
    const vocabulary = read('docs/reference/canonical-vocabulary.md');
    const semanticSystem = read('docs/reference/semantic-design-system.md');

    assert.match(vocabulary, /Canonical Vocabulary/i);
    assert.match(vocabulary, /Preferred Terms/i);
    assert.match(vocabulary, /Surface Taxonomy/i);
    assert.match(semanticSystem, /Semantic Design System/i);
    assert.match(semanticSystem, /Mission Contract/i);
  });

  it('wires AGENTS and pre-action planning to the canonical vocabulary', () => {
    const agents = read('templates/AGENTS.md');
    const preActionProtocol = read('docs/reference/roblox-pre-action-protocol.md');
    const preActionPlan = read('templates/roblox/pre-action-plan.md');

    assert.match(agents, /canonical-vocabulary\.md/i);
    assert.match(agents, /semantic-design-system\.md/i);
    assert.match(preActionProtocol, /canonical-vocabulary\.md/i);
    assert.match(preActionPlan, /Vocabulary source:/i);
  });

  it('missions read like semantic creator contracts instead of loose prose bundles', () => {
    const missionFiles = [
      'missions/remote-contract-hardening/mission.md',
      'missions/profile-datastore-recovery/mission.md',
      'missions/gui-onboarding-clarity/mission.md',
      'missions/cross-server-party-flow/mission.md',
      'missions/liveops-reward-loop-balance/mission.md',
    ];
    for (const file of missionFiles) {
      const content = read(file);
      assert.match(content, /surface-class:\s*"canonical"/);
      assert.match(content, /domain:\s*"roblox-studio"/);
      assert.match(content, /audience:\s*"creator"/);
      assert.match(content, /artifact-type:\s*"mission"/);
      assert.match(content, /## Creator Outcome/);
      assert.match(content, /## Player Outcome/);
      assert.match(content, /## Deliverable/);
      assert.match(content, /## Roblox Touchpoints/);
      assert.match(content, /## Required Services/);
      assert.match(content, /## Acceptance Signals/);
      assert.match(content, /## Server-Authority Risks/);
      assert.match(content, /## Anti-Patterns/);
      assert.match(content, /## Forbidden Language/);
      assert.match(content, /## Reference Layers/);
      assert.match(content, /## Validation/);
    }
  });

  it('mission sandboxes expose semantic scope and vocabulary guardrails', () => {
    const sandboxFiles = [
      'missions/remote-contract-hardening/sandbox.md',
      'missions/profile-datastore-recovery/sandbox.md',
      'missions/gui-onboarding-clarity/sandbox.md',
      'missions/cross-server-party-flow/sandbox.md',
      'missions/liveops-reward-loop-balance/sandbox.md',
    ];
    for (const file of sandboxFiles) {
      const content = read(file);
      assert.match(content, /surface-class:\s*"canonical"/);
      assert.match(content, /domain:\s*"roblox-studio"/);
      assert.match(content, /audience:\s*"creator"/);
      assert.match(content, /artifact-type:\s*"sandbox"/);
      assert.match(content, /evaluation:/);
      assert.match(content, /scope:/);
      assert.match(content, /tightly_scoped_to:/);
      assert.match(content, /out_of_scope:/);
      assert.match(content, /required_services:/);
      assert.match(content, /acceptance_signals:/);
      assert.match(content, /anti_patterns:/);
      assert.match(content, /forbidden_language:/);
      assert.match(content, /reference_layers:/);
      assert.match(content, /vocabulary_guardrail:/);
    }
  });
});
