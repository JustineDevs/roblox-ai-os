import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  addGeneratedAgentsMarker,
  hasRcsManagedAgentsSections,
  isRcsGeneratedAgentsMd,
  RCS_GENERATED_AGENTS_MARKER,
} from '../agents-md.js';

describe('agents-md helpers', () => {
  it('inserts the generated marker after the autonomy directive block', () => {
    const content = [
      '<!-- AUTONOMY DIRECTIVE — DO NOT REMOVE -->',
      'YOU ARE AN AUTONOMOUS CODING AGENT. EXECUTE TASKS TO COMPLETION WITHOUT ASKING FOR PERMISSION.',
      'DO NOT STOP TO ASK "SHOULD I PROCEED?" — PROCEED. DO NOT WAIT FOR CONFIRMATION ON OBVIOUS NEXT STEPS.',
      'IF BLOCKED, TRY AN ALTERNATIVE APPROACH. ONLY ASK WHEN TRULY AMBIGUOUS OR DESTRUCTIVE.',
      '<!-- END AUTONOMY DIRECTIVE -->',
      '# roblox-ai-os-creator-skills - Intelligent Multi-Agent Orchestration',
    ].join('\n');

    const result = addGeneratedAgentsMarker(content);

    assert.match(
      result,
      /<!-- END AUTONOMY DIRECTIVE -->\n<!-- rcs:generated:agents-md -->\n# roblox-ai-os-creator-skills - Intelligent Multi-Agent Orchestration/,
    );
  });

  it('does not duplicate an existing generated marker', () => {
    const content = `header\n${RCS_GENERATED_AGENTS_MARKER}\nbody\n`;
    assert.equal(addGeneratedAgentsMarker(content), content);
  });

  it('treats autonomy-directive generated files as RCS-managed once marked', () => {
    const content = [
      '<!-- AUTONOMY DIRECTIVE — DO NOT REMOVE -->',
      'directive body',
      '<!-- END AUTONOMY DIRECTIVE -->',
      RCS_GENERATED_AGENTS_MARKER,
      '# roblox-ai-os-creator-skills - Intelligent Multi-Agent Orchestration',
    ].join('\n');

    assert.equal(isRcsGeneratedAgentsMd(content), true);
  });

  it('does not treat title-only user AGENTS.md content as RCS-generated', () => {
    const content = [
      '# roblox-ai-os-creator-skills - Intelligent Multi-Agent Orchestration',
      '',
      'User-authored guidance without any RCS ownership markers.',
    ].join('\n');

    assert.equal(isRcsGeneratedAgentsMd(content), false);
    assert.equal(hasRcsManagedAgentsSections(content), false);
  });

  it('recognizes explicit RCS-owned model table blocks as managed sections', () => {
    const content = [
      '# Shared ownership AGENTS',
      '',
      '<!-- RCS:MODELS:START -->',
      'managed table',
      '<!-- RCS:MODELS:END -->',
    ].join('\n');

    assert.equal(isRcsGeneratedAgentsMd(content), false);
    assert.equal(hasRcsManagedAgentsSections(content), true);
  });
});
