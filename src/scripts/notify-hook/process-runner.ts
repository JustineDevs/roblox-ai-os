/**
 * Subprocess helper for notify-hook modules.
 */

import { spawn, type SpawnOptions } from 'child_process';
import { extname } from 'node:path';
import {
  buildPlatformCommandSpec,
  resolveWindowsTmuxStubSpawn,
  type PlatformCommandSpec,
} from '../../utils/platform-command.js';

function shouldUseWindowsVerbatimForSpec(spec: PlatformCommandSpec): boolean {
  if (process.platform !== 'win32') return false;
  const p = spec.resolvedPath;
  if (typeof p !== 'string') return false;
  const ext = extname(p).toLowerCase();
  return ext === '.cmd' || ext === '.bat';
}

function normalizeTmuxStdout(raw: string): string {
  let out = raw;
  if (out.charCodeAt(0) === 0xfeff) out = out.slice(1);
  return out.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function decodeProcessStdout(buf: Buffer, command: string): string {
  if (command === 'tmux' && buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.toString('utf16le').replace(/^\uFEFF/, '');
  }
  return buf.toString('utf8');
}

/** Align tmux launches with `spawnPlatformCommandSync` so Windows resolves `.cmd` shims and uses cmd.exe when needed. */
function resolveSpawnTarget(
  command: string,
  args: string[],
): { cmd: string; argv: string[]; opts: SpawnOptions } {
  const baseOpts: SpawnOptions = { stdio: ['ignore', 'pipe', 'pipe'] };
  if (command !== 'tmux') {
    return { cmd: command, argv: args, opts: baseOpts };
  }
  if (process.env.RCS_TEST_TMUX_BIN) {
    const testBin = process.env.RCS_TEST_TMUX_BIN as string;
    if (process.platform === 'win32') {
      const stubSpec = resolveWindowsTmuxStubSpawn(testBin, args, process.env);
      if (stubSpec) {
        return { cmd: stubSpec.command, argv: stubSpec.args, opts: baseOpts };
      }
    }
    return { cmd: testBin, argv: args, opts: baseOpts };
  }
  const spec = buildPlatformCommandSpec('tmux', args, process.platform, process.env);
  const opts: SpawnOptions = {
    ...baseOpts,
    ...(process.platform === 'win32' ? { windowsHide: true } : {}),
    ...(shouldUseWindowsVerbatimForSpec(spec) ? { windowsVerbatimArguments: true } : {}),
  };
  return { cmd: spec.command, argv: spec.args, opts };
}

export function runProcess(command: string, args: string[], timeoutMs = 3000): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const usingTestTmux = command === 'tmux' && process.env.RCS_TEST_TMUX_BIN;
    const relaxingTestTmuxTimeout = command === 'tmux' && process.env.RCS_TEST_RELAX_TMUX_TIMEOUT === '1';
    const { cmd, argv, opts } = resolveSpawnTarget(command, args);
    const effectiveTimeoutMs = usingTestTmux || relaxingTestTmuxTimeout ? Math.max(timeoutMs, 10_000) : timeoutMs;
    const child = spawn(cmd, argv, opts);
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let finished = false;

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      child.kill('SIGTERM');
      reject(new Error(`timeout after ${effectiveTimeoutMs}ms`));
    }, effectiveTimeoutMs);

    child.stdout!.on('data', (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });
    child.stderr!.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });
    child.on('error', (err: Error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code: number | null) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      const stdout = decodeProcessStdout(Buffer.concat(stdoutChunks), command);
      const stderr = decodeProcessStdout(Buffer.concat(stderrChunks), command);
      if (code === 0) {
        resolve({
          stdout: command === 'tmux' ? normalizeTmuxStdout(stdout) : stdout,
          stderr,
          code,
        });
      } else {
        reject(new Error(stderr.trim() || `${command} exited ${code}`));
      }
    });
  });
}
