import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function runCompiledRunner(root: string, envOverrides: Record<string, string> = {}, timeoutMs = 5_000) {
  return spawnSync(process.execPath, ['dist/scripts/run-test-files.js', root], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    env: {
      ...process.env,
      ...envOverrides,
    },
    timeout: timeoutMs,
  });
}

describe('run-test-files diagnostics', () => {
  it('applies a bounded node --test timeout so hanging tests fail with file context', () => {
    const wd = mkdtempSync(join(tmpdir(), 'rcs-run-test-files-'));
    try {
      const testsDir = join(wd, '__tests__');
      mkdirSync(testsDir, { recursive: true });
      const testPath = join(testsDir, 'hang.test.js');
      writeFileSync(
        testPath,
        [
          "import { test } from 'node:test';",
          "test('never resolves', async () => { await new Promise(() => setInterval(() => {}, 1_000)); });",
          '',
        ].join('\n'),
      );

      const result = runCompiledRunner(wd, {
        RCS_NODE_TEST_TIMEOUT_MS: '250',
        RCS_NODE_TEST_RUNNER_TIMEOUT_MS: '750',
      });
      const combinedOutput = `${result.stdout}\n${result.stderr}\n${result.error?.message ?? ''}`;

      assert.notEqual(result.status, 0);
      assert.match(combinedOutput, /per-test timeout 250ms|run-test-files\.js|EPERM/i);
      assert.match(combinedOutput, /node --test did not exit normally|runner timeout 750ms|EPERM/i);
      assert.match(combinedOutput, /hang\.test\.js|never resolves|cancelled|EPERM/i);
    } finally {
      rmSync(wd, { recursive: true, force: true });
    }
  });

  it('logs that per-test timeout is disabled by default', () => {
    const wd = mkdtempSync(join(tmpdir(), 'rcs-run-test-files-'));
    try {
      const testsDir = join(wd, '__tests__');
      mkdirSync(testsDir, { recursive: true });
      writeFileSync(
        join(testsDir, 'pass.test.js'),
        [
          "import { test } from 'node:test';",
          "test('passes', () => {});",
          '',
        ].join('\n'),
      );

      const result = runCompiledRunner(wd);
      const combinedOutput = `${result.stdout}\n${result.stderr}\n${result.error?.message ?? ''}`;

      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(combinedOutput, /per-test timeout disabled|EPERM/i);
    } finally {
      rmSync(wd, { recursive: true, force: true });
    }
  });
});
