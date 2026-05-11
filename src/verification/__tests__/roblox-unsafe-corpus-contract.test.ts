import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('Roblox unsafe corpus contract', () => {
  it('keeps the unsafe Roblox script corpus quarantined under a security-only path', () => {
    const corpusRoot = join(root, 'corpora', 'security', 'roblox-unsafe-script-corpus');
    assert.equal(existsSync(corpusRoot), true, `missing unsafe corpus root: ${corpusRoot}`);
    assert.equal(
      existsSync(join(root, 'templates', 'roblox-scripts')),
      false,
      'unsafe corpus should not remain under templates/',
    );
  });

  it('documents the corpus as security-only anti-pattern material, not implementation guidance', () => {
    const doc = read('docs/security/roblox-unsafe-script-corpus.md');
    const forge = read('skills/forge/SKILL.md');
    const pluginForge = read('plugins/roblox-ai-os-creator-skills/skills/forge/SKILL.md');

    assert.match(doc, /security-only corpus/i);
    assert.match(doc, /Do \*\*not\*\* copy from this corpus into shipped code/i);
    assert.match(forge, /security-only anti-pattern lane/i);
    assert.match(pluginForge, /security-only anti-pattern lane/i);
  });

  it('keeps Roblox reference docs from presenting the unsafe corpus as normal implementation guidance', () => {
    const protocol = read('docs/reference/roblox-pre-action-protocol.md');
    const layer = read('docs/reference/roblox-mcp-reference-layer.md');
    const sources = read('templates/roblox/reference-sources.md');

    assert.match(protocol, /Priority 3: security-only anti-pattern corpora/i);
    assert.match(layer, /Tier 3: Security-only anti-pattern corpora/i);
    assert.match(sources, /Security-only anti-pattern corpora/i);
    assert.match(protocol, /anti-pattern detection and threat awareness only/i);
    assert.match(layer, /must not be used as direct implementation templates|anti-pattern material only/i);
  });
});
