import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readTriageConfig, resetTriageConfigCache } from '../triage-config.js';

// ---------------------------------------------------------------------------
// Env save/restore helpers
// ---------------------------------------------------------------------------

let savedCodexHome: string | undefined;

before(() => {
  savedCodexHome = process.env.CODEX_HOME;
  // Ensure a clean cache before the suite starts
  resetTriageConfigCache();
});

after(() => {
  // Restore env and clear cache after the entire suite
  if (savedCodexHome === undefined) {
    delete process.env.CODEX_HOME;
  } else {
    process.env.CODEX_HOME = savedCodexHome;
  }
  resetTriageConfigCache();
});

// ---------------------------------------------------------------------------
// Per-test temp-dir scaffolding (used across all describe blocks)
// ---------------------------------------------------------------------------

let tmp: string;

function setupTmp(): void {
  tmp = mkdtempSync(join(tmpdir(), 'triage-config-test-'));
  process.env.CODEX_HOME = tmp;
  resetTriageConfigCache();
}

function teardownTmp(): void {
  rmSync(tmp, { recursive: true, force: true });
  resetTriageConfigCache();
}

function configPath(): string {
  return join(tmp, '.rcs-config.json');
}

function writeConfig(content: string): void {
  writeFileSync(configPath(), content, 'utf-8');
}

// ---------------------------------------------------------------------------
// Test 1: Missing config file → defaulted
// ---------------------------------------------------------------------------

describe('readTriageConfig — missing config file', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns defaulted result when .rcs-config.json does not exist', () => {
    const result = readTriageConfig();
    assert.deepEqual(result, {
      enabled: true,
      status: 'defaulted',
      source: 'default',
      path: configPath(),
    });
  });
});

// ---------------------------------------------------------------------------
// Test 2: Valid config with enabled: true
// ---------------------------------------------------------------------------

describe('readTriageConfig — valid config enabled: true', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns enabled result for {"promptRouting":{"triage":{"enabled":true}}}', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: true } } }));
    const result = readTriageConfig();
    assert.deepEqual(result, {
      enabled: true,
      status: 'enabled',
      source: 'file',
      path: configPath(),
    });
  });
});

// ---------------------------------------------------------------------------
// Test 3: Valid config with enabled: false
// ---------------------------------------------------------------------------

describe('readTriageConfig — valid config enabled: false', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns disabled result for {"promptRouting":{"triage":{"enabled":false}}}', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: false } } }));
    const result = readTriageConfig();
    assert.deepEqual(result, {
      enabled: false,
      status: 'disabled',
      source: 'file',
      path: configPath(),
    });
  });
});

// ---------------------------------------------------------------------------
// Test 4: Malformed JSON → invalid, fails closed
// ---------------------------------------------------------------------------

describe('readTriageConfig — malformed JSON', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns invalid/closed result for malformed JSON and does not throw', () => {
    writeConfig('this is not json');
    const result = readTriageConfig();
    assert.deepEqual(result, {
      enabled: false,
      status: 'invalid',
      source: 'invalid',
      path: configPath(),
    });
  });
});

// ---------------------------------------------------------------------------
// Test 5: Wrong shape
// ---------------------------------------------------------------------------

describe('readTriageConfig — wrong shape', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns invalid for root value that is an array (not an object)', () => {
    writeConfig('[]');
    const result = readTriageConfig();
    assert.equal(result.status, 'invalid');
    assert.equal(result.enabled, false);
  });

  it('returns defaulted for object missing promptRouting key', () => {
    resetTriageConfigCache();
    writeConfig(JSON.stringify({ unrelated: 123 }));
    const result = readTriageConfig();
    assert.equal(result.status, 'defaulted');
    assert.equal(result.enabled, true);
  });

  it('returns defaulted when promptRouting exists but triage key is omitted', () => {
    writeConfig(JSON.stringify({ promptRouting: {} }));
    const result = readTriageConfig();
    assert.equal(result.status, 'defaulted');
    assert.equal(result.enabled, true);
  });

  it('returns defaulted when triage exists but enabled is omitted', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: {} } }));
    const result = readTriageConfig();
    assert.equal(result.status, 'defaulted');
    assert.equal(result.enabled, true);
  });

  it('returns invalid when promptRouting is present but not an object', () => {
    writeConfig(JSON.stringify({ promptRouting: true }));
    const result = readTriageConfig();
    assert.equal(result.status, 'invalid');
    assert.equal(result.enabled, false);
  });

  it('returns invalid when triage is present but not an object', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: true } }));
    const result = readTriageConfig();
    assert.equal(result.status, 'invalid');
    assert.equal(result.enabled, false);
  });
});

// ---------------------------------------------------------------------------
// Test 6: Non-boolean enabled value → invalid
// ---------------------------------------------------------------------------

describe('readTriageConfig — non-boolean enabled value', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns invalid for {"promptRouting":{"triage":{"enabled":"yes"}}}', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: 'yes' } } }));
    const result = readTriageConfig();
    assert.equal(result.status, 'invalid');
    assert.equal(result.enabled, false);
  });
});

// ---------------------------------------------------------------------------
// Test 7: Cache behavior — second read returns same object without touching FS
// ---------------------------------------------------------------------------

describe('readTriageConfig — cache behavior (file-gone test)', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('returns cached result after config file is deleted, then defaulted after cache reset', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: true } } }));

    const result1 = readTriageConfig();
    assert.equal(result1.status, 'enabled');

    // Delete the file — cache should absorb this
    rmSync(configPath(), { force: true });

    const result2 = readTriageConfig();
    assert.deepEqual(result1, result2, 'second read should return cached value equal to first read');

    // After reset the missing file should produce defaulted
    resetTriageConfigCache();
    const result3 = readTriageConfig();
    assert.equal(result3.status, 'defaulted', 'after cache reset with missing file status should be "defaulted"');
    assert.equal(result3.enabled, true);
  });
});

// ---------------------------------------------------------------------------
// Test 8: resetTriageConfigCache actually clears
// ---------------------------------------------------------------------------

describe('readTriageConfig — resetTriageConfigCache clears stale result', () => {
  beforeEach(setupTmp);
  after(teardownTmp);

  it('stale cache persists until reset, then reflects updated file', () => {
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: true } } }));

    const before = readTriageConfig();
    assert.equal(before.status, 'enabled', 'initial read should be enabled');

    // Change file on disk — cache should hide this
    writeConfig(JSON.stringify({ promptRouting: { triage: { enabled: false } } }));

    const cached = readTriageConfig();
    assert.equal(cached.status, 'enabled', 'without reset, stale cache should still say enabled');

    // Reset and re-read — now reflects the updated file
    resetTriageConfigCache();
    const fresh = readTriageConfig();
    assert.equal(fresh.status, 'disabled', 'after reset, read should reflect updated file (disabled)');
    assert.equal(fresh.enabled, false);
  });
});
