import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runWatchMode } from '../index.js';
import type { HudFlags, HudRenderContext } from '../types.js';

const WATCH_FLAGS: HudFlags = {
  watch: true,
  json: false,
  tmux: false,
};

function emptyCtx(): HudRenderContext {
  return {
    version: null,
    gitBranch: null,
    forge: null,
    ultrawork: null,
    autopilot: null,
    blueprint: null,
    deepInterview: null,
    autoresearch: null,
    ultraqa: null,
    team: null,
    metrics: null,
    hudNotify: null,
    session: null,
  };
}

function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

async function withTimeout(promise: Promise<void>, message: string, timeoutMs = 1000): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  try {
    await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

afterEach(() => {
  process.exitCode = undefined;
});

describe('runWatchMode', () => {
  it('restores cursor and clears interval on SIGINT', async () => {
    const writes: string[] = [];
    let sigintHandler: (() => void) | undefined;
    let clearCount = 0;

    const promise = runWatchMode('/tmp', WATCH_FLAGS, {
      isTTY: true,
      env: {},
      readAllStateFn: async (_cwd, config) => ({ ...emptyCtx(), gitBranch: config?.git.display ?? null }),
      readHudConfigFn: async () => ({ preset: 'focused', git: { display: 'repo-branch' }, statusLine: { preset: 'focused' } }),
      renderHudFn: (ctx) => `frame:${ctx.gitBranch}`,
      writeStdout: (text) => { writes.push(text); },
      writeStderr: () => {},
      registerSigint: (handler) => { sigintHandler = handler; },
      setIntervalFn: () => ({}) as ReturnType<typeof setInterval>,
      clearIntervalFn: () => { clearCount += 1; },
    });

    await flush();
    assert.ok(sigintHandler, 'SIGINT handler should be registered');

    sigintHandler?.();
    await promise;

    assert.equal(clearCount, 1);
    assert.ok(writes.some((chunk) => chunk.includes('\x1b[?25l')), 'cursor should be hidden in watch mode');
    assert.ok(writes.some((chunk) => chunk.includes('\x1b[?25h\x1b[2J\x1b[H')), 'cursor should be restored on SIGINT');
    assert.ok(writes.some((chunk) => chunk.includes('frame:repo-branch')));
  });

  it('coalesces ticks so slow renders do not overlap', async () => {
    const writes: string[] = [];
    let sigintHandler: (() => void) | undefined;
    let timerTick: (() => void) | undefined;

    let callCount = 0;
    let inFlight = 0;
    let maxInFlight = 0;
    const firstRenderGate = deferred();
    const firstReadStarted = deferred();
    const secondReadStarted = deferred();

    const promise = runWatchMode('/tmp', WATCH_FLAGS, {
      isTTY: true,
      env: {},
      readAllStateFn: async (_cwd, config) => {
        callCount += 1;
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        try {
          if (callCount === 1) {
            firstReadStarted.resolve();
            await firstRenderGate.promise;
          } else if (callCount === 2) {
            secondReadStarted.resolve();
          }
          return emptyCtx();
        } finally {
          inFlight -= 1;
        }
      },
      readHudConfigFn: async () => ({ preset: 'focused', git: { display: 'repo-branch' }, statusLine: { preset: 'focused' } }),
      renderHudFn: () => 'frame',
      writeStdout: (text) => { writes.push(text); },
      writeStderr: () => {},
      registerSigint: (handler) => { sigintHandler = handler; },
      setIntervalFn: (handler) => {
        timerTick = handler;
        return ({}) as ReturnType<typeof setInterval>;
      },
      clearIntervalFn: () => {},
    });

    await flush();
    assert.ok(timerTick, 'interval tick should be registered');
    await withTimeout(firstReadStarted.promise, 'first render should start before exercising queued ticks');

    // Trigger multiple ticks while first render is deterministically blocked.
    timerTick?.();
    timerTick?.();

    firstRenderGate.resolve();
    await withTimeout(secondReadStarted.promise, 'queued rerender should start after first render is released');

    sigintHandler?.();
    await promise;

    assert.equal(maxInFlight, 1);
    assert.equal(callCount, 2, 'multiple overlapping ticks should collapse to one queued rerender');
  });


  it('runs authority tick after each rendered frame', async () => {
    const writes: string[] = [];
    let sigintHandler: (() => void) | undefined;
    let authorityCalls = 0;

    const promise = runWatchMode('/tmp', WATCH_FLAGS, {
      isTTY: true,
      env: {},
      readAllStateFn: async () => emptyCtx(),
      readHudConfigFn: async () => ({ preset: 'focused', git: { display: 'repo-branch' }, statusLine: { preset: 'focused' } }),
      renderHudFn: () => 'frame',
      writeStdout: (text) => { writes.push(text); },
      writeStderr: () => {},
      registerSigint: (handler) => { sigintHandler = handler; },
      setIntervalFn: () => ({}) as ReturnType<typeof setInterval>,
      clearIntervalFn: () => {},
      runAuthorityTickFn: async ({ cwd }) => { authorityCalls += 1; assert.equal(cwd, '/tmp'); },
    });

    await flush();
    sigintHandler?.();
    await promise;

    assert.equal(authorityCalls, 1);
    assert.ok(writes.some((chunk) => chunk.includes('frame')));
  });

  it('handles render failures gracefully and restores terminal state', async () => {
    const writes: string[] = [];
    const errors: string[] = [];
    let clearCount = 0;

    await runWatchMode('/tmp', WATCH_FLAGS, {
      isTTY: true,
      env: {},
      readAllStateFn: async (_cwd, config) => {
        throw new Error('boom');
      },
      readHudConfigFn: async () => ({ preset: 'focused', git: { display: 'repo-branch' }, statusLine: { preset: 'focused' } }),
      renderHudFn: () => 'frame',
      writeStdout: (text) => { writes.push(text); },
      writeStderr: (text) => { errors.push(text); },
      registerSigint: () => {},
      setIntervalFn: () => ({}) as ReturnType<typeof setInterval>,
      clearIntervalFn: () => { clearCount += 1; },
    });

    assert.equal(clearCount, 1);
    assert.equal(process.exitCode, 1);
    assert.ok(errors.some((line) => line.includes('HUD watch render failed: boom')));
    assert.ok(writes.some((chunk) => chunk.includes('\x1b[?25h\x1b[2J\x1b[H')));
  });
});
