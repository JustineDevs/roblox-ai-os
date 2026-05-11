import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';


function isolatedChildEnv(fakeBinDir: string): NodeJS.ProcessEnv {
  const tmuxBin = join(fakeBinDir, 'tmux');
  return {
    PATH: `${fakeBinDir}:${process.env.PATH ?? ''}`,
    RCS_TEST_TMUX_BIN: tmuxBin,
    HOME: process.env.HOME,
    TMPDIR: process.env.TMPDIR,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP,
    SystemRoot: process.env.SystemRoot,
    WINDIR: process.env.WINDIR,
  };
}

async function withPatchedEnv<T>(overrides: Record<string, string>, run: () => Promise<T>): Promise<T> {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key]);
    process.env[key] = value;
  }
  try {
    return await run();
  } finally {
    for (const [key] of Object.entries(overrides)) {
      const value = previous.get(key);
      if (typeof value === 'string') process.env[key] = value;
      else delete process.env[key];
    }
  }
}

function buildFakeTmux(tmuxLogPath: string): string {
  return `#!/usr/bin/env bash
set -eu
echo "$@" >> "${tmuxLogPath}"
exit 0
`;
}

async function runSendPaneInputInChild(params: {
  fakeBinDir: string;
  moduleUrl: string;
  paneTarget: string;
  prompt: string;
  submitKeyPresses: number;
  typePrompt: boolean;
}) {
  return await withPatchedEnv(isolatedChildEnv(params.fakeBinDir) as Record<string, string>, async () => {
    const { sendPaneInput } = await import(params.moduleUrl);
    return await sendPaneInput({
      paneTarget: params.paneTarget,
      prompt: params.prompt,
      submitKeyPresses: params.submitKeyPresses,
      typePrompt: params.typePrompt,
    });
  });
}

async function runEvaluatePaneInjectionReadinessInChild(params: {
  fakeBinDir: string;
  moduleUrl: string;
  paneTarget: string;
  options?: Record<string, unknown>;
}) {
  return await withPatchedEnv(isolatedChildEnv(params.fakeBinDir) as Record<string, string>, async () => {
    const { evaluatePaneInjectionReadiness } = await import(params.moduleUrl);
    return await evaluatePaneInjectionReadiness(params.paneTarget, params.options ?? {});
  });
}

