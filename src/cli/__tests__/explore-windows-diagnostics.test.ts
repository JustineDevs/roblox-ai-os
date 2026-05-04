import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertBuiltinExploreHarnessSupported,
  getBuiltinExploreHarnessUnsupportedReason,
} from '../explore.js';

describe('explore Windows built-in harness diagnostics', () => {
  it('reports the built-in harness as unsupported on Windows unless a custom override is set', () => {
    assert.match(
      getBuiltinExploreHarnessUnsupportedReason('win32', {} as NodeJS.ProcessEnv) || '',
      /not ready on Windows/i,
    );
    assert.equal(
      getBuiltinExploreHarnessUnsupportedReason('win32', { RCS_EXPLORE_BIN: 'custom-harness.exe' } as NodeJS.ProcessEnv),
      undefined,
    );
    assert.equal(getBuiltinExploreHarnessUnsupportedReason('linux', {} as NodeJS.ProcessEnv), undefined);
  });

  it('fails early with actionable guidance for the built-in harness on Windows', () => {
    assert.throws(
      () => assertBuiltinExploreHarnessSupported('win32', {} as NodeJS.ProcessEnv),
      /built-in explore harness is not ready on Windows/i,
    );
    assert.doesNotThrow(() => assertBuiltinExploreHarnessSupported('win32', {
      RCS_EXPLORE_BIN: 'custom-harness.exe',
    } as NodeJS.ProcessEnv));
  });
});
