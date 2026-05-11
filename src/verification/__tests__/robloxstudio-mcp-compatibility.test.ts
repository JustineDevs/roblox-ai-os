import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('robloxstudio-mcp compatibility standard', () => {
  it('documents the upstream compatibility lane and ships ready Codex config templates', () => {
    for (const path of [
      'docs/reference/robloxstudio-mcp-compatibility.md',
      'templates/roblox/robloxstudio-mcp.codex.json',
      'templates/roblox/robloxstudio-mcp.windows.json',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing compatibility artifact: ${path}`);
    }

    const doc = read('docs/reference/robloxstudio-mcp-compatibility.md');
    assert.match(doc, /github\.com\/boshyxd\/robloxstudio-mcp/i);
    assert.match(doc, /\brobloxstudio-mcp\b/);
    assert.match(doc, /\brobloxstudio-mcp-inspector\b/);
    assert.match(doc, /codex mcp add robloxstudio/i);
    assert.match(doc, /codex mcp add robloxstudio-inspector/i);
    assert.match(doc, /Allow HTTP Requests/i);
    assert.match(doc, /does \*\*not\*\* auto-install or silently auto-enable/i);
  });

  it('surfaces the compatibility lane from active docs and workspace standards', () => {
    assert.match(read('docs/site/index.html'), /robloxstudio-mcp Compatibility/i);
    assert.match(read('docs/site/integrations.html'), /robloxstudio-mcp live Studio compatibility/i);
    assert.match(read('docs/site/getting-started.html'), /Optional Live Studio Connection/i);
    assert.match(read('docs/reference/roblox-workspace-standard.md'), /robloxstudio-mcp-compatibility\.md/i);
  });

  it('keeps the shipped Codex templates aligned with the upstream package names', () => {
    const defaultTemplate = JSON.parse(read('templates/roblox/robloxstudio-mcp.codex.json')) as {
      mcpServers?: Record<string, { command?: string; args?: string[] }>;
    };
    const windowsTemplate = JSON.parse(read('templates/roblox/robloxstudio-mcp.windows.json')) as {
      mcpServers?: Record<string, { command?: string; args?: string[] }>;
    };

    assert.equal(defaultTemplate.mcpServers?.robloxstudio?.command, 'npx');
    assert.equal(defaultTemplate.mcpServers?.['robloxstudio-inspector']?.command, 'npx');
    assert.ok(defaultTemplate.mcpServers?.robloxstudio?.args?.includes('robloxstudio-mcp@latest'));
    assert.ok(defaultTemplate.mcpServers?.['robloxstudio-inspector']?.args?.includes('robloxstudio-mcp-inspector@latest'));

    assert.equal(windowsTemplate.mcpServers?.robloxstudio?.command, 'cmd');
    assert.equal(windowsTemplate.mcpServers?.['robloxstudio-inspector']?.command, 'cmd');
    assert.ok(windowsTemplate.mcpServers?.robloxstudio?.args?.includes('robloxstudio-mcp@latest'));
    assert.ok(windowsTemplate.mcpServers?.['robloxstudio-inspector']?.args?.includes('robloxstudio-mcp-inspector@latest'));
  });
});
