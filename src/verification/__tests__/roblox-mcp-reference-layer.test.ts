import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('Roblox MCP reference layer', () => {
  it('documents the canonical Roblox external reference layer and ships the matching template inventory', () => {
    for (const path of [
      'docs/reference/roblox-mcp-reference-layer.md',
      'templates/roblox/reference-sources.md',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing reference-layer artifact: ${path}`);
    }

    const doc = read('docs/reference/roblox-mcp-reference-layer.md');
    const template = read('templates/roblox/reference-sources.md');

    for (const url of [
      'https://gitmcp.io/Roblox/creator-docs',
      'https://github.com/sentinelcore/roblox-skills',
      'https://github.com/retpirato/Roblox-Scripts',
      'https://github.com/Corecii/Devprod',
      'https://github.com/greedychipmunk/agent-skills/tree/main/roblox-game-developer',
      'https://github.com/omer-metin/skills-for-antigravity/tree/main/skills/roblox-development',
      'https://github.com/dig1t/skills',
      'https://huggingface.co/datasets/Roblox/luau_corpus',
      'https://huggingface.co/datasets/TorpedoSoftware/roblox-info-dump',
      'https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-v1.0',
      'https://huggingface.co/datasets/TorpedoSoftware/RobloxQA-OpenEnded-v1.0',
      'https://datasets-server.huggingface.co/splits?dataset=TorpedoSoftware%2FRoblox-Luau-Reasoning-v1.0',
      'https://datasets-server.huggingface.co/splits?dataset=jayras%2Froblox-luau-dataset',
      'https://huggingface.co/datasets/TorpedoSoftware/the-luau-stack',
    ]) {
      assert.match(doc, new RegExp(escapeRegex(url)));
      assert.match(template, new RegExp(escapeRegex(url)));
    }

    assert.match(doc, /Tier 4: Documentation-derived grounding and high-trust Luau datasets/i);
    assert.match(doc, /Tier 5: Roblox evaluation datasets/i);
    assert.match(doc, /Tier 6: Weak or optional corpus support/i);
  });

  it('wires the pre-action protocol and docs index to the Roblox MCP reference layer', () => {
    const protocol = read('docs/reference/roblox-pre-action-protocol.md');
    const index = read('docs/site/index.html');

    assert.match(protocol, /roblox-mcp-reference-layer\.md/i);
    assert.match(protocol, /reference-sources\.md/i);
    assert.match(index, /Roblox MCP Reference Layer/i);
  });
});
