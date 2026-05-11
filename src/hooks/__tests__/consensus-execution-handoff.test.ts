/**
 * Consensus mode execution handoff regression tests
 *
 * Verifies that the plan skill's consensus mode (blueprint) mandates:
 * 1. Structured question UI for approval (not plain text)
 * 2. Explicit $forge invocation on approval
 * 3. Prohibition of direct implementation from the planning agent
 * 4. User feedback step after Planner but before Architect/Critic
 * 5. BLUEPRINT-DR short mode and deliberate mode requirements
 *
 * Also verifies non-consensus modes (interview, direct, review) are unaffected,
 * and that architect/critic prompts contain required BLUEPRINT-DR sections.
 *
 * Note: This file loads SKILL.md and prompt content directly via fs.readFileSync()
 * instead of getBuiltinSkill() (which does not exist in RCS).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const planSkill = readFileSync(
  join(__dirname, '../../../skills/plan/SKILL.md'), 'utf-8'
);
const blueprintSkill = readFileSync(
  join(__dirname, '../../../skills/blueprint/SKILL.md'), 'utf-8'
);
const plannerPrompt = readFileSync(
  join(__dirname, '../../../prompts/planner.md'), 'utf-8'
);
const architectPrompt = readFileSync(
  join(__dirname, '../../../prompts/architect.md'), 'utf-8'
);
const criticPrompt = readFileSync(
  join(__dirname, '../../../prompts/critic.md'), 'utf-8'
);

/**
 * Extract a markdown section by heading using regex.
 */
function extractSection(content: string, heading: string): string | undefined {
  const pattern = new RegExp(`###\\s+${heading}[\\s\\S]*?(?=###|$)`);
  const match = content.match(pattern);
  return match?.[0];
}

describe('Consensus mode execution handoff (plan/SKILL.md)', () => {
  it('should mandate structured question UI for the approval step', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      consensusSection.includes('structured question UI'),
      'Consensus mode should mandate structured question UI'
    );
  });

  it('should mandate $forge invocation for execution on user approval', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      consensusSection.includes('$forge'),
      'Consensus mode should reference $forge invocation'
    );
  });

  it('should use MUST language for execution handoff', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      /MUST.*\$forge/s.test(consensusSection) || /\$forge.*MUST/s.test(consensusSection),
      'Consensus mode should use MUST language around $forge invocation'
    );
  });

  it('should prohibit direct implementation from the planning agent', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      /Do NOT implement directly/i.test(consensusSection),
      'Consensus mode should prohibit direct implementation'
    );
  });

  it('should not modify Interview Mode steps', () => {
    const interviewSection = extractSection(planSkill, 'Interview Mode');
    assert.ok(interviewSection, 'Interview Mode section should exist');
    assert.ok(interviewSection.includes('Classify the request'));
    assert.ok(interviewSection.includes('Ask one focused question'));
    assert.ok(interviewSection.includes('Gather codebase facts first'));
  });

  it('should not modify Direct Mode steps', () => {
    const directSection = extractSection(planSkill, 'Direct Mode');
    assert.ok(directSection, 'Direct Mode section should exist');
    assert.ok(directSection.includes('Quick Analysis'));
    assert.ok(directSection.includes('Create plan'));
  });

  it('should not modify Review Mode steps', () => {
    const reviewSection = extractSection(planSkill, 'Review Mode');
    assert.ok(reviewSection, 'Review Mode section should exist');
    assert.ok(reviewSection.includes('Read plan file'));
    assert.ok(reviewSection.includes('Evaluate via Critic'));
  });

  it('should reference $forge in Escalation section', () => {
    assert.ok(
      planSkill.includes('$forge'),
      'plan/SKILL.md should reference $forge for execution handoff'
    );
  });

  it('should require BLUEPRINT-DR structured deliberation in consensus mode', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(consensusSection.includes('BLUEPRINT-DR'), 'Should mention BLUEPRINT-DR');
    assert.ok(consensusSection.includes('**Principles** (3-5)'), 'Should require Principles');
    assert.ok(consensusSection.includes('**Decision Drivers** (top 3)'), 'Should require Decision Drivers');
    assert.ok(consensusSection.includes('**Viable Options** (>=2)'), 'Should require Viable Options');
    assert.ok(consensusSection.includes('**invalidation rationale**'), 'Should require invalidation rationale');
  });

  it('should require ADR fields in final consensus output', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(consensusSection.includes('ADR'), 'Should reference ADR');
    assert.ok(consensusSection.includes('**Decision**'), 'ADR should include Decision');
    assert.ok(consensusSection.includes('**Drivers**'), 'ADR should include Drivers');
    assert.ok(consensusSection.includes('**Alternatives considered**'), 'ADR should include Alternatives considered');
    assert.ok(consensusSection.includes('**Why chosen**'), 'ADR should include Why chosen');
    assert.ok(consensusSection.includes('**Consequences**'), 'ADR should include Consequences');
    assert.ok(consensusSection.includes('**Follow-ups**'), 'ADR should include Follow-ups');
  });

  it('should require available-agent-types roster and staffing guidance in handoff output', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.match(consensusSection, /available-agent-types roster/i);
    assert.match(consensusSection, /staffing guidance|role allocation/i);
    assert.match(consensusSection, /reasoning levels? by lane|suggested reasoning/i);
    assert.match(consensusSection, /rcs team|launch hint/i);
    assert.match(consensusSection, /team verification path/i);
  });

  it('should mention deliberate mode requirements in consensus mode', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(consensusSection.includes('**Deliberate**') || consensusSection.includes('deliberate mode'));
    assert.ok(consensusSection.includes('`--deliberate`') || consensusSection.includes('--deliberate'));
    assert.ok(consensusSection.includes('pre-mortem'));
    assert.ok(consensusSection.includes('expanded test plan'));
    assert.ok(consensusSection.includes('unit / integration / e2e / observability'));
  });
});