describe('notify-hook team tmux guard bridge', () => {
  it('submits without typing when typePrompt=false', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-tmux-guard-'));
    const fakeBinDir = join(cwd, 'fake-bin');
    const tmuxLogPath = join(cwd, 'tmux.log');

    try {
      await mkdir(fakeBinDir, { recursive: true });
      await writeFile(join(fakeBinDir, 'tmux'), buildFakeTmux(tmuxLogPath));
      await chmod(join(fakeBinDir, 'tmux'), 0o755);

      const moduleUrl = pathToFileURL(join(process.cwd(), 'dist/scripts/notify-hook/team-tmux-guard.js')).href;
      const result = await runSendPaneInputInChild({
        fakeBinDir,
        moduleUrl,
        paneTarget: '%42',
        prompt: 'hello bridge',
        submitKeyPresses: 2,
        typePrompt: false,
      });

      assert.equal(result.ok, true);

      const log = await readFile(tmuxLogPath, 'utf-8');
      assert.doesNotMatch(log, /-l/);
      assert.doesNotMatch(log, /hello bridge/);
      const lines = log.trim().split('\n').filter(Boolean);
      assert.equal(lines.length, 2);
      assert.match(lines[0], /send-keys -t %42 C-m/);
      assert.match(lines[1], /send-keys -t %42 C-m/);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('types then submits when typePrompt=true', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-tmux-guard-'));
    const fakeBinDir = join(cwd, 'fake-bin');
    const tmuxLogPath = join(cwd, 'tmux.log');

    try {
      await mkdir(fakeBinDir, { recursive: true });
      await writeFile(join(fakeBinDir, 'tmux'), buildFakeTmux(tmuxLogPath));
      await chmod(join(fakeBinDir, 'tmux'), 0o755);

      const moduleUrl = pathToFileURL(join(process.cwd(), 'dist/scripts/notify-hook/team-tmux-guard.js')).href;
      const result = await runSendPaneInputInChild({
        fakeBinDir,
        moduleUrl,
        paneTarget: '%42',
        prompt: 'hello bridge',
        submitKeyPresses: 1,
        typePrompt: true,
      });

      assert.equal(result.ok, true);

      const log = await readFile(tmuxLogPath, 'utf-8');
      assert.match(log, /send-keys -t %42 -l hello bridge/);
      const lines = log.trim().split('\n').filter(Boolean);
      assert.equal(lines.length, 2);
      assert.match(lines[1], /send-keys -t %42 C-m/);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('reports pane_not_ready with capture context when the pane is not input-ready', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-tmux-guard-'));
    const fakeBinDir = join(cwd, 'fake-bin');
    const tmuxLogPath = join(cwd, 'tmux.log');

    try {
      await mkdir(fakeBinDir, { recursive: true });
      await writeFile(
        join(fakeBinDir, 'tmux'),
        `#!/usr/bin/env bash
set -eu
echo "$@" >> "${tmuxLogPath}"
cmd="$1"
shift || true
if [[ "$cmd" == "display-message" ]]; then
  format="\${@: -1}"
  if [[ "$format" == "#{pane_current_command}" ]]; then
    echo "codex"
    exit 0
  fi
  if [[ "$format" == "#{pane_in_mode}" ]]; then
    echo "0"
    exit 0
  fi
  exit 0
fi
if [[ "$cmd" == "capture-pane" ]]; then
  printf "loading workspace state...\\n"
  exit 0
fi
exit 0
`,
      );
      await chmod(join(fakeBinDir, 'tmux'), 0o755);

      const moduleUrl = pathToFileURL(join(process.cwd(), 'dist/scripts/notify-hook/team-tmux-guard.js')).href;
      const result = await runEvaluatePaneInjectionReadinessInChild({
        fakeBinDir,
        moduleUrl,
        paneTarget: '%42',
      });

      assert.equal(result.ok, false);
      assert.equal(result.reason, 'pane_not_ready');
      assert.equal(result.paneCurrentCommand, 'codex');
      assert.match(result.paneCapture, /loading workspace state/);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('treats capture-pane failure as non-blocking for a live codex pane', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-team-tmux-guard-'));
    const fakeBinDir = join(cwd, 'fake-bin');
    const tmuxLogPath = join(cwd, 'tmux.log');

    try {
      await mkdir(fakeBinDir, { recursive: true });
      await writeFile(
        join(fakeBinDir, 'tmux'),
        `#!/usr/bin/env bash
set -eu
echo "$@" >> "${tmuxLogPath}"
cmd="$1"
shift || true
if [[ "$cmd" == "display-message" ]]; then
  format="\${@: -1}"
  if [[ "$format" == "#{pane_current_command}" ]]; then
    echo "codex"
    exit 0
  fi
  if [[ "$format" == "#{pane_in_mode}" ]]; then
    echo "0"
    exit 0
  fi
  exit 0
fi
if [[ "$cmd" == "capture-pane" ]]; then
  echo "capture failed" >&2
  exit 1
fi
exit 0
`,
      );
      await chmod(join(fakeBinDir, 'tmux'), 0o755);

      const moduleUrl = pathToFileURL(join(process.cwd(), 'dist/scripts/notify-hook/team-tmux-guard.js')).href;
      const result = await runEvaluatePaneInjectionReadinessInChild({
        fakeBinDir,
        moduleUrl,
        paneTarget: '%42',
        options: { skipIfScrolling: true },
      });

      assert.equal(result.ok, true);
      assert.equal(result.reason, 'ok');
      assert.equal(result.paneCurrentCommand, 'codex');
      assert.equal(result.paneCapture, '');
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });
});
