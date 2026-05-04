import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  AUTORESEARCH_DEPRECATION_MESSAGE,
  autoresearchCommand,
  normalizeAutoresearchCodexArgs,
  parseAutoresearchArgs,
} from '../autoresearch.js';
import { main as cliMain } from '../index.js';

async function runRcsCli(
  cwd: string,
  argv: string[],
  envOverrides: Record<string, string> = {},
): Promise<{ status: number | null; stdout: string; stderr: string; error?: string }> {
  const previousCwd = process.cwd();
  const previousEnv = { ...process.env };
  const previousExitCode = process.exitCode;
  const originalExit = process.exit.bind(process);
  let stdout = '';
  let stderr = '';
  const originalStdoutWrite = process.stdout.write.bind(process.stdout);
  const originalStderrWrite = process.stderr.write.bind(process.stderr);
  const currentExitStatus = () => {
    const value = process.exitCode;
    return typeof value === 'number' ? value : value == null ? null : Number(value);
  };
  const EXIT_SENTINEL = Symbol('rcs-test-exit');

  try {
    process.chdir(cwd);
    Object.assign(process.env, {
      ...process.env,
      RCS_AUTO_UPDATE: '0',
      RCS_NOTIFY_FALLBACK: '0',
      RCS_HOOK_DERIVED_SIGNALS: '0',
      ...envOverrides,
    });
    process.stdout.write = ((chunk: string | Uint8Array) => {
      stdout += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8');
      return true;
    }) as typeof process.stdout.write;
    process.stderr.write = ((chunk: string | Uint8Array) => {
      stderr += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8');
      return true;
    }) as typeof process.stderr.write;
    process.exit = ((code?: string | number | null) => {
      process.exitCode = typeof code === 'number' ? code : code == null ? 0 : Number(code);
      throw EXIT_SENTINEL;
    }) as typeof process.exit;
    process.exitCode = 0;
    await cliMain(argv);
    return { status: currentExitStatus() ?? 0, stdout, stderr };
  } catch (error) {
    if (error === EXIT_SENTINEL) {
      return { status: currentExitStatus() ?? 0, stdout, stderr };
    }
    return {
      status: currentExitStatus() ?? 1,
      stdout,
      stderr,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    process.stdout.write = originalStdoutWrite;
    process.stderr.write = originalStderrWrite;
    process.exit = originalExit;
    process.chdir(previousCwd);
    for (const key of Object.keys(process.env)) {
      if (!(key in previousEnv)) delete process.env[key];
    }
    Object.assign(process.env, previousEnv);
    process.exitCode = previousExitCode;
  }
}

async function initRepo(): Promise<string> {
  const raw = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-test-'));
  const cwd = realpathSync(raw);
  execFileSync('git', ['init'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'Test User'], { cwd, stdio: 'ignore' });
  await writeFile(join(cwd, 'README.md'), 'hello\n', 'utf-8');
  execFileSync('git', ['add', 'README.md'], { cwd, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd, stdio: 'ignore' });
  return cwd;
}

describe('normalizeAutoresearchCodexArgs', () => {
  it('adds sandbox bypass by default for autoresearch workers', () => {
    assert.deepEqual(normalizeAutoresearchCodexArgs(['--model', 'gpt-5']), ['--model', 'gpt-5', '--dangerously-bypass-approvals-and-sandbox']);
  });

  it('deduplicates explicit bypass flags', () => {
    assert.deepEqual(normalizeAutoresearchCodexArgs(['--dangerously-bypass-approvals-and-sandbox']), ['--dangerously-bypass-approvals-and-sandbox']);
  });

  it('normalizes --madmax to the canonical bypass flag', () => {
    assert.deepEqual(normalizeAutoresearchCodexArgs(['--madmax']), ['--dangerously-bypass-approvals-and-sandbox']);
  });
});

describe('parseAutoresearchArgs', () => {
  it('treats top-level topic/evaluator flags as seeded deep-interview input', () => {
    const parsed = parseAutoresearchArgs(['--topic', 'Improve docs', '--evaluator', 'node eval.js', '--slug', 'docs-run']);
    assert.equal(parsed.guided, true);
    assert.equal(parsed.seedArgs?.topic, 'Improve docs');
    assert.equal(parsed.seedArgs?.evaluatorCommand, 'node eval.js');
    assert.equal(parsed.seedArgs?.slug, 'docs-run');
  });

  it('treats bare init as guided alias and init with flags as expert init args', () => {
    const bare = parseAutoresearchArgs(['init']);
    assert.equal(bare.guided, true);
    assert.deepEqual(bare.initArgs, []);

    const flagged = parseAutoresearchArgs(['init', '--topic', 'Ship feature']);
    assert.equal(flagged.guided, true);
    assert.deepEqual(flagged.initArgs, ['--topic', 'Ship feature']);
  });

  it('parses explicit run subcommand without breaking bare mission-dir parsing', () => {
    const runParsed = parseAutoresearchArgs(['run', 'missions/demo', '--model', 'gpt-5']);
    assert.equal(runParsed.runSubcommand, true);
    assert.equal(runParsed.missionDir, 'missions/demo');
    assert.deepEqual(runParsed.codexArgs, ['--model', 'gpt-5']);

    const bareParsed = parseAutoresearchArgs(['missions/demo', '--model', 'gpt-5']);
    assert.equal(bareParsed.runSubcommand, undefined);
    assert.equal(bareParsed.missionDir, 'missions/demo');
    assert.deepEqual(bareParsed.codexArgs, ['--model', 'gpt-5']);
  });
});

describe('rcs autoresearch hard deprecation', () => {
  it('documents autoresearch as deprecated in top-level help', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-help-'));
    try {
      const result = await runRcsCli(cwd, ['--help']);
      const output = `${result.stdout}${result.stderr}`;
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(output, /rcs autoresearch\s+\[DEPRECATED\] Use \$autoresearch; direct CLI launch removed/i);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  it('routes autoresearch --help to local deprecation help', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-local-help-'));
    try {
      const result = await runRcsCli(cwd, ['autoresearch', '--help']);
      const output = `${result.stdout}${result.stderr}`;
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(output, /hard-deprecated legacy command surface/i);
      assert.match(output, /\$deep-interview --autoresearch/i);
      assert.match(output, /\$autoresearch/i);
      assert.match(output, /prompt-architect-artifact/i);
      assert.doesNotMatch(output, /roblox-ai-os-creator-skills \(rcs\) - Multi-agent orchestration for Codex CLI/i);
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  });

  for (const argv of [
    ['autoresearch'],
    ['autoresearch', 'init'],
    ['autoresearch', 'run', 'missions/demo'],
    ['autoresearch', 'missions/demo'],
    ['autoresearch', '--resume', 'run-123'],
    ['autoresearch', '--topic', 'Flaky onboarding'],
  ]) {
    it(`fails legacy invocation: rcs ${argv.join(' ')}`, async () => {
      const cwd = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-fail-'));
      try {
        const result = await runRcsCli(cwd, argv);
        assert.notEqual(result.status, 0);
        const output = `${result.stdout}\n${result.stderr}`;
        assert.match(output, /hard-deprecated/i);
        assert.match(output, /\$autoresearch/i);
        assert.match(output, /Direct CLI launch, resume, run, bare mission-dir aliases, and tmux split-pane launch are no longer supported/i);
      } finally {
        await rm(cwd, { recursive: true, force: true });
      }
    });
  }

  it('never invokes codex or tmux on the deprecated path', async () => {
    const cwd = await initRepo();
    const fakeBin = await mkdtemp(join(tmpdir(), 'rcs-autoresearch-noexec-bin-'));
    const codexLog = join(cwd, 'codex.log');
    const tmuxLog = join(cwd, 'tmux.log');
    try {
      await writeFile(join(fakeBin, 'codex'), `#!/bin/sh\necho codex >> ${JSON.stringify(codexLog)}\nexit 99\n`, 'utf-8');
      await writeFile(join(fakeBin, 'tmux'), `#!/bin/sh\necho tmux >> ${JSON.stringify(tmuxLog)}\nexit 99\n`, 'utf-8');
      execFileSync('chmod', ['+x', join(fakeBin, 'codex')], { stdio: 'ignore' });
      execFileSync('chmod', ['+x', join(fakeBin, 'tmux')], { stdio: 'ignore' });

      const result = await runRcsCli(cwd, ['autoresearch', 'run', 'missions/demo'], {
        PATH: `${fakeBin}:${process.env.PATH || ''}`,
      });
      assert.notEqual(result.status, 0);
      assert.equal(existsSync(codexLog), false);
      assert.equal(existsSync(tmuxLog), false);
    } finally {
      await rm(cwd, { recursive: true, force: true });
      await rm(fakeBin, { recursive: true, force: true });
    }
  });

  it('throws the same deprecation guidance from the command entrypoint', async () => {
    await assert.rejects(
      async () => autoresearchCommand(['run', 'missions/demo']),
      (error: unknown) => {
        assert.match(String(error), new RegExp(AUTORESEARCH_DEPRECATION_MESSAGE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        return true;
      },
    );
  });
});
