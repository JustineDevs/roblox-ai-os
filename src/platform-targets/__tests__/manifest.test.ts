import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { readPlatformTargetManifest } from '../reader.js';

describe('platform target manifest', () => {
  it('loads the concrete platform target lanes', () => {
    const manifest = readPlatformTargetManifest();
    const ids = manifest.targets.map((target) => target.id).sort();

    assert.deepEqual(ids, [
      'adapter-hermes',
      'adapter-openclaw',
      'claude-like',
      'codex-native',
      'codex-plugin',
      'cursor',
      'marketplace-bundle',
      'mcp-capable-ide',
    ]);
  });

  it('points every target at real repo-local source or artifact surfaces', () => {
    const root = process.cwd();
    const manifest = readPlatformTargetManifest(root);

    for (const target of manifest.targets) {
      for (const path of [...target.canonicalSources, ...target.deliveryArtifacts]) {
        const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
        assert.equal(
          existsSync(join(root, normalized)),
          true,
          `missing path for target ${target.id}: ${normalized}`,
        );
      }
    }
  });

  it('keeps delivery vs adapter lanes explicit', () => {
    const manifest = readPlatformTargetManifest();
    const byId = new Map(manifest.targets.map((target) => [target.id, target]));

    assert.equal(byId.get('codex-native')?.lane, 'delivery');
    assert.equal(byId.get('codex-plugin')?.lane, 'delivery');
    assert.equal(byId.get('claude-like')?.lane, 'delivery');
    assert.equal(byId.get('cursor')?.lane, 'delivery');
    assert.equal(byId.get('marketplace-bundle')?.lane, 'delivery');
    assert.equal(byId.get('mcp-capable-ide')?.lane, 'delivery');
    assert.equal(byId.get('adapter-openclaw')?.lane, 'adapter');
    assert.equal(byId.get('adapter-hermes')?.lane, 'adapter');
  });
});
