import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  RcsQuestionError,
  runRcsQuestion,
  type RcsQuestionProcessRunner,
} from '../client.js';

function makeRunner(stdout: unknown, code = 0, stderr = ''): RcsQuestionProcessRunner {
  return async () => ({
    code,
    stdout: typeof stdout === 'string' ? stdout : JSON.stringify(stdout),
    stderr,
  });
}

describe('runRcsQuestion', () => {
  it('parses a successful blocking stdout payload', async () => {
    const result = await runRcsQuestion(
      {
        question: 'What next?',
        options: [{ label: 'Launch', value: 'launch' }],
        allow_other: true,
        source: 'deep-interview',
      },
      {
        cwd: '/repo',
        argv1: '/repo/dist/cli/rcs.js',
        runner: makeRunner({
          ok: true,
          question_id: 'q-1',
          session_id: 'sess-1',
          questions: [{
            id: 'q-1',
            question: 'What next?',
            options: [{ label: 'Launch', value: 'launch' }],
            allow_other: true,
            other_label: 'Other',
            type: 'single-answerable',
            multi_select: false,
          }],
          answers: [{
            question_id: 'q-1',
            index: 0,
            answer: {
              kind: 'option',
              value: 'launch',
              selected_labels: ['Launch'],
              selected_values: ['launch'],
            },
          }],
          prompt: {
            question: 'What next?',
            options: [{ label: 'Launch', value: 'launch' }],
            allow_other: true,
            other_label: 'Other',
            type: 'single-answerable',
            multi_select: false,
            source: 'deep-interview',
          },
          answer: {
            kind: 'option',
            value: 'launch',
            selected_labels: ['Launch'],
            selected_values: ['launch'],
          },
        }),
      },
    );

    assert.equal(result.ok, true);
    assert.equal(result.answers[0]?.answer.value, 'launch');
    assert.equal(result.answer?.value, 'launch');
    assert.equal(result.prompt?.source, 'deep-interview');
    assert.equal(result.prompt?.type, 'single-answerable');
  });

  it('throws explicit question errors from stdout payloads', async () => {
    await assert.rejects(
      runRcsQuestion(
        {
          question: 'What next?',
          options: [{ label: 'Launch', value: 'launch' }],
          allow_other: false,
        },
        {
          cwd: '/repo',
          argv1: '/repo/dist/cli/rcs.js',
          runner: makeRunner({
            ok: false,
            error: {
              code: 'team_blocked',
              message: 'rcs question is unavailable while this session owns active team mode.',
            },
          }, 1),
        },
      ),
      (error) => {
        assert.ok(error instanceof RcsQuestionError);
        assert.equal(error.code, 'team_blocked');
        assert.match(error.message, /team_blocked/);
        return true;
      },
    );
  });
});
