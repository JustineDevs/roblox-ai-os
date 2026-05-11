import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWorkflowTransitionMessage,
  buildWorkflowTransitionError,
  evaluateWorkflowTransition,
} from '../workflow-transition.js';

describe('workflow transition rules', () => {
  it('allows the approved overlap matrix and denies unsupported combinations', () => {
    const cases: Array<{
      current: string[];
      requested: 'team' | 'forge' | 'ultrawork' | 'autopilot' | 'autoresearch';
      allowed: boolean;
      resulting: string[];
    }> = [
      { current: [], requested: 'team', allowed: true, resulting: ['team'] },
      { current: ['team'], requested: 'forge', allowed: true, resulting: ['team', 'forge'] },
      { current: ['forge'], requested: 'team', allowed: true, resulting: ['forge', 'team'] },
      { current: ['team'], requested: 'ultrawork', allowed: true, resulting: ['team', 'ultrawork'] },
      { current: ['ultrawork'], requested: 'team', allowed: true, resulting: ['ultrawork', 'team'] },
      { current: ['forge'], requested: 'ultrawork', allowed: true, resulting: ['forge', 'ultrawork'] },
      { current: ['ultrawork'], requested: 'forge', allowed: true, resulting: ['ultrawork', 'forge'] },
      { current: ['autopilot'], requested: 'team', allowed: false, resulting: ['autopilot'] },
      { current: ['team'], requested: 'autopilot', allowed: false, resulting: ['team'] },
      { current: ['autoresearch'], requested: 'forge', allowed: false, resulting: ['autoresearch'] },
      { current: ['team', 'forge'], requested: 'ultrawork', allowed: true, resulting: ['team', 'forge', 'ultrawork'] },
      { current: ['team', 'ultrawork'], requested: 'forge', allowed: true, resulting: ['team', 'ultrawork', 'forge'] },
    ];

    for (const testCase of cases) {
      const decision = evaluateWorkflowTransition(testCase.current, testCase.requested);
      assert.equal(decision.allowed, testCase.allowed, `${testCase.current.join(',')} -> ${testCase.requested}`);
      assert.deepEqual(decision.resultingModes, testCase.resulting, `${testCase.current.join(',')} -> ${testCase.requested}`);
    }
  });

  it('builds actionable denial guidance that names both clearing paths', () => {
    const error = buildWorkflowTransitionError(['team'], 'autopilot', 'start');
    assert.match(error, /Cannot start autopilot: team is already active\./);
    assert.match(error, /Unsupported workflow overlap: team \+ autopilot\./);
    assert.match(error, /Current state is unchanged\./);
    assert.match(error, /Clear incompatible workflow state yourself via/);
    assert.match(error, /`rcs state clear --mode <mode>`/);
    assert.match(error, /`rcs_state\.\*` MCP tools/);
  });

  it('returns auto-complete decisions for allowlisted forward transitions', () => {
    const interviewToBlueprint = evaluateWorkflowTransition(['deep-interview'], 'blueprint');
    assert.equal(interviewToBlueprint.allowed, true);
    assert.equal(interviewToBlueprint.kind, 'auto-complete');
    assert.deepEqual(interviewToBlueprint.autoCompleteModes, ['deep-interview']);
    assert.deepEqual(interviewToBlueprint.resultingModes, ['blueprint']);
    assert.equal(interviewToBlueprint.transitionMessage, 'mode transiting: deep-interview -> blueprint');

    const interviewToAutoresearch = evaluateWorkflowTransition(['deep-interview'], 'autoresearch');
    assert.equal(interviewToAutoresearch.allowed, true);
    assert.equal(interviewToAutoresearch.kind, 'auto-complete');
    assert.deepEqual(interviewToAutoresearch.autoCompleteModes, ['deep-interview']);
    assert.deepEqual(interviewToAutoresearch.resultingModes, ['autoresearch']);
    assert.equal(interviewToAutoresearch.transitionMessage, 'mode transiting: deep-interview -> autoresearch');

    const blueprintToForge = evaluateWorkflowTransition(['blueprint', 'ultrawork'], 'forge');
    assert.equal(blueprintToForge.allowed, true);
    assert.equal(blueprintToForge.kind, 'auto-complete');
    assert.deepEqual(blueprintToForge.autoCompleteModes, ['blueprint']);
    assert.deepEqual(blueprintToForge.resultingModes, ['ultrawork', 'forge']);

    const blueprintToAutoresearch = evaluateWorkflowTransition(['blueprint'], 'autoresearch');
    assert.equal(blueprintToAutoresearch.allowed, true);
    assert.equal(blueprintToAutoresearch.kind, 'auto-complete');
    assert.deepEqual(blueprintToAutoresearch.autoCompleteModes, ['blueprint']);
    assert.deepEqual(blueprintToAutoresearch.resultingModes, ['autoresearch']);
  });

  it('builds rollback denial guidance for execution-to-planning transitions', () => {
    const error = buildWorkflowTransitionError(['forge'], 'blueprint', 'start');
    assert.match(error, /Execution-to-planning rollback auto-complete is not allowed\./);
    assert.match(error, /First clear current state first and retry if this action is intended\./);
    assert.match(error, /Clear incompatible workflow state yourself via/);
  });


  it('allows autopilot to return to blueprint for non-clean code-review cycles', () => {
    const decision = evaluateWorkflowTransition(['autopilot'], 'blueprint');
    assert.equal(decision.allowed, true);
    assert.equal(decision.kind, 'auto-complete');
    assert.deepEqual(decision.autoCompleteModes, ['autopilot']);
    assert.deepEqual(decision.resultingModes, ['blueprint']);
    assert.equal(decision.transitionMessage, 'mode transiting: autopilot -> blueprint');
  });

  it('formats transition audit messages', () => {
    assert.equal(
      buildWorkflowTransitionMessage('blueprint', 'forge'),
      'mode transiting: blueprint -> forge',
    );
  });
});
