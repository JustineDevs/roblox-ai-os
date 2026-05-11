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
    ]) {
      assert.match(doc, new RegExp(escapeRegex(url)));
      assert.match(template, new RegExp(escapeRegex(url)));
    }
  });

  it('wires the pre-action protocol and docs index to the Roblox MCP reference layer', () => {
    const protocol = read('docs/reference/roblox-pre-action-protocol.md');
    const index = read('docs/index.html');

    assert.match(protocol, /roblox-mcp-reference-layer\.md/i);
    assert.match(protocol, /reference-sources\.md/i);
    assert.match(index, /Roblox MCP Reference Layer/i);
  });
});
