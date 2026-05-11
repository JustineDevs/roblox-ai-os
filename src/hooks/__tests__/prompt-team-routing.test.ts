import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { listTrackedAgentSurfaces, loadSurface } from './prompt-guidance-test-helpers.js';

for (const surface of listTrackedAgentSurfaces()) {
  describe(`${surface} team-vs-non-team routing guardrails`, () => {
    it('selects a single orchestration lane before execution', () => {
      assert.match(loadSurface(surface), /Choose the lane before acting/i);
      assert.match(loadSurface(surface), /\$deep-interview/i);
      assert.match(loadSurface(surface), /\$blueprint|\$blueprint/i);
      assert.match(loadSurface(surface), /\$team/i);
      assert.match(loadSurface(surface), /Solo execute/i);
    });

    it('routes non-team implementation work to executor instead of worker', () => {
      assert.match(
        loadSurface(surface),
        /Outside active `team`\/`swarm` mode, use `executor`.*do not invoke `worker`/i,
      );
    });

    it('reserves worker for active team sessions', () => {
      assert.match(
        loadSurface(surface),
        /Reserve `worker` strictly for active `team`\/`swarm` sessions/i,
      );
      assert.match(
        loadSurface(surface),
        /`worker` is a team-runtime surface, not a general-purpose child role/i,
      );
    });

    it('splits leader and worker responsibilities plus stop-escalate rules', () => {
      const content = loadSurface(surface);
      assert.match(content, /Leader responsibilities/i);
      assert.match(content, /Worker responsibilities/i);
      assert.match(content, /Leader vs worker/i);
      assert.match(content, /Stop \/ escalate/i);
      assert.match(content, /Escalate from worker to leader/i);
    });

    it('keeps the orchestration output contract terse', () => {
      const content = loadSurface(surface);
      assert.match(content, /Output contract/i);
      assert.match(content, /Default update\/final shape/i);
      assert.match(content, /do not restate the full plan every turn/i);
    });
  });
}

describe('orchestration prompt contract docs', () => {
  it('documents mode-driven orchestration sharpness', () => {
    const contract = loadSurface('docs/contracts/prompt-guidance-contract.md');
    assert.match(contract, /Mode selection comes first/i);
    assert.match(contract, /Leader and worker responsibilities stay separate/i);
    assert.match(contract, /Output contract stays tight/i);
  });

  it('maps root guidance schema to mode selection and leader-worker split', () => {
    const schema = loadSurface('docs/reference/guidance-schema.md');
    assert.match(schema, /mode selection \+ delegation\/model-routing\/skills\/team sections \+ leader\/worker split/i);
    assert.match(schema, /choose one mode clearly/i);
  });
});
