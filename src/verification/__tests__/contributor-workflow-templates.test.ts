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
      '.github/labels.yml',
      '.github/workflows/sync-labels.yml',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing contributor workflow file: ${path}`);
    }

    const bug = read('.github/ISSUE_TEMPLATE/bug_report.yml');
    const feature = read('.github/ISSUE_TEMPLATE/feature_request.yml');
    const config = read('.github/ISSUE_TEMPLATE/config.yml');
    const pr = read('.github/PULL_REQUEST_TEMPLATE.md');
    const labels = read('.github/labels.yml');
    const syncLabelsWorkflow = read('.github/workflows/sync-labels.yml');

    assert.match(bug, /type:\s+textarea/);
    assert.match(bug, /label:\s+Summary/);
    assert.match(bug, /label:\s+Affected area/);
    assert.match(bug, /label:\s+Pre-flight checks/);
    assert.match(bug, /docs\/wiki/i);
    assert.match(feature, /label:\s+User problem/);
    assert.match(feature, /Roblox-first/i);
    assert.match(feature, /roadmap\/wiki/i);
    assert.match(config, /Contributor wiki/);
    assert.match(config, /Roadmap/);
    assert.match(pr, /## Roblox-specific impact/);
    assert.match(pr, /## Docs \/ localization impact/);
    assert.match(pr, /locale domino effects/i);
    assert.match(pr, /Contributor wiki \/ roadmap pages/i);
    assert.match(labels, /name:\s+good first issue/);
    assert.match(labels, /name:\s+help wanted/);
    assert.match(labels, /name:\s+contributor experience/);
    assert.match(syncLabelsWorkflow, /name:\s+Sync Labels/);
    assert.match(syncLabelsWorkflow, /crazy-max\/ghaction-github-labeler@v5/);
  });

  it('tightens contributing guidance around docs drift and active Roblox-facing framing', () => {
    const contributing = read('CONTRIBUTING.md');
    assert.match(contributing, /locale domino effects/i);
    assert.match(contributing, /generic web\/enterprise framing/i);
    assert.match(contributing, /GitHub issue \/ PR templates/i);
    assert.match(contributing, /Contributor wiki/i);
    assert.match(contributing, /good first issue/i);
  });

  it('keeps contributor wiki and roadmap surfaces linked from public docs', () => {
    for (const path of [
      'docs/wiki/Home.md',
      'docs/wiki/Contributing.md',
      'docs/wiki/Good-First-Issues.md',
      'docs/wiki/ROADMAP.md',
      'docs/wiki/Release-Playbook.md',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing contributor wiki file: ${path}`);
    }

    const readme = read('README.md');
    const docsIndex = read('docs/site/index.html');
    const wikiHome = read('docs/wiki/Home.md');
    const roadmap = read('docs/wiki/ROADMAP.md');

    assert.match(readme, /Contributor wiki/i);
    assert.match(readme, /Good first issues and labels/i);
    assert.match(docsIndex, /Community and Contributors/);
    assert.match(docsIndex, /\.\.\/wiki\/Home\.md/);
    assert.match(docsIndex, /\.\.\/wiki\/ROADMAP\.md/);
    assert.match(wikiHome, /This is the contributor-facing wiki source/i);
    assert.match(roadmap, /canonical versioned product roadmap/i);
    assert.match(roadmap, /`0\.2\.0`/);
    assert.match(roadmap, /Patch Assistant/i);
    assert.match(roadmap, /Roblox Monetization Planner/i);
    assert.match(roadmap, /Audience and Retention Planner/i);
    assert.match(roadmap, /`1\.0\.0`/);
  });
});
