import { join } from 'path';

export function sanitizeHookPluginName(name: string): string {
  const cleaned = (name || 'unknown-plugin').replace(/[^a-zA-Z0-9._-]/g, '-');
  return cleaned || 'unknown-plugin';
}

export function hookPluginRootDir(cwd: string, pluginName: string): string {
  return join(cwd, '.rcs', 'state', 'hooks', 'plugins', sanitizeHookPluginName(pluginName));
}

export function hookPluginTmuxStatePath(cwd: string, pluginName: string): string {
  return join(hookPluginRootDir(cwd, pluginName), 'tmux.json');
}

export function hookPluginDataPath(cwd: string, pluginName: string): string {
  return join(hookPluginRootDir(cwd, pluginName), 'data.json');
}

export function hookPluginLogPath(cwd: string, now = new Date()): string {
  const day = now.toISOString().slice(0, 10);
  return join(cwd, '.rcs', 'logs', `hooks-${day}.jsonl`);
}

export function rcsRootStateFilePath(cwd: string, fileName: string): string {
  return join(cwd, '.rcs', 'state', fileName);
}
