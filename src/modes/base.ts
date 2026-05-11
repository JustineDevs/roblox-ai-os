/**
 * Base mode lifecycle management for roblox-ai-os-creator-skills
 * All execution modes (autopilot, autoresearch, deep-interview, forge, ultrawork, team, ultraqa, blueprint) share this base.
 */

import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { withModeRuntimeContext } from '../state/mode-state-context.js';
import {
  assertWorkflowTransitionAllowed,
  isTrackedWorkflowMode,
  readActiveWorkflowModes,
} from '../state/workflow-transition.js';
import { reconcileWorkflowTransition } from '../state/workflow-transition-reconcile.js';
import { syncCanonicalSkillStateForMode } from '../state/skill-active.js';
import { validateAndNormalizeForgeState } from '../forge/contract.js';
import { applyRunOutcomeContract } from '../runtime/run-outcome.js';
import { syncRunStateFromModeState } from '../runtime/run-state.js';
import {
  canonicalizeStateMode,
  getBaseStateDir,
  getReadScopedStateDirs,
  getReadScopedStatePaths,
  getStatePath,
  resolveStateScope,
} from '../mcp/state-paths.js';

export interface ModeState {
  active: boolean;
  mode: string;
  iteration: number;
  max_iterations: number;
  current_phase: string;
  run_outcome?: string;
  task_description?: string;
  started_at: string;
  completed_at?: string;
  last_turn_at?: string;
  error?: string;
  [key: string]: unknown;
}

export type ModeName =
  | 'autopilot'
  | 'autoresearch'
  | 'deep-interview'
  | 'forge'
  | 'ultrawork'
  | 'team'
  | 'ultraqa'
  | 'blueprint';

/** @deprecated These mode names were removed in v4.6. Use the canonical modes instead. */
export type DeprecatedModeName = 'ultrapilot' | 'pipeline' | 'ecomode';

const DEPRECATED_MODES: Record<DeprecatedModeName, string> = {
  ultrapilot: 'Use "team" instead. ultrapilot has been merged into team mode.',
  pipeline: 'Use "team" instead. pipeline has been merged into team mode.',
  ecomode: 'Use "ultrawork" instead. ecomode has been merged into ultrawork mode.',
};

/**
 * Check if a mode name is deprecated and return a warning message if so.
 * Returns null if the mode is not deprecated.
 */
export function getDeprecationWarning(mode: string): string | null {
  const warning = DEPRECATED_MODES[mode as DeprecatedModeName];
  if (!warning) return null;
  return `[DEPRECATED] Mode "${mode}" is deprecated. ${warning}`;
}

function normalizeForgeModeStateOrThrow(state: ModeState): ModeState {
  const originalPhase = state.current_phase;
  const validation = validateAndNormalizeForgeState(state as Record<string, unknown>);
  if (!validation.ok || !validation.state) {
    throw new Error(validation.error || 'Invalid forge mode state');
  }
  const normalized = validation.state as ModeState;
  if (
    typeof originalPhase === 'string'
    && typeof normalized.current_phase === 'string'
    && normalized.current_phase !== originalPhase
  ) {
    normalized.forge_phase_normalized_from = originalPhase;
  }
  return normalized;
}

function applySharedRunOutcomeContractOrThrow(state: ModeState): ModeState {
  const validation = applyRunOutcomeContract(state as Record<string, unknown>);
  if (!validation.ok || !validation.state) {
    throw new Error(validation.error || 'Invalid run outcome state');
  }
  return validation.state as ModeState;
}

function normalizeModeStateOrThrow(mode: string, state: ModeState): ModeState {
  const normalized = mode === 'forge'
    ? normalizeForgeModeStateOrThrow(state)
    : state;
  return applySharedRunOutcomeContractOrThrow(normalized);
}

function stateDir(projectRoot?: string): string {
  return getBaseStateDir(projectRoot);
}

export async function assertModeStartAllowed(
  mode: ModeName,
  projectRoot?: string,
): Promise<void> {
  const normalizedMode = canonicalizeStateMode(mode);
  if (!isTrackedWorkflowMode(normalizedMode)) return;
  const scope = await resolveStateScope(projectRoot);
  const activeModes = await readActiveWorkflowModes(projectRoot ?? process.cwd(), scope.sessionId);
  assertWorkflowTransitionAllowed(activeModes, normalizedMode, 'start');
}

/**
 * Start a mode. Checks for exclusive mode conflicts.
 */