describe('User feedback step between Planner and Architect/Critic (plan/SKILL.md)', () => {
  it('should have a user feedback step after Planner and before Architect', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');

    const plannerIdx = consensusSection.indexOf('**Planner**');
    const feedbackIdx = consensusSection.indexOf('**User feedback**');
    const architectIdx = consensusSection.indexOf('**Architect**');

    assert.ok(plannerIdx > -1, 'Should have Planner step');
    assert.ok(feedbackIdx > -1, 'Should have User feedback step');
    assert.ok(architectIdx > -1, 'Should have Architect step');

    assert.ok(feedbackIdx > plannerIdx, 'User feedback should come after Planner');
    assert.ok(architectIdx > feedbackIdx, 'Architect should come after User feedback');
  });

  it('should mandate structured question UI for the user feedback step', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      /User feedback.*MUST.*structured question UI/s.test(consensusSection),
      'User feedback step should mandate structured question UI'
    );
  });

  it('should offer Proceed/Request changes/Skip review options in user feedback step', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(consensusSection.includes('Proceed to review'));
    assert.ok(consensusSection.includes('Request changes'));
    assert.ok(consensusSection.includes('Skip review'));
  });

  it('should place Critic after Architect in the consensus flow', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');

    const architectIdx = consensusSection.indexOf('**Architect**');
    const criticIdx = consensusSection.indexOf('**Critic**');

    assert.ok(architectIdx > -1, 'Should have Architect step');
    assert.ok(criticIdx > -1, 'Should have Critic step');
    assert.ok(criticIdx > architectIdx, 'Critic should come after Architect');
  });

  it('should require architect antithesis and critic rejection gates in consensus flow', () => {
    const consensusSection = extractSection(planSkill, 'Consensus Mode');
    assert.ok(consensusSection, 'Consensus Mode section should exist');
    assert.ok(
      consensusSection.includes('steelman counterargument (antithesis)') ||
      consensusSection.includes('steelman counterargument'),
      'Architect step should require steelman counterargument'
    );
    assert.ok(consensusSection.includes('tradeoff tension'), 'Should require tradeoff tension');
    assert.ok(
      /Critic.*MUST.*explicitly reject shallow alternatives/s.test(consensusSection) ||
      consensusSection.includes('Critic **MUST** explicitly reject shallow alternatives'),
      'Critic should explicitly reject shallow alternatives'
    );
    assert.ok(
      consensusSection.includes('driver contradictions') ||
      consensusSection.includes('driver contradiction'),
      'Should mention driver contradictions'
    );
    assert.ok(
      consensusSection.includes('weak verification'),
      'Should mention weak verification'
    );
  });
});



  it('should require adaptive step sizing instead of a fixed five-step template', () => {
    assert.match(planSkill, /adaptive step count|right-sized to task scope/i);
    assert.match(planSkill, /do not default to exactly five steps|not a fixed five-step template/i);
    assert.match(blueprintSkill, /do not default to exactly five steps/i);
  });

