import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { mkdtempSync } from 'node:fs';
import { arch, platform } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

type PackageJson = {
  bin?: string | Record<string, string>;
  scripts?: Record<string, string>;
  files?: string[];
};

type NpmPackDryRunFile = {
  path: string;
};

type NpmPackDryRunResult = {
  files?: NpmPackDryRunFile[];
};

function resolveNpmCliPath(): string {
  const fromEnv = process.env.npm_execpath?.trim();
  if (fromEnv) return fromEnv;
  return resolve(dirname(process.execPath), '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js');
}

function shouldSkipForSpawnPermissions(err?: string): boolean {
  return typeof err === 'string' && /(EPERM|EACCES)/i.test(err);
}

describe('sparkshell packaging scaffold', () => {
  it('registers native helper scripts but keeps staged native artifacts out of npm releases', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PackageJson;
    const binaryName = platform() === 'win32' ? 'rcs-sparkshell.exe' : 'rcs-sparkshell';
    const stagedRoot = mkdtempSync(join(tmpdir(), 'rcs-sparkshell-stage-'));
    const packagedBinaryRelativePath = join(`${platform()}-${arch()}`, binaryName);
    const packagedBinaryPath = join(stagedRoot, packagedBinaryRelativePath);

    assert.deepEqual(pkg.bin, { rcs: 'dist/cli/rcs.js' });
    assert.equal(pkg.scripts?.['build:sparkshell'], 'node dist/scripts/build-sparkshell.js');
    assert.equal(pkg.scripts?.['test:sparkshell'], 'node dist/scripts/test-sparkshell.js');
    assert.equal(pkg.files?.includes('dist/'), true, 'expected package files allowlist to include dist/');
    assert.equal(pkg.files?.includes('bin/'), false, 'did not expect broad bin/ allowlist in package files');
    assert.equal(pkg.files?.includes('bin/native/'), false, 'did not expect package files to include bin/native/');
    assert.equal(pkg.files?.includes('dist/'), true);
    assert.equal(pkg.files?.includes('src/scripts/'), true);

    const buildScriptPath = join(process.cwd(), 'dist', 'scripts', 'build-sparkshell.js');
    const testScriptPath = join(process.cwd(), 'dist', 'scripts', 'test-sparkshell.js');
    const testScriptSource = readFileSync(testScriptPath, 'utf-8');
    assert.equal(existsSync(buildScriptPath), true, 'expected build sparkshell helper script to exist');
    assert.equal(existsSync(testScriptPath), true, 'expected test sparkshell helper script to exist');
    assert.match(testScriptSource, /'crates', 'rcs-sparkshell', 'Cargo\.toml'/);
    assert.doesNotMatch(testScriptSource, /'native', 'rcs-sparkshell', 'Cargo\.toml'/);

    try {
      rmSync(packagedBinaryPath, { force: true });
      const buildResult = spawnSync(process.execPath, [buildScriptPath], {
        cwd: process.cwd(),
        encoding: 'utf-8',
        env: {
          ...process.env,
          RCS_SPARKSHELL_MANIFEST: join(process.cwd(), 'crates', 'rcs-sparkshell', 'Cargo.toml'),
          RCS_SPARKSHELL_STAGE_DIR: stagedRoot,
        },
      });
      assert.equal(buildResult.status, 0, buildResult.stderr || buildResult.stdout);
      assert.equal(existsSync(packagedBinaryPath), true, `expected staged binary at ${packagedBinaryRelativePath}`);

      const npmCliPath = resolveNpmCliPath();
      const packed = spawnSync(process.execPath, [npmCliPath, 'pack', '--dry-run', '--json', '--ignore-scripts'], {
        cwd: process.cwd(),
        encoding: 'utf-8',
      });
      if (shouldSkipForSpawnPermissions(packed.error?.message)) {
        return;
      }
      assert.equal(packed.status, 0, packed.stderr || packed.stdout);

      const results = JSON.parse(packed.stdout) as NpmPackDryRunResult[];
      const packedFiles = new Set((results[0]?.files ?? []).map((file) => file.path));

      assert.equal(packedFiles.has('dist/scripts/build-sparkshell.js'), true);
      assert.equal(packedFiles.has('dist/scripts/test-sparkshell.js'), true);
      assert.equal(packedFiles.has(packagedBinaryRelativePath.replaceAll('\\', '/')), false);
    } finally {
      rmSync(stagedRoot, { force: true, recursive: true });
    }
  });
});
