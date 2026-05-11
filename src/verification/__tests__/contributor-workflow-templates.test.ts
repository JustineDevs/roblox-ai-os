import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('contributor workflow templates', () => {
  it('uses official GitHub issue-template structure with strict fields', () => {
    for (const path of [
      '.github/ISSUE_TEMPLATE/bug_report.yml',
      '.github/ISSUE_TEMPLATE/feature_request.yml',
      '.github/ISSUE_TEMPLATE/config.yml',
      '.github/PULL_REQUEST_TEMPLATE.md',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing contributor workflow file: ${path}`);
    }

    const bug = read('.github/ISSUE_TEMPLATE/bug_report.yml');
    const feature = read('.github/ISSUE_TEMPLATE/feature_request.yml');
    const pr = read('.github/PULL_REQUEST_TEMPLATE.md');

    assert.match(bug, /type:\s+textarea/);
    assert.match(bug, /label:\s+Summary/);
    assert.match(bug, /label:\s+Affected area/);
    assert.match(bug, /label:\s+Pre-flight checks/);
    assert.match(feature, /label:\s+User problem/);
    assert.match(feature, /Roblox-first/i);
    assert.match(pr, /## Roblox-specific impact/);
    assert.match(pr, /## Docs \/ localization impact/);
    assert.match(pr, /locale domino effects/i);
  });

  it('tightens contributing guidance around docs drift and active Roblox-facing framing', () => {
    const contributing = read('CONTRIBUTING.md');
    assert.match(contributing, /locale domino effects/i);
    assert.match(contributing, /generic web\/enterprise framing/i);
    assert.match(contributing, /GitHub issue \/ PR templates/i);
  });
});
