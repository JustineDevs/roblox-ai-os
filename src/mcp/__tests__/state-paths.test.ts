import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve as resolvePath } from 'path';
import {
  getAllScopedStateDirs,
  getAllScopedStatePaths,
  getBaseStateDir,
  getAllSessionScopedStateDirs,
  getAllSessionScopedStatePaths,
  getReadScopedStateFilePaths,
  readCurrentSessionId,
  resolveWorkingDirectoryForState,
  getStateDir,
  getStateFilePath,
  getStatePath,
  validateStateFileName,
  validateStateModeSegment,
  validateSessionId,
} from '../state-paths.js';

describe('validateSessionId', () => {
  it('accepts undefined and valid ids', () => {
    assert.equal(validateSessionId(undefined), undefined);
    assert.equal(validateSessionId('abc_123-XYZ'), 'abc_123-XYZ');
  });

  it('rejects invalid ids', () => {
    assert.throws(() => validateSessionId(''), /session_id must match/);
    assert.throws(() => validateSessionId('bad/id'), /session_id must match/);
    assert.throws(() => validateSessionId(123), /session_id must be a string/);
  });
});

describe('validateStateModeSegment', () => {
  it('accepts safe mode names', () => {
    assert.equal(validateStateModeSegment('forge'), 'forge');
    assert.equal(validateStateModeSegment('ultraqa'), 'ultraqa');
  });

  it('rejects traversal and path separators', () => {
    assert.throws(() => validateStateModeSegment('../evil'), /must not contain "\.\."/);
    assert.throws(() => validateStateModeSegment('foo/bar'), /path separators/);
    assert.throws(() => validateStateModeSegment('foo\\bar'), /path separators/);
  });
});

describe('validateStateFileName', () => {
  it('accepts safe file names', () => {
    assert.equal(validateStateFileName('hud-state.json'), 'hud-state.json');
    assert.equal(validateStateFileName('session.json'), 'session.json');
  });

  it('rejects traversal and path separators', () => {
    assert.throws(() => validateStateFileName('../evil.json'), /must not contain "\.\."/);
    assert.throws(() => validateStateFileName('foo/bar.json'), /path separators/);
    assert.throws(() => validateStateFileName('foo\\bar.json'), /path separators/);
  });
});

