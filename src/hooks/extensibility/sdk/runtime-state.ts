import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import type {
  HookPluginRcsHudState,
  HookPluginRcsNotifyFallbackState,
  HookPluginRcsSessionState,
  HookPluginRcsUpdateCheckState,
  HookPluginSdk,
} from '../types.js';
import { rcsRootStateFilePath } from './paths.js';
import { getReadScopedStateFilePaths } from '../../../mcp/state-paths.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

async function readRcsStateFile<T extends Record<string, unknown>>(
  path: string,
  normalize?: (value: Record<string, unknown>) => T | null,
): Promise<T | null> {
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(await readFile(path, 'utf-8')) as unknown;
    if (!isRecord(parsed)) return null;
    return normalize ? normalize(parsed) : parsed as T;
  } catch {
    return null;
  }
}

function normalizeSessionState(value: Record<string, unknown>): HookPluginRcsSessionState | null {
  return typeof value.session_id === 'string' && value.session_id.trim()
    ? value as HookPluginRcsSessionState
    : null;
}

export function createHookPluginRcsStateApi(cwd: string): HookPluginSdk['rcs'] {
  return {
    session: {
      read: () => readRcsStateFile<HookPluginRcsSessionState>(
        rcsRootStateFilePath(cwd, 'session.json'),
        normalizeSessionState,
      ),
    },
    hud: {
      read: async () => {
        const [hudStatePath] = await getReadScopedStateFilePaths('hud-state.json', cwd, undefined, {
          rootFallback: false,
        });
        return readRcsStateFile<HookPluginRcsHudState>(hudStatePath);
      },
    },
    notifyFallback: {
      read: () => readRcsStateFile<HookPluginRcsNotifyFallbackState>(
        rcsRootStateFilePath(cwd, 'notify-fallback-state.json'),
      ),
    },
    updateCheck: {
      read: () => readRcsStateFile<HookPluginRcsUpdateCheckState>(
        rcsRootStateFilePath(cwd, 'update-check.json'),
      ),
    },
  };
}
