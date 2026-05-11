import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const analyzeSkill = readFileSync(
  join(__dirname, '../../../skills/analyze/SKILL.md'),
  'utf-8',
);

describe('analyze skill contract', () => {
  it('keeps analyze read-only, question-aligned, and truth-telling', () => {
    assert.match(analyzeSkill, /read-only repository analysis/i);
    assert.match(analyzeSkill, /Analyze is \*\*read-only by contract\*\*/i);
    assert.match(analyzeSkill, /Do not edit files\./i);
    assert.match(analyzeSkill, /Do not turn the answer into an implementation plan\./i);
    assert.match(analyzeSkill, /Do not silently switch into execution work\./i);
    assert.match(analyzeSkill, /Do not overclaim certainty\./i);
    assert.match(analyzeSkill, /Do not invent facts that are not supported by repository evidence\./i);
    assert.match(analyzeSkill, /Do not use judgmental, normative, or speculative language that outruns the evidence\./i);
    assert.match(analyzeSkill, /Answer the user’s actual question first\./i);
    assert.match(analyzeSkill, /Start from the asked question, not a generic debugger template\./i);
    assert.match(analyzeSkill, /the goal is to explain what the codebase most likely says about the question/i);
  });

  it('distinguishes evidence from inference and forbids unsupported speculation', () => {
    assert.match(analyzeSkill, /Maintain an explicit \*\*evidence-vs-inference distinction\*\*/i);
    assert.match(analyzeSkill, /\*\*Evidence\*\* — directly supported by concrete repository artifacts/i);
    assert.match(analyzeSkill, /\*\*Inference\*\* — a reasoned conclusion drawn from evidence/i);
    assert.match(analyzeSkill, /\*\*Unknown\*\* — a question the current repository evidence does not resolve/i);
    assert.match(analyzeSkill, /Never present an inference as if it were direct evidence\./i);
    assert.match(analyzeSkill, /Never present a guess as if it were an inference\./i);
    assert.match(analyzeSkill, /Call out uncertainty explicitly when the codebase does not settle the question\./i);
    assert.match(analyzeSkill, /Unsupported speculation is not evidence\./i);
  });

  it('requires adaptive native-subagent parallelism and ranked, file-grounded synthesis', () => {
    assert.match(analyzeSkill, /Scale the depth to the request: for simple or obvious questions, reduce swarm intensity and answer directly after enough reading\./i);
    assert.match(analyzeSkill, /For broader questions, expand the search surface but keep the final answer tightly synthesized\./i);
    assert.match(analyzeSkill, /When parallelism helps, prefer \*\*native subagents by default\*\*/i);
    assert.match(analyzeSkill, /Keep parallel lanes bounded: each lane should answer a concrete sub-question or inspect a specific subsystem\./i);
    assert.match(analyzeSkill, /one lane for primary code path \/ contracts/i);
    assert.match(analyzeSkill, /one lane for config \/ workflow \/ generated surfaces/i);
    assert.match(analyzeSkill, /one lane for tests \/ docs \/ secondary corroboration/i);
    assert.match(analyzeSkill, /### Ranked synthesis/i);
    assert.match(analyzeSkill, /\| Rank \| Explanation \| Confidence \| Basis \|/i);
    assert.match(analyzeSkill, /### Evidence/i);
    assert.match(analyzeSkill, /path\/to\/file:line-line/i);
    assert.match(analyzeSkill, /explicit about confidence/i);
    assert.match(analyzeSkill, /concrete about file references/i);
  });
});
