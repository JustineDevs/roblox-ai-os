import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('LLM provider abstraction', () => {
  it('documents the provider-agnostic layer and ships a config template', () => {
    for (const path of [
      'docs/reference/llm-provider-abstraction.md',
      'templates/roblox/llm-provider-routing.json',
    ]) {
      assert.equal(existsSync(join(root, path)), true, `missing provider abstraction artifact: ${path}`);
    }

    const doc = read('docs/reference/llm-provider-abstraction.md');
    assert.match(doc, /interchangeable components/i);
    assert.match(doc, /provider-agnostic routing/i);
    assert.match(doc, /fallback chains/i);
    assert.match(doc, /OpenClaw is adjacent infrastructure/i);
    assert.match(doc, /src\/config\/models\.ts/i);
  });
});
