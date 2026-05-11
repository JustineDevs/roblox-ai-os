import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { delimiter, dirname, isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

interface CompatRunResult {
  status: number | null;
  stdout: string;
  stderr: string;
  error?: string;
}

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, '..', '..', '..');
const defaultTarget = join(repoRoot, 'dist', 'cli', 'rcs.js');
const fixturesRoot = join(repoRoot, 'src', 'compat', 'fixtures', 'doctor');

function readFixture(name: string): string {
  return readFileSync(join(fixturesRoot, name), 'utf-8');
}

function shouldSkipForSpawnPermissions(err?: string): boolean {
  return typeof err === 'string' && /(EPERM|EACCES)/i.test(err);
}

function resolveCompatTarget(): { command: string; argsPrefix: string[] } {
  const override = process.env.RCS_COMPAT_TARGET?.trim();
  const targetPath = override
    ? (isAbsolute(override) ? override : resolve(process.cwd(), override))
    : defaultTarget;

  if (targetPath.endsWith('.js')) {
    return { command: process.execPath, argsPrefix: [targetPath] };
  }

  return { command: targetPath, argsPrefix: [] };
}

function runCompatTarget(cwd: string, argv: string[], envOverrides: Record<string, string> = {}): CompatRunResult {
  const target = resolveCompatTarget();
  const result = spawnSync(target.command, [...target.argsPrefix, ...argv], {
    cwd,
    encoding: 'utf-8',
    env: { ...process.env, ...envOverrides },
  });
  return { status: result.status, stdout: result.stdout || '', stderr: result.stderr || '', error: result.error?.message };
}

function normalizeInstallDoctorOutput(text: string, home: string, cwd: string): string {
  const repoStateDir = join(cwd, '.rcs', 'state').replace(/\\/g, '/');
  let normalized = text
    .replaceAll(join(home, '.codex').replace(/\\/g, '/'), '<CODEX_HOME>')
    .replaceAll(`/private${repoStateDir}`, '<REPO_STATE_DIR>')
    .replaceAll(repoStateDir, '<REPO_STATE_DIR>')
    .replace(/\\/g, '/');
  // Windows may print 8.3 short paths so replaceAll(longPath) misses; normalize known lines.
  normalized = normalized.replace(
    /^  \[OK\] Codex home: .+$/gm,
    '  [OK] Codex home: <CODEX_HOME>',
  );
  normalized = normalized.replace(
    /^  \[!!\] AGENTS\.md: not found in .+\/AGENTS\.md \(run rcs setup --scope user\)$/gm,
    '  [!!] AGENTS.md: not found in <CODEX_HOME>/AGENTS.md (run rcs setup --scope user)',
  );
  normalized = normalized.replace(
    /^  \[!!\] State dir: .+ \(not created yet\)$/gm,
    '  [!!] State dir: <REPO_STATE_DIR> (not created yet)',
  );
  return normalized
    .split('\n')
    .map((line) => {
      if (line.startsWith('  [OK] Codex CLI:') || line.startsWith('  [XX] Codex CLI:')) {
        return '  [CODEX_CLI_STATUS]';
      }
      if (line.startsWith('  [OK] Node.js:')) {
        return '  [OK] Node.js: <NODE_VERSION>';
      }
      if (line.startsWith('  [OK] Explore Harness:') || line.startsWith('  [!!] Explore Harness:')) {
        return '  [EXPLORE_HARNESS_STATUS]';
      }
      if (line.startsWith('Results: ')) {
        return 'Results: <RESULTS>';
      }
      if (line.startsWith('Run "rcs setup')) {
        return 'Run <SETUP_FOLLOWUP>';
      }
      if (/^\s+\[(OK|!!)\] Legacy skill roots:/.test(line)) {
        return '  [LEGACY_SKILLS_STATUS]';
      }
      return line;
    })
    .join('\n');
}

describe('compat doctor contract', () => {
  it('matches onboarding warning copy for first setup expectations', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-compat-doctor-'));
    const home = join(wd, 'home');
    const codexHome = join(home, '.codex');
    await mkdir(codexHome, { recursive: true });
    await writeFile(join(codexHome, 'config.toml'), '[mcp_servers.non_rcs]\ncommand = "node"\n');

    try {
      const result = runCompatTarget(wd, ['doctor'], { HOME: home, CODEX_HOME: codexHome });
      if (shouldSkipForSpawnPermissions(result.error)) return;
      assert.equal(result.status, Number.parseInt(readFixture('install-onboarding.exitcode.txt').trim(), 10), result.stderr || result.stdout);
      assert.equal(result.stderr, '');
      assert.equal(normalizeInstallDoctorOutput(result.stdout, home, wd), readFixture('install-onboarding.stdout.txt'));
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('matches doctor --team resume_blocker behavior', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-compat-doctor-team-'));
    try {
      const teamRoot = join(wd, '.rcs', 'state', 'team', 'alpha');
      await mkdir(join(teamRoot, 'workers', 'worker-1'), { recursive: true });
      await writeFile(join(teamRoot, 'config.json'), JSON.stringify({ name: 'alpha', tmux_session: 'rcs-team-alpha' }));
      const fakeBin = join(wd, 'bin');
      await mkdir(fakeBin, { recursive: true });
      if (process.platform === 'win32') {
        const tmuxCmd = join(fakeBin, 'tmux.cmd');
        await writeFile(tmuxCmd, '@echo off\r\nexit /b 0\r\n');
      } else {
        const tmuxPath = join(fakeBin, 'tmux');
        await writeFile(tmuxPath, '#!/bin/sh\n# list-sessions success with no sessions\nexit 0\n');
        await chmod(tmuxPath, 0o755);
      }

      const pathPrefix = `${fakeBin}${delimiter}`;
      const basePath = process.env.PATH ?? process.env.Path ?? '';
      const mergedPath = `${pathPrefix}${basePath}`;
      const result = runCompatTarget(wd, ['doctor', '--team'], {
        PATH: mergedPath,
        Path: mergedPath,
        RCS_RUNTIME_BRIDGE: '0',
      });
      if (shouldSkipForSpawnPermissions(result.error)) return;
      assert.equal(result.status, Number.parseInt(readFixture('team-resume-blocker.exitcode.txt').trim(), 10), result.stderr || result.stdout);
      assert.equal(result.stderr, '');
      assert.equal(result.stdout.replace(/\\/g, '/'), readFixture('team-resume-blocker.stdout.txt'));
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
