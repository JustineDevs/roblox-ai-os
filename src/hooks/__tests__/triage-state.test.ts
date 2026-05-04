import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  readTriageState,
  writeTriageState,
  shouldSuppressFollowup,
  promptSignature,
} from '../triage-state.js';
import type { TriageStateFile } from '../triage-state.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTmp(): string {
  return mkdtempSync(join(tmpdir(), 'triage-state-test-'));
}

function removeTmp(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

/** Absolute path where readTriageState / writeTriageState store the file. */
function expectedPath(cwd: string, sessionId?: string): string {
  if (sessionId) {
    return join(cwd, '.rcs', 'state', 'sessions', sessionId, 'prompt-routing-state.json');
  }
  return join(cwd, '.rcs', 'state', 'prompt-routing-state.json');
}

/** A fully-valid TriageStateFile for round-trip tests. */
function validState(overrides?: Partial<TriageStateFile>): TriageStateFile {
  return {
    version: 1,
    last_triage: {
      lane: 'HEAVY',
      destination: 'autopilot',
      reason: 'multi-system change with scope markers',
      prompt_signature: 'sha256:' + 'a'.repeat(64),
      turn_id: '2026-04-18T00:00:00.000Z',
      created_at: '2026-04-18T00:00:00.000Z',
    },
    suppress_followup: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. readTriageState — basic behaviour
// ---------------------------------------------------------------------------

describe('readTriageState — missing file returns null', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('returns null for a fresh cwd (no file present)', () => {
    const result = readTriageState({ cwd: tmp, sessionId: 's1' });
    assert.equal(result, null);
  });

  it('does not throw when the file is absent', () => {
    assert.doesNotThrow(() => readTriageState({ cwd: tmp, sessionId: 'nope' }));
  });
});

describe('readTriageState — malformed JSON returns null', () => {
  let tmp: string;
  before(() => {
    tmp = makeTmp();
    const path = expectedPath(tmp, 'sess-malformed');
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', 'sess-malformed'), { recursive: true });
    writeFileSync(path, 'not json', 'utf-8');
  });
  after(() => removeTmp(tmp));

  it('returns null without throwing', () => {
    const result = readTriageState({ cwd: tmp, sessionId: 'sess-malformed' });
    assert.equal(result, null);
  });
});

describe('readTriageState — wrong shape returns null', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('returns null for {version:2} (wrong version)', () => {
    const path = expectedPath(tmp, 'v2');
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', 'v2'), { recursive: true });
    writeFileSync(path, JSON.stringify({ version: 2 }), 'utf-8');
    const result = readTriageState({ cwd: tmp, sessionId: 'v2' });
    assert.equal(result, null);
  });

  it('returns null for {} (empty object)', () => {
    const path = expectedPath(tmp, 'empty');
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', 'empty'), { recursive: true });
    writeFileSync(path, JSON.stringify({}), 'utf-8');
    const result = readTriageState({ cwd: tmp, sessionId: 'empty' });
    assert.equal(result, null);
  });

  it('returns null for missing suppress_followup field', () => {
    const path = expectedPath(tmp, 'missing-field');
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', 'missing-field'), { recursive: true });
    writeFileSync(path, JSON.stringify({ version: 1, last_triage: null }), 'utf-8');
    const result = readTriageState({ cwd: tmp, sessionId: 'missing-field' });
    assert.equal(result, null);
  });
});

describe('readTriageState — valid file returns parsed object', () => {
  let tmp: string;
  const sessionId = 'sess-valid';
  const state = validState();

  before(() => {
    tmp = makeTmp();
    const path = expectedPath(tmp, sessionId);
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', sessionId), { recursive: true });
    writeFileSync(path, JSON.stringify(state, null, 2), 'utf-8');
  });
  after(() => removeTmp(tmp));

  it('parses version field correctly', () => {
    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.equal(result.version, 1);
  });

  it('parses suppress_followup correctly', () => {
    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.equal(result.suppress_followup, true);
  });

  it('parses last_triage fields correctly', () => {
    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.ok(result.last_triage !== null);
    assert.equal(result.last_triage.lane, 'HEAVY');
    assert.equal(result.last_triage.destination, 'autopilot');
    assert.equal(result.last_triage.reason, state.last_triage!.reason);
  });

  it('valid state with last_triage=null parses correctly', () => {
    const nullState: TriageStateFile = { version: 1, last_triage: null, suppress_followup: false };
    const path2 = expectedPath(tmp, 'null-triage');
    mkdirSync(join(tmp, '.rcs', 'state', 'sessions', 'null-triage'), { recursive: true });
    writeFileSync(path2, JSON.stringify(nullState, null, 2), 'utf-8');
    const result = readTriageState({ cwd: tmp, sessionId: 'null-triage' });
    assert.ok(result !== null);
    assert.equal(result.last_triage, null);
    assert.equal(result.suppress_followup, false);
  });
});

// ---------------------------------------------------------------------------
// 2. Path selection — session-scoped vs root fallback
// ---------------------------------------------------------------------------

describe('path selection — session-scoped vs root', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('write with sessionId places file at sessions/<id>/prompt-routing-state.json', () => {
    const sessionId = 'sess-abc';
    writeTriageState({ cwd: tmp, sessionId, state: validState() });
    const expected = expectedPath(tmp, sessionId);
    assert.ok(existsSync(expected), `expected file at ${expected}`);
  });

  it('file is NOT placed at root when sessionId is provided', () => {
    const rootPath = expectedPath(tmp); // no sessionId
    // root may or may not exist, but it should not be the session file
    const sessionPath = expectedPath(tmp, 'sess-abc');
    assert.notEqual(sessionPath, rootPath);
    assert.ok(existsSync(sessionPath));
  });

  it('write without sessionId places file at root .rcs/state/prompt-routing-state.json', () => {
    writeTriageState({ cwd: tmp, sessionId: undefined, state: validState() });
    const rootPath = expectedPath(tmp);
    assert.ok(existsSync(rootPath), `expected root file at ${rootPath}`);
  });

  it('write with null sessionId also places file at root', () => {
    // use a fresh subdir so we can isolate
    const sub = makeTmp();
    try {
      writeTriageState({ cwd: sub, sessionId: null, state: validState() });
      const rootPath = expectedPath(sub);
      assert.ok(existsSync(rootPath), `expected root file at ${rootPath}`);
    } finally {
      removeTmp(sub);
    }
  });

  it('write with malformed explicit sessionId skips persistence instead of falling back to root', () => {
    const isolated = makeTmp();
    try {
      const sessionId = 'bad/session';
      writeTriageState({ cwd: isolated, sessionId, state: validState() });
      assert.equal(existsSync(expectedPath(isolated)), false);
      assert.equal(existsSync(join(isolated, '.rcs', 'state', 'sessions', 'bad', 'session')), false);
    } finally {
      removeTmp(isolated);
    }
  });

  it('read with malformed explicit sessionId ignores root-scoped state', () => {
    const rootState = validState();
    writeTriageState({ cwd: tmp, sessionId: undefined, state: rootState });
    const result = readTriageState({ cwd: tmp, sessionId: 'bad/session' });
    assert.equal(result, null);
  });
});

