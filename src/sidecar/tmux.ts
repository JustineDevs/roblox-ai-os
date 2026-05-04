import { execFileSync } from 'node:child_process';
import { parsePaneIdFromTmuxOutput, shellEscapeSingle } from '../hud/tmux.js';
import { resolveTmuxBinaryForPlatform } from '../utils/platform-command.js';
import { resolveRcsCliEntryPath } from '../utils/paths.js';

export interface SidecarTmuxOptions {
  cwd: string;
  teamName: string;
  width?: number;
  sessionId?: string;
  rcsBin?: string;
}

type TmuxExecSync = (args: string[]) => string;

function sidecarWidth(width: number | undefined): number {
  return Number.isFinite(width) && (width ?? 0) >= 30 ? Math.floor(width ?? 48) : 48;
}

export function buildSidecarWatchCommand(options: SidecarTmuxOptions): string {
  const rcsBin = options.rcsBin ?? resolveRcsCliEntryPath();
  if (!rcsBin) throw new Error('Failed to resolve RCS launcher path for sidecar startup.');
  const prefix = options.sessionId ? `RCS_SESSION_ID=${shellEscapeSingle(options.sessionId)} ` : '';
  return `${prefix}node ${shellEscapeSingle(rcsBin)} sidecar ${shellEscapeSingle(options.teamName)} --watch --width ${sidecarWidth(options.width)}`;
}

export function buildSidecarTmuxSplitArgs(options: SidecarTmuxOptions): string[] {
  return [
    'split-window',
    '-h',
    '-d',
    '-l',
    String(sidecarWidth(options.width)),
    '-c',
    options.cwd,
    '-P',
    '-F',
    '#{pane_id}',
    buildSidecarWatchCommand(options),
  ];
}

function defaultExecTmuxSync(args: string[]): string {
  return execFileSync(resolveTmuxBinaryForPlatform() || 'tmux', args, {
    encoding: 'utf-8',
    ...(process.platform === 'win32' ? { windowsHide: true } : {}),
  });
}

export function launchSidecarTmuxPane(
  options: SidecarTmuxOptions,
  execTmuxSync: TmuxExecSync = defaultExecTmuxSync,
): string | null {
  try {
    return parsePaneIdFromTmuxOutput(execTmuxSync(buildSidecarTmuxSplitArgs(options)));
  } catch {
    return null;
  }
}