describe('BLUEPRINT-DR in blueprint/SKILL.md', () => {
  it('should contain BLUEPRINT-DR structured deliberation description', () => {
    assert.ok(
      blueprintSkill.includes('BLUEPRINT-DR'),
      'blueprint/SKILL.md should mention BLUEPRINT-DR'
    );
  });

  it('should document the --deliberate flag', () => {
    assert.ok(
      blueprintSkill.includes('--deliberate'),
      'blueprint/SKILL.md should document --deliberate flag'
    );
  });

  it('should contain Pre-Execution Gate section', () => {
    assert.ok(
      blueprintSkill.includes('Pre-Execution Gate'),
      'blueprint/SKILL.md should contain Pre-Execution Gate section'
    );
  });

  it('should document gate bypass prefixes force: and !', () => {
    assert.ok(
      blueprintSkill.includes('force:') && blueprintSkill.includes('! '),
      'blueprint/SKILL.md should document force: and ! bypass prefixes'
    );
  });

  it('should document sequential Architect then Critic execution', () => {
    assert.ok(
      /step[s]? 3 and 4 MUST run sequentially|Do NOT.*parallel/i.test(blueprintSkill) ||
      blueprintSkill.includes('await completion before step 4'),
      'blueprint/SKILL.md should require sequential Architect/Critic execution'
    );
  });

  it('should document ADR requirement', () => {
    assert.ok(
      blueprintSkill.includes('ADR'),
      'blueprint/SKILL.md should reference ADR requirement'
    );
  });

  it('should document roster-aware team and forge follow-up guidance', () => {
    assert.match(blueprintSkill, /available-agent-types roster/i);
    assert.match(blueprintSkill, /staffing guidance|role\/staffing allocation/i);
    assert.match(blueprintSkill, /reasoning levels? by lane|reasoning-by-lane/i);
    assert.match(blueprintSkill, /rcs team|launch hints?/i);
    assert.match(blueprintSkill, /team verification/i);
  });
});

describe('Architect prompt BLUEPRINT-DR sections', () => {
  it('should have steelman antithesis requirement', () => {
    assert.ok(
      architectPrompt.includes('antithesis') || architectPrompt.includes('steelman'),
      'architect.md should require steelman antithesis'
    );
  });

  it('should have tradeoff tension requirement', () => {
    assert.ok(
      architectPrompt.includes('tradeoff tension'),
      'architect.md should require tradeoff tension'
    );
  });

  it('should have synthesis requirement', () => {
    assert.ok(
      architectPrompt.includes('synthesis'),
      'architect.md should mention synthesis'
    );
  });

  it('should reference blueprint consensus reviews', () => {
    assert.ok(
      architectPrompt.includes('blueprint'),
      'architect.md should reference blueprint consensus reviews'
    );
  });
});

describe('Planner prompt follow-up staffing guidance', () => {
  it('should require roster-aware staffing guidance for team and forge handoff', () => {
    assert.match(plannerPrompt, /available-agent-types roster/i);
    assert.match(plannerPrompt, /team and forge follow-up paths/i);
    assert.match(plannerPrompt, /reasoning levels? by lane|suggested reasoning/i);
    assert.match(plannerPrompt, /launch hints?/i);
    assert.match(plannerPrompt, /team verification path/i);
  });
});

describe('Critic prompt BLUEPRINT-DR sections', () => {
  it('should have gate checks for blueprint reviews', () => {
    assert.ok(
      criticPrompt.includes('blueprint') && criticPrompt.includes('gate'),
      'critic.md should mention blueprint gate checks'
    );
  });

  it('should explicitly REJECT shallow alternatives', () => {
    assert.ok(
      /REJECT.*shallow alternatives/i.test(criticPrompt) ||
      criticPrompt.includes('REJECT shallow alternatives'),
      'critic.md should explicitly REJECT shallow alternatives'
    );
  });

  it('should enforce deliberate mode requirements', () => {
    assert.ok(
      criticPrompt.includes('deliberate') &&
      (criticPrompt.includes('pre-mortem') || criticPrompt.includes('expanded test plan')),
      'critic.md should enforce deliberate mode requirements'
    );
  });
});
