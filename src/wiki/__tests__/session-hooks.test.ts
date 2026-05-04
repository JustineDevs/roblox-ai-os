/**
 * Tests for Wiki lifecycle hooks
 */

import { afterEach, beforeEach, describe, it } from 'node:test';
import { expect } from './test-helpers.js';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { ensureWikiDir } from '../storage.js';
import { onSessionEnd } from '../lifecycle.js';

describe('Wiki lifecycle hooks', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'wiki-session-hooks-'));
  });

  afterEach(async () => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  it('respects autoCapture=false from project .rcs-config.json', () => {
    fs.writeFileSync(
      path.join(tempDir, '.rcs-config.json'),
      JSON.stringify({ wiki: { autoCapture: false } }),
    );

    const wikiDir = ensureWikiDir(tempDir);

    expect(onSessionEnd({ cwd: tempDir, session_id: 'session-12345678' })).toEqual({ continue: true });

    const wikiEntries = fs.readdirSync(wikiDir);
    expect(wikiEntries.filter((entry: string) => entry.startsWith('session-log-'))).toHaveLength(0);
    expect(fs.existsSync(path.join(wikiDir, 'log.md'))).toBe(false);
  });

  it('refreshes the wiki index after session-end capture', () => {
    const wikiDir = ensureWikiDir(tempDir);

    expect(onSessionEnd({ cwd: tempDir, session_id: 'session-abcdefgh' })).toEqual({ continue: true });

    const indexPath = path.join(wikiDir, 'index.md');
    expect(fs.existsSync(indexPath)).toBe(true);
    expect(fs.readFileSync(indexPath, 'utf-8')).toContain('session-log');
  });
});
