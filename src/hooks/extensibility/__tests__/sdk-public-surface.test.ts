import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { createHookPluginSdk } from '../sdk.js';
import type { HookEventEnvelope, HookPluginSdk } from '../types.js';

type AssertFalse<T extends false> = T;
type HasPluginStateAlias = HookPluginSdk extends { pluginState: unknown } ? true : false;
const _assertNoPluginStateAlias: AssertFalse<HasPluginStateAlias> = false;

function makeEvent(event = 'session-start'): HookEventEnvelope {
  return {
    schema_version: '1',
    event,
    timestamp: '2026-01-01T00:00:00.000Z',
    source: 'native',
    context: {},
  };
}

describe('HookPluginSdk public surface', () => {
  it('does not expose a pluginState alias at runtime', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-sdk-surface-'));
    try {
      const sdk = createHookPluginSdk({ cwd, pluginName: 'test', event: makeEvent() });
      assert.equal('state' in sdk, true);
      assert.equal('pluginState' in sdk, false);
      assert.equal(Object.prototype.hasOwnProperty.call(sdk, 'pluginState'), false);
      assert.equal(Reflect.get(sdk, 'pluginState'), undefined);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
