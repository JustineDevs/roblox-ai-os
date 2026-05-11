import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('multi-agent compatibility architecture', () => {
  it('documents the actual registry/adapter/policy architecture used by RCS', () => {
    const docPath = join(
      root,
      'docs',
      'reference',
      'multi-agent-compatibility-architecture.md',
    );
    assert.equal(existsSync(docPath), true, `missing architecture doc: ${docPath}`);

    const doc = read('docs/reference/multi-agent-compatibility-architecture.md');
    assert.match(doc, /AGENT_DEFINITIONS/);
    assert.match(doc, /src\/agents\/definitions\.ts/);
    assert.match(doc, /src\/agents\/policy\.ts/);
    assert.match(doc, /src\/agents\/native-config\.ts/);
    assert.match(doc, /src\/adapt\/contracts\.ts/);
    assert.match(doc, /src\/adapt\/registry\.ts/);
    assert.match(doc, /Registry pattern/i);
    assert.match(doc, /Adapter pattern/i);
    assert.match(doc, /Strategy pattern/i);
    assert.match(doc, /Plugin-style architecture/i);
    assert.match(doc, /Canonical-boundary pattern/i);
    assert.match(doc, /no monolithic `src\/agents\.ts`/i);
    assert.match(doc, /no `\.agents\/skills` universal-directory \+ symlink installer/i);
  });

  it('keeps public docs linked to the architecture reference', () => {
    const readme = read('README.md');
    const docsIndex = read('docs/index.html');
    const agentsDoc = read('docs/agents.html');

    assert.match(readme, /Multi-agent compatibility architecture/i);
    assert.match(docsIndex, /multi-agent-compatibility-architecture\.md/i);
    assert.match(agentsDoc, /Compatibility Architecture/i);
  });
});
