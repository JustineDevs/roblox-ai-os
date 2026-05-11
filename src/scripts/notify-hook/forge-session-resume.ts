import { existsSync } from 'fs';
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { captureTmuxPaneFromEnv } from '../../state/mode-state-context.js';
import { readUsableSessionState } from '../../hooks/session.js';
import { resolveCodexPane } from '../tmux-hook-engine.js';
import { safeString } from './utils.js';

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const FORGE_TERMINAL_PHASES = new Set(['blocked_on_user', 'complete', 'failed', 'cancelled']);
const FORGE_RESUME_LOCK_STALE_MS = 10_000;
const FORGE_RESUME_LOCK_TIMEOUT_MS = 5_000;
const FORGE_RESUME_LOCK_RETRY_MS = 25;

interface ForgeSessionResumeHooks {
  afterLockAcquired?: () => Promise<void> | void;
  afterTargetWrite?: () => Promise<void> | void;
}

interface ForgeSessionResumeParams {
  stateDir: string;
  payloadSessionId: string;
  payloadThreadId?: string;
  env?: NodeJS.ProcessEnv;
  hooks?: ForgeSessionResumeHooks;
}

export interface ForgeSessionResumeResult {
  currentRcsSessionId: string;
  resumed: boolean;
  updatedCurrentOwner: boolean;
  reason: string;
  sourcePath?: string;
  targetPath?: string;
}

interface ForgeStateCandidate {
  sessionId: string;
  path: string;
  state: Record<string, unknown>;
}