describe('state paths', () => {
  it('resolveWorkingDirectoryForState defaults to process.cwd()', () => {
    assert.equal(resolveWorkingDirectoryForState(undefined), process.cwd());
    assert.equal(resolveWorkingDirectoryForState(''), process.cwd());
    assert.equal(resolveWorkingDirectoryForState('   '), process.cwd());
  });

  it('resolveWorkingDirectoryForState normalizes Windows path on WSL/Linux when mount exists', () => {
    const raw = 'D:\\SIYUAN\\external\\repo';
    if (process.platform === 'win32') {
      assert.equal(resolveWorkingDirectoryForState(raw), resolvePath(raw));
      return;
    }
    if (existsSync('/mnt/d')) {
      assert.equal(resolveWorkingDirectoryForState(raw), '/mnt/d/SIYUAN/external/repo');
    } else {
      assert.throws(() => resolveWorkingDirectoryForState(raw), /not available on this host/);
    }
  });

  it('resolveWorkingDirectoryForState returns absolute normalized paths', () => {
    assert.equal(resolveWorkingDirectoryForState('.'), process.cwd());
  });

  it('rejects NUL bytes in workingDirectory', () => {
    assert.throws(() => resolveWorkingDirectoryForState('bad\0path'), /NUL byte/);
  });

  it('enforces RCS_MCP_WORKDIR_ROOTS allowlist when configured', async () => {
    const allowedRoot = await mkdtemp(join(tmpdir(), 'rcs-allowed-root-'));
    const disallowedRoot = await mkdtemp(join(tmpdir(), 'rcs-disallowed-root-'));
    const prev = process.env.RCS_MCP_WORKDIR_ROOTS;
    process.env.RCS_MCP_WORKDIR_ROOTS = allowedRoot;
    try {
      assert.equal(
        resolveWorkingDirectoryForState(join(allowedRoot, 'nested')),
        join(allowedRoot, 'nested'),
      );
      assert.throws(
        () => resolveWorkingDirectoryForState(disallowedRoot),
        /outside allowed roots \(RCS_MCP_WORKDIR_ROOTS\)/,
      );
    } finally {
      if (typeof prev === 'string') process.env.RCS_MCP_WORKDIR_ROOTS = prev;
      else delete process.env.RCS_MCP_WORKDIR_ROOTS;
      await rm(allowedRoot, { recursive: true, force: true });
      await rm(disallowedRoot, { recursive: true, force: true });
    }
  });

  it('builds global state paths', () => {
    const base = getBaseStateDir('/repo');
    assert.equal(base, '/repo/.rcs/state');
    assert.equal(getStateDir('/repo'), '/repo/.rcs/state');
    assert.equal(getStatePath('team', '/repo'), '/repo/.rcs/state/team-state.json');
  });

  it('builds session state paths', () => {
    assert.equal(getStateDir('/repo', 'sess1'), '/repo/.rcs/state/sessions/sess1');
    assert.equal(
      getStatePath('forge', '/repo', 'sess1'),
      '/repo/.rcs/state/sessions/sess1/forge-state.json'
    );
    assert.equal(
      getStateFilePath('hud-state.json', '/repo', 'sess1'),
      '/repo/.rcs/state/sessions/sess1/hud-state.json'
    );
  });

  it('throws when mode contains traversal tokens', () => {
    assert.throws(() => getStatePath('../../etc/passwd', '/repo'), /must not contain "\.\."/);
  });

  it('enumerates global-only path', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const paths = await getAllScopedStatePaths('team', wd);
      assert.deepEqual(paths, [getStatePath('team', wd)]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('enumerates session-scoped paths', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const sessionsRoot = join(getBaseStateDir(wd), 'sessions');
      await mkdir(join(sessionsRoot, 'sess1'), { recursive: true });
      await mkdir(join(sessionsRoot, 'sess_2'), { recursive: true });

      const paths = await getAllSessionScopedStatePaths('team', wd);
      assert.deepEqual(paths.sort(), [
        getStatePath('team', wd, 'sess1'),
        getStatePath('team', wd, 'sess_2'),
      ].sort());
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('enumerates state directories across all scopes', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const sessionsRoot = join(getBaseStateDir(wd), 'sessions');
      await mkdir(join(sessionsRoot, 'sess1'), { recursive: true });
      await mkdir(join(sessionsRoot, 'bad.name'), { recursive: true });

      const sessionDirs = await getAllSessionScopedStateDirs(wd);
      assert.deepEqual(sessionDirs, [join(sessionsRoot, 'sess1')]);

      const dirs = await getAllScopedStateDirs(wd);
      assert.deepEqual(dirs, [getBaseStateDir(wd), join(sessionsRoot, 'sess1')]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('enumerates global and session-scoped paths together', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const sessionsRoot = join(getBaseStateDir(wd), 'sessions');
      await mkdir(join(sessionsRoot, 'sess1'), { recursive: true });
      await mkdir(join(sessionsRoot, 'sess2'), { recursive: true });

      const paths = await getAllScopedStatePaths('forge', wd);
      assert.deepEqual(paths.sort(), [
        getStatePath('forge', wd),
        getStatePath('forge', wd, 'sess1'),
        getStatePath('forge', wd, 'sess2'),
      ].sort());
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('ignores invalid session directory names', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const sessionsRoot = join(getBaseStateDir(wd), 'sessions');
      await mkdir(join(sessionsRoot, 'valid-session'), { recursive: true });
      await mkdir(join(sessionsRoot, 'bad.name'), { recursive: true });
      await mkdir(join(sessionsRoot, 'bad name'), { recursive: true });

      const paths = await getAllSessionScopedStatePaths('team', wd);
      assert.deepEqual(paths, [getStatePath('team', wd, 'valid-session')]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('reads session-sensitive runtime files from the current session without root fallback when requested', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    try {
      const stateDir = getBaseStateDir(wd);
      await mkdir(join(stateDir, 'sessions', 'sess-current'), { recursive: true });
      await mkdir(stateDir, { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({ session_id: 'sess-current' }));

      const paths = await getReadScopedStateFilePaths('hud-state.json', wd, undefined, {
        rootFallback: false,
      });
      assert.deepEqual(paths, [join(stateDir, 'sessions', 'sess-current', 'hud-state.json')]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('prefers RCS_SESSION_ID over stale session.json when resolving current session id', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-state-paths-'));
    const previousSessionId = process.env.RCS_SESSION_ID;
    try {
      const stateDir = getBaseStateDir(wd);
      await mkdir(stateDir, { recursive: true });
      await mkdir(join(stateDir, 'sessions', 'sess-env'), { recursive: true });
      await writeFile(join(stateDir, 'session.json'), JSON.stringify({
        session_id: 'sess-stale',
        cwd: join(wd, '..', 'other-worktree'),
      }));
      process.env.RCS_SESSION_ID = 'sess-env';

      assert.equal(await readCurrentSessionId(wd), 'sess-env');
    } finally {
      if (typeof previousSessionId === 'string') process.env.RCS_SESSION_ID = previousSessionId;
      else delete process.env.RCS_SESSION_ID;
      await rm(wd, { recursive: true, force: true });
    }
  });
});