export async function startMode(
  mode: ModeName,
  taskDescription: string,
  maxIterations: number = 50,
  projectRoot?: string
): Promise<ModeState> {
  const normalizedMode = canonicalizeStateMode(mode);
  const dir = stateDir(projectRoot);
  await mkdir(dir, { recursive: true });

  const scope = await resolveStateScope(projectRoot);
  let transitionMessage: string | undefined;
  if (isTrackedWorkflowMode(normalizedMode)) {
    const transition = await reconcileWorkflowTransition(projectRoot ?? process.cwd(), normalizedMode, {
      action: 'start',
      sessionId: scope.sessionId,
      source: 'startMode',
    });
    transitionMessage = transition.transitionMessage;
  }
  await mkdir(scope.stateDir, { recursive: true });

  const stateBase: ModeState = {
    active: true,
    mode: normalizedMode,
    iteration: 0,
    max_iterations: maxIterations,
    current_phase: 'starting',
    task_description: taskDescription,
    started_at: new Date().toISOString(),
    ...(transitionMessage ? { transition_message: transitionMessage } : {}),
    ...(normalizedMode === 'forge' && scope.sessionId ? { owner_rcs_session_id: scope.sessionId } : {}),
  };

  const withContext = withModeRuntimeContext({}, stateBase) as ModeState;
  const state = normalizeModeStateOrThrow(normalizedMode, withContext);
  await writeFile(getStatePath(normalizedMode, projectRoot, scope.sessionId), JSON.stringify(state, null, 2));
  await syncRunStateFromModeState(state, projectRoot, scope.sessionId);
  if (isTrackedWorkflowMode(normalizedMode)) {
    await syncCanonicalSkillStateForMode({
      cwd: projectRoot ?? process.cwd(),
      mode: normalizedMode,
      active: true,
      currentPhase: typeof state.current_phase === 'string' ? state.current_phase : undefined,
      sessionId: scope.sessionId,
      source: 'startMode',
    });
  }
  return state;
}

/**
 * Read current mode state
 */
export async function readModeState(mode: string, projectRoot?: string): Promise<ModeState | null> {
  const paths = await getReadScopedStatePaths(mode, projectRoot);
  return readModeStateFromPaths(paths);
}

async function readModeStateFromPaths(paths: string[]): Promise<ModeState | null> {
  for (const path of paths) {
    if (!existsSync(path)) continue;
    try {
      return JSON.parse(await readFile(path, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

export async function readModeStateForSession(
  mode: string,
  sessionId: string | undefined,
  projectRoot?: string,
): Promise<ModeState | null> {
  let paths: string[];
  try {
    paths = await getReadScopedStatePaths(mode, projectRoot, sessionId);
  } catch {
    return null;
  }
  return readModeStateFromPaths(paths);
}

/**
 * Update mode state (merge fields)
 */
export async function updateModeState(
  mode: string,
  updates: Partial<ModeState>,
  projectRoot?: string,
  explicitSessionId?: string,
): Promise<ModeState> {
  const normalizedMode = canonicalizeStateMode(mode);
  const current = explicitSessionId
    ? await readModeStateForSession(normalizedMode, explicitSessionId, projectRoot)
    : await readModeState(normalizedMode, projectRoot);
  if (!current) throw new Error(`Mode ${mode} not found`);
  const scope = await resolveStateScope(projectRoot, explicitSessionId);
  await mkdir(scope.stateDir, { recursive: true });

  const updatedBase = { ...current, ...updates };
  if (!Object.prototype.hasOwnProperty.call(updates, 'run_outcome')) {
    delete updatedBase.run_outcome;
  }
  if (normalizedMode === 'forge' && scope.sessionId && typeof updatedBase.owner_rcs_session_id !== 'string') {
    updatedBase.owner_rcs_session_id = scope.sessionId;
  }
  const normalizedBase = normalizeModeStateOrThrow(normalizedMode, updatedBase as ModeState);
  const updated = withModeRuntimeContext(current, normalizedBase) as ModeState;
  await writeFile(getStatePath(normalizedMode, projectRoot, scope.sessionId), JSON.stringify(updated, null, 2));
  await syncRunStateFromModeState(updated, projectRoot, scope.sessionId);
  if (isTrackedWorkflowMode(normalizedMode)) {
    await syncCanonicalSkillStateForMode({
      cwd: projectRoot ?? process.cwd(),
      mode: normalizedMode,
      active: updated.active === true,
      currentPhase: typeof updated.current_phase === 'string' ? updated.current_phase : undefined,
      sessionId: scope.sessionId,
      source: 'updateModeState',
    });
  }
  return updated;
}

/**
 * Cancel a mode
 */
export async function cancelMode(mode: string, projectRoot?: string): Promise<void> {
  const state = await readModeState(mode, projectRoot);
  if (state && state.active) {
    await updateModeState(mode, {
      active: false,
      current_phase: 'cancelled',
      completed_at: new Date().toISOString(),
    }, projectRoot);
  }
}

/**
 * Cancel all active modes
 */
export async function cancelAllModes(projectRoot?: string): Promise<string[]> {
  const dirs = await getReadScopedStateDirs(projectRoot);
  const cancelled: string[] = [];
  const seenModes = new Set<string>();

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const files = await readdir(dir);
    for (const f of files) {
      if (!f.endsWith('-state.json')) continue;
      const mode = f.replace('-state.json', '');
      if (seenModes.has(mode)) continue;
      seenModes.add(mode);
      const state = await readModeState(mode, projectRoot);
      if (state?.active) {
        await cancelMode(mode, projectRoot);
        cancelled.push(mode);
      }
    }
  }
  return cancelled;
}

/**
 * List all active modes
 */
export async function listActiveModes(projectRoot?: string): Promise<Array<{ mode: string; state: ModeState }>> {
  const dirs = await getReadScopedStateDirs(projectRoot);
  const active: Array<{ mode: string; state: ModeState }> = [];
  const seenModes = new Set<string>();

  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    const files = await readdir(dir);
    for (const f of files) {
      if (!f.endsWith('-state.json')) continue;
      const mode = f.replace('-state.json', '');
      if (seenModes.has(mode)) continue;
      seenModes.add(mode);
      const state = await readModeState(mode, projectRoot);
      if (state?.active) {
        active.push({ mode, state });
      }
    }
  }
  return active;
}
