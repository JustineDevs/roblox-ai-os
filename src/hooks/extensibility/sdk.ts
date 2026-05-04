import type { HookEventEnvelope, HookPluginSdk } from './types.js';
import { createHookPluginLogger } from './sdk/logging.js';
import { clearHookPluginStateFiles, createHookPluginStateApi } from './sdk/plugin-state.js';
import { sanitizeHookPluginName } from './sdk/paths.js';
import { createHookPluginRcsStateApi } from './sdk/runtime-state.js';
import { createHookPluginTmuxApi } from './sdk/tmux.js';

interface HookPluginSdkOptions {
  cwd: string;
  pluginName: string;
  event: HookEventEnvelope;
  sideEffectsEnabled?: boolean;
}

export function createHookPluginSdk(options: HookPluginSdkOptions): HookPluginSdk {
  const pluginName = sanitizeHookPluginName(options.pluginName);

  return {
    tmux: createHookPluginTmuxApi({
      ...options,
      pluginName,
    }),
    log: createHookPluginLogger(options.cwd, pluginName, options.event),
    state: createHookPluginStateApi(options.cwd, pluginName),
    rcs: createHookPluginRcsStateApi(options.cwd),
  };
}

export async function clearHookPluginState(cwd: string, pluginName: string): Promise<void> {
  await clearHookPluginStateFiles(cwd, pluginName);
}
