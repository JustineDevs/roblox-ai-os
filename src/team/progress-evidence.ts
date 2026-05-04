import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { readBranchGitActivityMsForPath } from './leader-activity.js';

function safeString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function parseIsoMs(value: unknown): number {
  if (typeof value !== 'string' || value.trim() === '') return Number.NaN;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

async function readJsonIfExists(path: string): Promise<Record<string, unknown> | null> {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function statMsIfExists(path: string): Promise<number> {
  if (!existsSync(path)) return Number.NaN;
  try {
    return (await stat(path)).mtimeMs;
  } catch {
    return Number.NaN;
  }
}

async function readTeamWorktreePaths(cwd: string, teamName: string): Promise<string[]> {
  const teamRoot = join(cwd, '.rcs', 'state', 'team', teamName);
  const manifestPath = join(teamRoot, 'manifest.v2.json');
  const configPath = join(teamRoot, 'config.json');
  const sourcePath = existsSync(manifestPath) ? manifestPath : configPath;
  const parsed = await readJsonIfExists(sourcePath);
  const workers = Array.isArray(parsed?.workers) ? parsed.workers : [];
  const candidates = new Set<string>([resolve(cwd)]);

  for (const worker of workers) {
    if (!worker || typeof worker !== 'object') continue;
    const worktreePath = safeString((worker as Record<string, unknown>).worktree_path).trim();
    const workingDir = safeString((worker as Record<string, unknown>).working_dir).trim();
    if (worktreePath) candidates.add(resolve(worktreePath));
    else if (workingDir) candidates.add(resolve(workingDir));
  }

  return [...candidates];
}

async function readTeamNudgeProgressMs(cwd: string, teamName: string): Promise<number> {
  const nudgeState = await readJsonIfExists(join(cwd, '.rcs', 'state', 'team-leader-nudge.json'));
  const progressByTeam = nudgeState?.progress_by_team;
  if (!progressByTeam || typeof progressByTeam !== 'object') return Number.NaN;
  const teamProgress = (progressByTeam as Record<string, unknown>)[teamName];
  if (!teamProgress || typeof teamProgress !== 'object') return Number.NaN;
  return parseIsoMs((teamProgress as Record<string, unknown>).last_progress_at);
}

async function readCurrentTaskBaselineMs(worktreePath: string): Promise<number> {
  return await statMsIfExists(join(worktreePath, '.rcs', 'state', 'current-task-baseline.json'));
}

export async function readLatestTeamProgressEvidenceMs(
  cwd: string,
  teamName: string,
): Promise<number> {
  const worktreePaths = await readTeamWorktreePaths(cwd, teamName);
  const [nudgeProgressMs, gitActivityMs, baselineMs] = await Promise.all([
    readTeamNudgeProgressMs(cwd, teamName),
    Promise.all(worktreePaths.map((worktreePath) => readBranchGitActivityMsForPath(worktreePath))),
    Promise.all(worktreePaths.map((worktreePath) => readCurrentTaskBaselineMs(worktreePath))),
  ]);

  const candidates = [nudgeProgressMs, ...gitActivityMs, ...baselineMs].filter((value) => Number.isFinite(value));
  return candidates.length > 0 ? Math.max(...candidates) : Number.NaN;
}
