import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listTrackedAgentSurfaces, loadSurface } from './prompt-guidance-test-helpers.js';

function expectPatterns(path: string, patterns: RegExp[]): void {
  const content = loadSurface(path);
  for (const pattern of patterns) {
    assert.match(content, pattern, `${path} missing required pattern: ${pattern}`);
  }
}

describe('explore + sparkshell guidance contract', () => {
  it('keeps AGENTS root and template aligned on conditional explore routing and opt-in sparkshell guidance', () => {
    const patterns = [
      /USE_RCS_EXPLORE_CMD/i,
      /SHOULD treat `rcs explore`|strongly prefer `rcs explore`/i,
      /--prompt/i,
      /shell-only, allowlisted, read-only path|shell-only allowlisted read-only path/i,
      /gracefully fall back to the normal path/i,
      /rcs sparkshell --tmux-pane/i,
      /explicit opt-?in/i,
      /When to use what/i,
    ];

    for (const surface of listTrackedAgentSurfaces()) {
      expectPatterns(surface, patterns);
    }
  });

  it('keeps explore surfaces explicit about richer-path fallback', () => {
    expectPatterns('prompts/explore.md', [
      /USE_RCS_EXPLORE_CMD/i,
      /preferred low-cost path/i,
      /continue on this richer normal path/i,
    ]);

    expectPatterns('prompts/explore-harness.md', [
      /simple read-only repository lookup tasks/i,
      /Prefer `rcs explore --prompt/i,
      /fall back to the richer normal path/i,
    ]);
  });

  it('keeps execution and planning surfaces conditional on explore routing', () => {
    for (const surface of [
      'prompts/planner.md',
      'prompts/executor.md',
      'prompts/sisyphus-lite.md',
      'skills/deep-interview/SKILL.md',
      'skills/plan/SKILL.md',
      'skills/blueprint/SKILL.md',
      'skills/team/SKILL.md',
    ]) {
      expectPatterns(surface, [
        /USE_RCS_EXPLORE_CMD/i,
        /prefer `rcs explore`|use `rcs explore` FIRST/i,
        /fall back normally|fallback normally|graceful fallback|richer normal explore path/i,
      ]);
    }
  });

  it('keeps sparkshell guidance explicit opt-in and preserves raw qa or tmux evidence', () => {
    expectPatterns('prompts/test-engineer.md', [
      /optional operator aid/i,
      /does not replace raw `tmux capture-pane` evidence/i,
      /explicit opt-?in/i,
    ]);

    expectPatterns('skills/team/SKILL.md', [
      /rcs sparkshell --tmux-pane/i,
      /explicit opt-?in/i,
      /raw `tmux capture-pane` evidence/i,
    ]);
  });
});
