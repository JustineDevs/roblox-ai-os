import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  assessAutoresearchCompletionState,
  normalizeAutoresearchValidationMode,
} from '../skill-validation.js';

describe('autoresearch skill validation', () => {
  it('normalizes the supported validation modes', () => {
    assert.equal(normalizeAutoresearchValidationMode('mission-validator-script'), 'mission-validator-script');
    assert.equal(normalizeAutoresearchValidationMode('prompt-architect-artifact'), 'prompt-architect-artifact');
    assert.equal(normalizeAutoresearchValidationMode('unknown-mode'), null);
  });

  it('treats missing validation mode as incomplete', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-skill-validation-'));
    try {
      const result = await assessAutoresearchCompletionState({ active: true }, cwd);
      assert.equal(result.complete, false);
      assert.equal(result.reason, 'missing_validation_mode');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('requires a validator pass artifact for mission-validator-script mode', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-validator-script-'));
    try {
      const artifactPath = join(cwd, '.rcs', 'specs', 'autoresearch-demo', 'completion.json');
      await mkdir(join(cwd, '.rcs', 'specs', 'autoresearch-demo'), { recursive: true });
      await writeFile(artifactPath, JSON.stringify({ status: 'running' }, null, 2));

      const incomplete = await assessAutoresearchCompletionState({
        active: true,
        validation_mode: 'mission-validator-script',
        mission_validator_command: 'node scripts/validate.js',
        completion_artifact_path: artifactPath,
      }, cwd);
      assert.equal(incomplete.complete, false);
      assert.equal(incomplete.reason, 'validator_not_passed');

      await writeFile(artifactPath, JSON.stringify({ status: 'passed', passed: true }, null, 2));
      const complete = await assessAutoresearchCompletionState({
        active: true,
        validation_mode: 'mission-validator-script',
        mission_validator_command: 'node scripts/validate.js',
        completion_artifact_path: artifactPath,
      }, cwd);
      assert.equal(complete.complete, true);
      assert.equal(complete.reason, 'validator_passed');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('requires prompt, architect approval, and output artifact for prompt-architect-artifact mode', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-architect-validation-'));
    try {
      const artifactDir = join(cwd, '.rcs', 'specs', 'autoresearch-demo');
      const completionPath = join(artifactDir, 'completion.json');
      const outputPath = join(artifactDir, 'report.md');
      await mkdir(artifactDir, { recursive: true });
      await writeFile(outputPath, '# Report\n', 'utf-8');
      await writeFile(completionPath, JSON.stringify({
        architect_review: { verdict: 'reject' },
        output_artifact_path: outputPath,
      }, null, 2));

      const rejected = await assessAutoresearchCompletionState({
        active: true,
        validation_mode: 'prompt-architect-artifact',
        validator_prompt: 'Review the research output.',
        completion_artifact_path: completionPath,
      }, cwd);
      assert.equal(rejected.complete, false);
      assert.equal(rejected.reason, 'missing_architect_approval');

      await writeFile(completionPath, JSON.stringify({
        validator_prompt: 'Review the research output.',
        architect_review: { verdict: 'approved' },
        output_artifact_path: outputPath,
      }, null, 2));
      const approved = await assessAutoresearchCompletionState({
        active: true,
        validation_mode: 'prompt-architect-artifact',
        validator_prompt: 'Review the research output.',
        completion_artifact_path: completionPath,
      }, cwd);
      assert.equal(approved.complete, true);
      assert.equal(approved.reason, 'architect_approved');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
