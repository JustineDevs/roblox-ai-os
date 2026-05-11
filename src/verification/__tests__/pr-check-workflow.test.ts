import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('pr-check workflow', () => {
  it('keeps the lightweight PR checks and adds non-blocking dev-base guidance for main-based PRs', () => {
    const workflowPath = join(process.cwd(), '.github', 'workflows', 'pr-check.yml');
    assert.equal(existsSync(workflowPath), true, `missing workflow: ${workflowPath}`);

    const workflow = readFileSync(workflowPath, 'utf-8');
    assert.match(workflow, /name:\s*(?:RCS\s+)?PR Check/);
    assert.match(workflow, /pull_request_target:\s*\n\s*types:\s*\[opened, synchronize, reopened, edited\]/);
    assert.match(workflow, /size-label:[\s\S]*pull-requests:\s*write/);
    assert.match(workflow, /draft-check:/);

    const guidanceSection = workflow.match(/base-branch-guidance:[\s\S]*/)?.[0] ?? '';
    assert.match(guidanceSection, /base-branch-guidance:/);
    assert.match(guidanceSection, /name:\s*PR Base Guidance/);
    assert.match(guidanceSection, /if:\s*github\.event\.pull_request\.base\.ref == 'main'/);
    assert.match(guidanceSection, /permissions:\s*\{\}/);
    assert.match(guidanceSection, /::warning title=Retarget normal (?:RCS )?PRs to dev::/);
    assert.match(guidanceSection, /Normal contributions should target `dev`\./);
    assert.match(guidanceSection, /Maintainer-directed `main` PRs are still allowed\./);
    assert.match(guidanceSection, /GITHUB_STEP_SUMMARY/);
    assert.doesNotMatch(guidanceSection, /github\.rest\.(issues|pulls)\.(createComment|addLabels|removeLabel)/);
    assert.doesNotMatch(guidanceSection, /core\.setFailed/);
  });
});