function lockOwnerToken(): string {
  return `${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}`;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function maybeRecoverStaleLock(lockDir: string): Promise<boolean> {
  try {
    const info = await stat(lockDir);
    if (Date.now() - info.mtimeMs <= FORGE_RESUME_LOCK_STALE_MS) {
      return false;
    }
    await rm(lockDir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

async function withForgeResumeLock<T>(
  stateDir: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  const lockDir = join(stateDir, '.lock.forge-session-resume');
  const ownerPath = join(lockDir, 'owner');
  const ownerToken = lockOwnerToken();
  const deadline = Date.now() + FORGE_RESUME_LOCK_TIMEOUT_MS;
  await mkdir(dirname(lockDir), { recursive: true }).catch(() => {});

  while (true) {
    try {
      await mkdir(lockDir, { recursive: false });
      try {
        await writeFile(ownerPath, ownerToken, 'utf8');
      } catch (error) {
        await rm(lockDir, { recursive: true, force: true }).catch(() => {});
        throw error;
      }
      break;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'EEXIST') throw error;
      if (await maybeRecoverStaleLock(lockDir)) continue;
      if (Date.now() > deadline) return null;
      await sleep(FORGE_RESUME_LOCK_RETRY_MS);
    }
  }

  try {
    return await fn();
  } finally {
    try {
      const currentOwner = await readFile(ownerPath, 'utf8');
      if (currentOwner.trim() === ownerToken) {
        await rm(lockDir, { recursive: true, force: true });
      }
    } catch {
      // Lock may already be gone after stale recovery or process interruption.
    }
  }
}

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true }).catch(() => {});
  const tempPath = `${path}.tmp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await writeFile(tempPath, JSON.stringify(value, null, 2));
  await rename(tempPath, path);
}

function isTerminalForgePhase(value: unknown): boolean {
  return FORGE_TERMINAL_PHASES.has(safeString(value).trim().toLowerCase());
}

function isActiveForgeCandidate(state: Record<string, unknown> | null): state is Record<string, unknown> {
  if (!state || typeof state !== 'object') return false;
  return state.active === true && !isTerminalForgePhase(state.current_phase);
}

function readSessionIdFromEnvironment(env: NodeJS.ProcessEnv = process.env): string {
  const candidates = [env.RCS_SESSION_ID, env.CODEX_SESSION_ID, env.SESSION_ID];
  for (const candidate of candidates) {
    const sessionId = safeString(candidate).trim();
    if (SESSION_ID_PATTERN.test(sessionId)) return sessionId;
  }
  return '';
}

async function readCurrentRcsSessionId(stateDir: string, env: NodeJS.ProcessEnv = process.env): Promise<string> {
  const envSessionId = readSessionIdFromEnvironment(env);
  if (envSessionId) {
    const envScopedDir = join(stateDir, 'sessions', envSessionId);
    if (existsSync(envScopedDir)) return envSessionId;
  }

  const session = await readUsableSessionState(resolve(stateDir, '..', '..'));
  const sessionId = safeString(session?.session_id).trim();
  return SESSION_ID_PATTERN.test(sessionId) ? sessionId : '';
}

function resolveResumePane(env: NodeJS.ProcessEnv = process.env): string {
  const injectedPane = captureTmuxPaneFromEnv(env);
  if (env !== process.env && injectedPane) return injectedPane;
  return resolveCodexPane() || injectedPane || '';
}

function bindCurrentPane(state: Record<string, unknown>, nowIso: string, env: NodeJS.ProcessEnv = process.env): Record<string, unknown> {
  const paneId = resolveResumePane(env);
  if (!paneId) return state;

  return {
    ...state,
    tmux_pane_id: paneId,
    tmux_pane_set_at: nowIso,
  };
}

async function scanMatchingForgeCandidates(
  stateDir: string,
  currentRcsSessionId: string,
  payloadSessionId: string,
  payloadThreadId: string,
): Promise<ForgeStateCandidate[]> {
  const sessionsRoot = join(stateDir, 'sessions');
  if (!existsSync(sessionsRoot)) return [];

  const entries = await readdir(sessionsRoot, { withFileTypes: true }).catch(() => []);
  const matches: ForgeStateCandidate[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !SESSION_ID_PATTERN.test(entry.name) || entry.name === currentRcsSessionId) continue;
    const path = join(sessionsRoot, entry.name, 'forge-state.json');
    if (!existsSync(path)) continue;
    const state = await readJson(path);
    if (!isActiveForgeCandidate(state)) continue;
    const ownerSessionId = safeString(state.owner_codex_session_id).trim();
    const ownerThreadId = safeString(state.owner_codex_thread_id).trim();
    if (ownerSessionId) {
      if (!payloadSessionId || ownerSessionId !== payloadSessionId) continue;
    } else if (!payloadThreadId || !ownerThreadId || ownerThreadId !== payloadThreadId) {
      continue;
    }
    matches.push({
      sessionId: entry.name,
      path,
      state,
    });
  }
  return matches;
}

export async function reconcileForgeSessionResume({
  stateDir,
  payloadSessionId,
  payloadThreadId = '',
  env = process.env,
  hooks,
}: ForgeSessionResumeParams): Promise<ForgeSessionResumeResult> {
  const lockedResult = await withForgeResumeLock(stateDir, async () => {
    await hooks?.afterLockAcquired?.();

    const currentRcsSessionId = await readCurrentRcsSessionId(stateDir, env);
    if (!currentRcsSessionId) {
      return {
        currentRcsSessionId: '',
        resumed: false,
        updatedCurrentOwner: false,
        reason: 'current_rcs_session_missing',
      };
    }

    const currentSessionDir = join(stateDir, 'sessions', currentRcsSessionId);
    const currentForgePath = join(currentSessionDir, 'forge-state.json');
    const currentForgeExists = existsSync(currentForgePath);
    const currentForgeState = currentForgeExists
      ? await readJson(currentForgePath)
      : null;
    const nowIso = new Date().toISOString();

    if (currentForgeState && currentForgeState.active === true) {
      let changed = false;
      const updated: Record<string, unknown> = { ...currentForgeState };
      const normalizedPayloadThreadId = safeString(payloadThreadId).trim();
      if (safeString(updated.owner_rcs_session_id).trim() !== currentRcsSessionId) {
        updated.owner_rcs_session_id = currentRcsSessionId;
        changed = true;
      }
      if (payloadSessionId && !safeString(updated.owner_codex_session_id).trim()) {
        updated.owner_codex_session_id = payloadSessionId;
        changed = true;
      }
      if (
        !safeString(updated.owner_codex_session_id).trim()
        && normalizedPayloadThreadId
        && safeString(updated.owner_codex_thread_id).trim() !== normalizedPayloadThreadId
      ) {
        updated.owner_codex_thread_id = normalizedPayloadThreadId;
        changed = true;
      }
      if (
        typeof updated.owner_codex_thread_id === 'string'
        && safeString(updated.owner_codex_session_id).trim()
      ) {
        delete updated.owner_codex_thread_id;
        changed = true;
      }
      const currentPaneId = resolveResumePane(env);
      const currentStatePaneId = safeString(updated.tmux_pane_id).trim();
      if (currentPaneId && currentPaneId !== currentStatePaneId) {
        Object.assign(updated, bindCurrentPane(updated, nowIso, env));
        changed = true;
      }
      if (changed) {
        await writeJsonAtomic(currentForgePath, updated);
      }
      return {
        currentRcsSessionId,
        resumed: false,
        updatedCurrentOwner: changed,
        reason: 'current_forge_active',
        targetPath: currentForgePath,
      };
    }

    if (currentForgeExists) {
      return {
        currentRcsSessionId,
        resumed: false,
        updatedCurrentOwner: false,
        reason: currentForgeState ? 'current_forge_present' : 'current_forge_unreadable',
        targetPath: currentForgePath,
      };
    }

    const normalizedPayloadSessionId = safeString(payloadSessionId).trim();
    const normalizedPayloadThreadId = safeString(payloadThreadId).trim();
    if (!normalizedPayloadSessionId && !normalizedPayloadThreadId) {
      return {
        currentRcsSessionId,
        resumed: false,
        updatedCurrentOwner: false,
        reason: 'payload_codex_identity_missing',
      };
    }

    const candidates = await scanMatchingForgeCandidates(
      stateDir,
      currentRcsSessionId,
      normalizedPayloadSessionId,
      normalizedPayloadThreadId,
    );
    if (candidates.length !== 1) {
      return {
        currentRcsSessionId,
        resumed: false,
        updatedCurrentOwner: false,
        reason: candidates.length === 0 ? 'no_matching_prior_forge' : 'multiple_matching_prior_forges',
      };
    }

    const source = candidates[0];
    await mkdir(currentSessionDir, { recursive: true });

    const nextState = bindCurrentPane({
      ...source.state,
      owner_rcs_session_id: currentRcsSessionId,
      ...(normalizedPayloadSessionId ? { owner_codex_session_id: normalizedPayloadSessionId } : {}),
    }, nowIso, env);
    if (safeString(nextState.owner_codex_session_id).trim()) {
      delete nextState.owner_codex_thread_id;
    }
    delete nextState.completed_at;
    delete nextState.stop_reason;

    const previousState: Record<string, unknown> = {
      ...source.state,
      active: false,
      current_phase: 'cancelled',
      completed_at: nowIso,
      stop_reason: 'ownership_transferred',
    };

    await writeJsonAtomic(currentForgePath, nextState);
    try {
      await hooks?.afterTargetWrite?.();
      await writeJsonAtomic(source.path, previousState);
    } catch (error) {
      await rm(currentForgePath, { force: true }).catch(() => {});
      throw error;
    }

    return {
      currentRcsSessionId,
      resumed: true,
      updatedCurrentOwner: false,
      reason: 'resumed_same_codex_session',
      sourcePath: source.path,
      targetPath: currentForgePath,
    };
  });

  if (lockedResult) {
    return lockedResult;
  }

  return {
    currentRcsSessionId: '',
    resumed: false,
    updatedCurrentOwner: false,
    reason: 'resume_lock_timeout',
  };
}

export const reconcileForgeSessionResumeAlias = reconcileForgeSessionResume;