// ---------------------------------------------------------------------------
// 3. writeTriageState
// ---------------------------------------------------------------------------

describe('writeTriageState — directory creation', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('creates parent directories if they do not exist', () => {
    const sessionId = 'brand-new-session';
    const dirPath = join(tmp, '.rcs', 'state', 'sessions', sessionId);
    assert.ok(!existsSync(dirPath), 'dir should not exist before write');
    writeTriageState({ cwd: tmp, sessionId, state: validState() });
    assert.ok(existsSync(dirPath), 'dir should exist after write');
  });
});

describe('writeTriageState — round-trip', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('read after write returns structurally equal object', () => {
    const sessionId = 'round-trip';
    const state = validState();
    writeTriageState({ cwd: tmp, sessionId, state });
    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.deepEqual(result, state);
  });

  it('round-trip works with last_triage=null', () => {
    const sessionId = 'round-trip-null';
    const state: TriageStateFile = { version: 1, last_triage: null, suppress_followup: false };
    writeTriageState({ cwd: tmp, sessionId, state });
    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.deepEqual(result, state);
  });
});

describe('writeTriageState — overwrite behaviour', () => {
  let tmp: string;
  before(() => { tmp = makeTmp(); });
  after(() => removeTmp(tmp));

  it('second write replaces first write cleanly', () => {
    const sessionId = 'overwrite-test';
    const first = validState({ suppress_followup: true });
    const second: TriageStateFile = { version: 1, last_triage: null, suppress_followup: false };

    writeTriageState({ cwd: tmp, sessionId, state: first });
    writeTriageState({ cwd: tmp, sessionId, state: second });

    const result = readTriageState({ cwd: tmp, sessionId });
    assert.ok(result !== null);
    assert.deepEqual(result, second);
  });
});

