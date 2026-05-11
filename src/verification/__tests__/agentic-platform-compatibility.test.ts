import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('agentic platform compatibility', () => {
  it('documents the canonical-source, delivery-lane, and adapter-lane model', () => {
    const docPath = join(
      root,
      'docs',
      'reference',
      'agentic-platform-compatibility.md',
    );
    assert.equal(existsSync(docPath), true, `missing platform compatibility doc: ${docPath}`);

    const doc = read('docs/reference/agentic-platform-compatibility.md');
    assert.match(doc, /canonical authoring surface/i);
    assert.match(doc, /Codex native setup lane/i);
    assert.match(doc, /Codex plugin \+ marketplace lane/i);
    assert.match(doc, /Adapter lane for external platforms/i);
    assert.match(doc, /OpenClaw/);
    assert.match(doc, /Hermes/);
    assert.match(doc, /Claude-like platform/i);
    assert.match(doc, /marketplace-oriented platform/i);
    assert.match(doc, /skills may be portable/i);
    assert.match(doc, /setup-owned native agents and runtime hooks are \*\*not\*\* automatically portable one-to-one/i);
    assert.match(doc, /src\/platform-targets\/manifest\.json/i);
    assert.match(doc, /codex-native/i);
    assert.match(doc, /codex-plugin/i);
    assert.match(doc, /claude-like/i);
    assert.match(doc, /marketplace-bundle/i);
    assert.match(doc, /adapter-openclaw/i);
    assert.match(doc, /adapter-hermes/i);
    assert.match(doc, /cursor/i);
    assert.match(doc, /mcp-capable-ide/i);
  });

  it('links the platform compatibility contract from active docs', () => {
    const docsIndex = read('docs/index.html');
    const agentsDoc = read('docs/agents.html');
    const pluginSsot = read('docs/plugin-bundle-ssot.md');

    assert.match(docsIndex, /agentic-platform-compatibility\.md/i);
    assert.match(agentsDoc, /Agentic Platform Compatibility/i);
    assert.match(pluginSsot, /agentic-platform-compatibility\.md/i);
  });
});
