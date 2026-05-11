import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('Roblox workspace standard', () => {
  it('pins the baseline Roblox Studio toolchain and source mapping artifacts', () => {
    for (const path of [
      'default.project.json',
      'wally.toml',
      'aftman.toml',
      'stylua.toml',
      'selene.toml',
      'docs/reference/roblox-workspace-standard.md',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing required workspace artifact: ${path}`);
    }

    const rojo = JSON.parse(read('default.project.json')) as { tree?: Record<string, unknown> };
    assert.match(JSON.stringify(rojo), /ReplicatedStorage/);
    assert.match(JSON.stringify(rojo), /ServerScriptService/);
    assert.match(JSON.stringify(rojo), /StarterGui/);
    assert.match(JSON.stringify(rojo), /StarterPlayer/);
    assert.match(JSON.stringify(rojo), /TestService/);

    const aftman = read('aftman.toml');
    assert.match(aftman, /rojo/i);
    assert.match(aftman, /wally/i);
    assert.match(aftman, /stylua/i);
    assert.match(aftman, /selene/i);
    assert.match(aftman, /lune/i);

    const stylua = read('stylua.toml');
    assert.match(stylua, /column_width/i);
    assert.match(stylua, /sort_requires/i);

    const selene = read('selene.toml');
    assert.match(selene, /std = "roblox"/);
  });

  it('defines a strict Luau workspace skeleton for shared, server, client, GUI, assets, and tests', () => {
    const requiredLuauFiles = [
      'src/roblox/ReplicatedFirst/Bootstrap.client.luau',
      'src/roblox/ReplicatedStorage/Shared/RemoteIds.luau',
      'src/roblox/ReplicatedStorage/Gui/DesignTokens.luau',
      'src/roblox/ReplicatedStorage/Assets/AssetManifest.luau',
      'src/roblox/ServerScriptService/Bootstrap.server.luau',
      'src/roblox/ServerStorage/GameConfig.luau',
      'src/roblox/StarterPlayer/StarterPlayerScripts/Bootstrap.client.luau',
      'src/roblox/StarterGui/HudRoot/HudController.client.luau',
      'src/roblox/TestService/WorkspaceSmoke.spec.luau',
    ];

    for (const path of requiredLuauFiles) {
      const content = read(path);
      assert.match(content, /^--!strict/m, `${path} should default to --!strict`);
    }

    assert.match(read('src/roblox/ReplicatedStorage/Gui/DesignTokens.luau'), /Color3\.fromRGB/);
    assert.match(read('src/roblox/StarterGui/HudRoot/HudController.client.luau'), /ScreenGui/);
    assert.match(read('src/roblox/TestService/WorkspaceSmoke.spec.luau'), /TradeRequest/);
  });

  it('defines a canonical Studio plugin source layout', () => {
    for (const path of [
      'src/studio-plugin/README.md',
      'src/studio-plugin/PluginMain.luau',
      'src/studio-plugin/Toolbar.luau',
      'src/studio-plugin/Widget.luau',
      'src/studio-plugin/Commands.luau',
      'src/studio-plugin/State.luau',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing plugin source artifact: ${path}`);
    }

    assert.match(read('src/studio-plugin/Toolbar.luau'), /CreateToolbar/);
    assert.match(read('src/studio-plugin/Widget.luau'), /DockWidgetPluginGui/);
    assert.match(read('src/studio-plugin/Commands.luau'), /CreateButton/);
  });

  it('documents the plain Studio-native GUI default instead of assuming a framework-first stack', () => {
    const doc = read('docs/reference/roblox-workspace-standard.md');
    assert.match(doc, /Do not assume Roact, ReactLua, or Fusion as the default stack/i);
    assert.match(doc, /ScreenGui/i);
    assert.match(doc, /src\/studio-plugin\//i);
  });
});