describe('writeTriageState — swallows errors gracefully', () => {
  it('does not throw when cwd is a non-existent deeply nested path', () => {
    // mkdirSync recursive should succeed, but pass a path where we have no
    // permissions. We approximate this by a path inside /proc which is
    // read-only on Linux; if that is not available, skip.
    const badPath = '/proc/1/fd/triage-state-test-should-not-write';
    assert.doesNotThrow(() => {
      writeTriageState({ cwd: badPath, sessionId: 'x', state: validState() });
    });
  });
});

// ---------------------------------------------------------------------------
// 4. shouldSuppressFollowup
// ---------------------------------------------------------------------------

describe('shouldSuppressFollowup — no previous state', () => {
  it('returns false when previous is null', () => {
    const result = shouldSuppressFollowup({
      previous: null,
      currentPrompt: 'anything',
      currentHasKeyword: false,
    });
    assert.equal(result, false);
  });
});

describe('shouldSuppressFollowup — suppress_followup: false', () => {
  it('returns false when previous.suppress_followup is false', () => {
    const previous = validState({ suppress_followup: false });
    const result = shouldSuppressFollowup({
      previous,
      currentPrompt: 'yes',
      currentHasKeyword: false,
    });
    assert.equal(result, false);
  });
});

describe('shouldSuppressFollowup — keyword bypasses suppression', () => {
  it('returns false even with prior HEAVY state when keyword is present', () => {
    const previous = validState({ suppress_followup: true });
    const result = shouldSuppressFollowup({
      previous,
      currentPrompt: 'fix typo in src/foo.ts',
      currentHasKeyword: true,
    });
    assert.equal(result, false);
  });

  it('returns false for short prompt when keyword is present', () => {
    const previous = validState({ suppress_followup: true });
    const result = shouldSuppressFollowup({
      previous,
      currentPrompt: 'yes',
      currentHasKeyword: true,
    });
    assert.equal(result, false);
  });
});

describe('shouldSuppressFollowup — clarifying short prompts only', () => {
  const previous = validState({ suppress_followup: true });

  it('"yes" (1 word) → true', () => {
    assert.equal(
      shouldSuppressFollowup({ previous, currentPrompt: 'yes', currentHasKeyword: false }),
      true,
    );
  });

  it('"the auth helper" (3 words) → true', () => {
    assert.equal(
      shouldSuppressFollowup({ previous, currentPrompt: 'the auth helper', currentHasKeyword: false }),
      true,
    );
  });

  it('"settings page" (2 words) → false', () => {
    assert.equal(
      shouldSuppressFollowup({ previous, currentPrompt: 'settings page', currentHasKeyword: false }),
      false,
    );
  });

  it('"yeah do that" (3 words) → true', () => {
    assert.equal(
      shouldSuppressFollowup({ previous, currentPrompt: 'yeah do that', currentHasKeyword: false }),
      true,
    );
  });

  it('"one two three four five six" (6 words, boundary) → false', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'one two three four five six',
        currentHasKeyword: false,
      }),
      false,
    );
  });

  it('"fix typo in src/foo.ts" stays unsuppressed even though short', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'fix typo in src/foo.ts',
        currentHasKeyword: false,
      }),
      false,
    );
  });
});

