import { existsSync } from 'fs';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { rcsStateDir } from '../utils/paths.js';

export type CurrentTaskStatus = 'active' | 'merged' | 'closed' | 'superseded';

export interface CurrentTaskBaselineEntry {
  branch_name: string;
  worktree_path: string | null;
  base_ref?: string;
  issue_number?: number;
  pr_number?: number;
  pr_url?: string;
  status: CurrentTaskStatus;
  created_at: string;
  updated_at: string;
}

interface CurrentTaskBaselineFile {
  version: 1;
  tasks: CurrentTaskBaselineEntry[];
}

export interface UpsertCurrentTaskBaselineInput {
  branch_name: string;
  worktree_path?: string | null;
  base_ref?: string;
  issue_number?: number;
  pr_number?: number;
  pr_url?: string;
  status?: CurrentTaskStatus;
}

function baselinePath(repoRoot: string): string {
  return join(rcsStateDir(repoRoot), 'current-task-baseline.json');
}

function emptyBaseline(): CurrentTaskBaselineFile {
  return { version: 1, tasks: [] };
}

export function readCurrentTaskBaseline(repoRoot: string): CurrentTaskBaselineFile {
  const path = baselinePath(repoRoot);
  if (!existsSync(path)) return emptyBaseline();

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as CurrentTaskBaselineFile;
    if (parsed.version !== 1 || !Array.isArray(parsed.tasks)) return emptyBaseline();
    return {
      version: 1,
      tasks: parsed.tasks
        .filter((entry) => entry && typeof entry.branch_name === 'string' && typeof entry.status === 'string')
        .map((entry) => ({
          ...entry,
          worktree_path: typeof entry.worktree_path === 'string' ? resolve(entry.worktree_path) : null,
        })),
    };
  } catch {
    return emptyBaseline();
  }
}

function writeCurrentTaskBaseline(repoRoot: string, data: CurrentTaskBaselineFile): void {
  const stateDir = rcsStateDir(repoRoot);
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(baselinePath(repoRoot), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

export function listActiveCurrentTasks(repoRoot: string): CurrentTaskBaselineEntry[] {
  return readCurrentTaskBaseline(repoRoot).tasks.filter((entry) => entry.status === 'active');
}

export function findActiveCurrentTaskByBranch(repoRoot: string, branchName: string): CurrentTaskBaselineEntry | null {
  const normalized = branchName.trim();
  if (!normalized) return null;
  return listActiveCurrentTasks(repoRoot).find((entry) => entry.branch_name === normalized) ?? null;
}

export function upsertCurrentTaskBaseline(
  repoRoot: string,
  input: UpsertCurrentTaskBaselineInput,
): CurrentTaskBaselineEntry {
  const branchName = input.branch_name.trim();
  if (!branchName) {
    throw new Error('current_task_baseline_branch_required');
  }

  const now = new Date().toISOString();
  const current = readCurrentTaskBaseline(repoRoot);
  const existing = current.tasks.find((entry) => entry.branch_name === branchName) ?? null;
  const next: CurrentTaskBaselineEntry = {
    branch_name: branchName,
    worktree_path: typeof input.worktree_path === 'string'
      ? resolve(input.worktree_path)
      : input.worktree_path === null
        ? null
        : existing?.worktree_path ?? null,
    base_ref: input.base_ref ?? existing?.base_ref,
    issue_number: input.issue_number ?? existing?.issue_number,
    pr_number: input.pr_number ?? existing?.pr_number,
    pr_url: input.pr_url ?? existing?.pr_url,
    status: input.status ?? existing?.status ?? 'active',
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  const tasks = current.tasks.filter((entry) => entry.branch_name !== branchName);
  tasks.push(next);
  tasks.sort((a, b) => a.branch_name.localeCompare(b.branch_name));
  writeCurrentTaskBaseline(repoRoot, { version: 1, tasks });
  return next;
}

export function assertCurrentTaskBranchAvailable(
  repoRoot: string,
  branchName: string,
  requestedWorktreePath: string,
): void {
  const current = findActiveCurrentTaskByBranch(repoRoot, branchName);
  if (!current) return;

  const requested = resolve(requestedWorktreePath);
  if (!current.worktree_path || current.worktree_path !== requested) {
    throw new Error(
      `current_task_branch_guard:${branchName}:${current.worktree_path ?? 'unknown_worktree'}`,
    );
  }
}