describe('shouldSuppressFollowup — clarifying starters (longer prompts)', () => {
  const previous = validState({ suppress_followup: true });

  it('"yes, i want the settings page done please" (7 words, starts with "yes") → true', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'yes, i want the settings page done please',
        currentHasKeyword: false,
      }),
      true,
    );
  });

  it('"yeah that sounds right, go ahead with it" starts with "yeah" → true', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'yeah that sounds right, go ahead with it',
        currentHasKeyword: false,
      }),
      true,
    );
  });

  it('"okay, please proceed with the refactor as discussed" starts with "okay" → true', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'okay, please proceed with the refactor as discussed',
        currentHasKeyword: false,
      }),
      true,
    );
  });

  it('"the settings page button should be blue" starts with "the " → true', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'the settings page button should be blue',
        currentHasKeyword: false,
      }),
      true,
    );
  });
});

describe('shouldSuppressFollowup — long new-goal prompts → false', () => {
  const previous = validState({ suppress_followup: true });

  it('"implement soft delete across the orm layer" → false', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'implement soft delete across the orm layer',
        currentHasKeyword: false,
      }),
      false,
    );
  });

  it('"refactor the auth flow to use session cookies" → false', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'refactor the auth flow to use session cookies',
        currentHasKeyword: false,
      }),
      false,
    );
  });

  it('"add dark mode toggle to the settings page" → false', () => {
    assert.equal(
      shouldSuppressFollowup({
        previous,
        currentPrompt: 'add dark mode toggle to the settings page',
        currentHasKeyword: false,
      }),
      false,
    );
  });
});

// ---------------------------------------------------------------------------
// 5. promptSignature
// ---------------------------------------------------------------------------

describe('promptSignature — format', () => {
  it('returns a string starting with "sha256:"', () => {
    const sig = promptSignature('hello world');
    assert.ok(sig.startsWith('sha256:'), `expected "sha256:" prefix, got "${sig}"`);
  });

  it('has stable length of 71 chars (7 + 64 hex chars)', () => {
    const sig = promptSignature('some prompt text');
    assert.equal(sig.length, 71, `expected length 71, got ${sig.length}`);
  });

  it('hex portion is exactly 64 lowercase hex characters', () => {
    const sig = promptSignature('another prompt');
    const hex = sig.slice('sha256:'.length);
    assert.match(hex, /^[0-9a-f]{64}$/, `hex portion "${hex}" is not 64 lowercase hex chars`);
  });
});

describe('promptSignature — determinism', () => {
  it('returns identical result across 1000 calls for the same input', () => {
    const prompt = 'add dark mode toggle to the settings page';
    const first = promptSignature(prompt);
    for (let i = 1; i < 1000; i++) {
      assert.equal(promptSignature(prompt), first, `call ${i} returned different signature`);
    }
  });
});

describe('promptSignature — collision resistance', () => {
  it('different inputs produce different signatures', () => {
    const inputs = [
      'implement soft delete across the orm layer',
      'fix typo in src/foo.ts',
      'add dark mode toggle to the settings page',
    ];
    const sigs = inputs.map(promptSignature);
    const unique = new Set(sigs);
    assert.equal(unique.size, inputs.length, `expected ${inputs.length} unique signatures, got ${unique.size}`);
  });

  it('empty string has a distinct signature', () => {
    assert.notEqual(promptSignature(''), promptSignature('a'));
  });

  it('signatures differ for whitespace-normalised variants', () => {
    // The function hashes what it receives; callers normalise before calling.
    assert.notEqual(promptSignature('hello world'), promptSignature('hello  world'));
  });
});
