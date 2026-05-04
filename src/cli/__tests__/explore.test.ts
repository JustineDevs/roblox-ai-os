import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { chmod, mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  buildExploreHarnessArgs,
  buildExplorePromptWithWikiContext,
  exploreCommand,
  EXPLORE_USAGE,
  loadExplorePrompt,
  packagedExploreHarnessBinaryName,
  parseExploreArgs,
  repoBuiltExploreHarnessCommand,
  resolveExploreHarnessCommand,
  resolveExploreHarnessCommandWithHydration,
  resolveExploreEnv,
  resolveExploreSparkShellRoute,
  resolvePackagedExploreHarnessCommand,
} from '../explore.js';
import { writePage, WIKI_SCHEMA_VERSION } from '../../wiki/index.js';
import { withPackagedExploreHarnessHidden, withPackagedExploreHarnessLock } from './packaged-explore-harness-lock.js';

function runRcsCli(
  cwd: string,
  argv: string[],
  envOverrides: Record<string, string> = {},
): { status: number | null; stdout: string; stderr: string; error?: string } {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(testDir, '..', '..', '..');
  const rcsBin = join(repoRoot, 'dist', 'cli', 'rcs.js');
  const nodeWrapper = join(cwd, '.rcs-test-node.sh');
  if (!existsSync(nodeWrapper)) {
    writeFileSync(nodeWrapper, '#!/bin/sh\nexec node "$@"\n');
    chmodSync(nodeWrapper, 0o755);
  }
  const r = spawnSync(nodeWrapper, [rcsBin, ...argv], {
    cwd,
    encoding: 'utf-8',
    env: { ...process.env, CODEX_HOME: '', ...envOverrides },
  });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error?.message };
}


function normalizeDarwinTmpPath(value: string): string {
  return process.platform === 'darwin' ? value.replaceAll('/private/var/', '/var/') : value;
}

function shouldSkipForSpawnPermissions(err?: string): boolean {
  return typeof err === 'string' && /(EPERM|EACCES)/i.test(err);
}

function shouldSkipLocalListen(err: unknown): boolean {
  const code = err && typeof err === 'object' && 'code' in err ? String((err as NodeJS.ErrnoException).code) : '';
  return code === 'EPERM' || code === 'EACCES';
}

async function runExploreCommandForTest(
  cwd: string,
  argv: string[],
  envOverrides: Record<string, string> = {},
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const originalStdout = process.stdout.write.bind(process.stdout);
  const originalStderr = process.stderr.write.bind(process.stderr);
  const originalExitCode = process.exitCode;
  const previousEnv = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(envOverrides)) {
    previousEnv.set(key, process.env[key]);
    process.env[key] = value;
  }

  process.stdout.write = ((chunk: string | Uint8Array) => {
    stdoutChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array) => {
    stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
    return true;
  }) as typeof process.stderr.write;

  const originalCwd = process.cwd();
  process.exitCode = 0;
  try {
    process.chdir(cwd);
    await exploreCommand(argv);
  } finally {
    process.chdir(originalCwd);
    for (const [key, value] of previousEnv.entries()) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    process.stdout.write = originalStdout;
    process.stderr.write = originalStderr;
  }

  const exitCode = process.exitCode ?? 0;
  process.exitCode = originalExitCode;
  return { stdout: stdoutChunks.join(''), stderr: stderrChunks.join(''), exitCode };
}

async function createExploreTestPath(wd: string): Promise<string> {
  const binDir = join(wd, 'test-bin');
  await mkdir(binDir, { recursive: true });
  const rgPath = join(binDir, process.platform === 'win32' ? 'rg.cmd' : 'rg');
  const lines = process.platform === 'win32'
    ? ['@echo off', 'echo ripgrep 14.0.0', '']
    : ['#!/bin/sh', 'echo "ripgrep 14.0.0"', ''];
  await writeFile(rgPath, lines.join(process.platform === 'win32' ? '\r\n' : '\n'));
  if (process.platform !== 'win32') {
    await chmod(rgPath, 0o755);
  }
  return `${binDir}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH || ''}`;
}

async function writeEnvNodeCodexStub(wd: string, capturePath: string): Promise<string> {
  const stub = join(wd, 'codex-stub.sh');
  const argvPath = join(wd, 'codex-argv.txt');
  const allowedStdoutPath = join(wd, 'allowed.stdout.txt');
  const allowedStderrPath = join(wd, 'allowed.stderr.txt');
  const blockedStdoutPath = join(wd, 'blocked.stdout.txt');
  const blockedStderrPath = join(wd, 'blocked.stderr.txt');
  await writeFile(
    stub,
    `#!/bin/sh
set -eu
output_path=''
: > ${JSON.stringify(argvPath)}
while [ "$#" -gt 0 ]; do
  printf '%s\n' "$1" >> ${JSON.stringify(argvPath)}
  if [ "$1" = "-o" ] && [ "$#" -ge 2 ]; then
    output_path="$2"
    shift 2
    continue
  fi
  shift
done

if [ -z "$output_path" ]; then
  printf 'missing -o output path\n' >&2
  exit 1
fi

bash -lc 'rg --version' > ${JSON.stringify(allowedStdoutPath)} 2> ${JSON.stringify(allowedStderrPath)}
allowed_status=$?
set +e
bash -lc 'node --version' > ${JSON.stringify(blockedStdoutPath)} 2> ${JSON.stringify(blockedStderrPath)}
blocked_status=$?
set -e

{
  printf 'PATH=%s\n' "$PATH"
  printf 'SHELL=%s\n' "\${SHELL:-}"
  printf 'ALLOWED_STATUS=%s\n' "$allowed_status"
  printf 'BLOCKED_STATUS=%s\n' "$blocked_status"
  printf -- '--ARGV--\n'
  cat ${JSON.stringify(argvPath)}
  printf -- '--ALLOWED_STDOUT--\n'
  cat ${JSON.stringify(allowedStdoutPath)}
  printf -- '--ALLOWED_STDERR--\n'
  cat ${JSON.stringify(allowedStderrPath)}
  printf -- '--BLOCKED_STDOUT--\n'
  cat ${JSON.stringify(blockedStdoutPath)}
  printf -- '--BLOCKED_STDERR--\n'
  cat ${JSON.stringify(blockedStderrPath)}
} > ${JSON.stringify(capturePath)}

printf '# Answer\nHarness completed\n' > "$output_path"
`,
  );
  await chmod(stub, 0o755);
  return stub;
}

async function writePosixPackageManagerCodexShim(wd: string, capturePath: string): Promise<string> {
  const packageRoot = join(wd, 'node_modules', '@openai', 'codex');
  const binDir = join(wd, 'node_modules', '.bin');
  const entrypointPath = join(packageRoot, 'bin', 'codex.js');
  const shimPath = join(binDir, 'codex');
  await mkdir(join(packageRoot, 'bin'), { recursive: true });
  await mkdir(binDir, { recursive: true });
  await writeFile(
    entrypointPath,
    `const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
let outputPath = '';
for (let i = 0; i < args.length; i += 1) {
  const value = args[i];
  if (value === '-o' && i + 1 < args.length) {
    outputPath = args[i + 1];
    i += 1;
  }
}
if (!outputPath) {
  process.stderr.write('missing -o output path\\n');
  process.exit(1);
}

const payload = [
  'ARGV0=' + process.argv[0],
  'ARGV1=' + process.argv[1],
  'PATH=' + (process.env.PATH || ''),
  'SHELL=' + (process.env.SHELL || ''),
].join('\\n') + '\\n';
fs.writeFileSync(${JSON.stringify(capturePath)}, payload);
fs.writeFileSync(outputPath, '# Answer\\nHarness completed\\n');
`,
  );
  await writeFile(
    shimPath,
    `#!/bin/sh
basedir=$(dirname "$0")
if [ -x "$basedir/node" ]; then
  exec "$basedir/node" "$basedir/../@openai/codex/bin/codex.js" "$@"
fi
exec node "$basedir/../@openai/codex/bin/codex.js" "$@"
`,
  );
  await chmod(shimPath, 0o755);
  return shimPath;
}

async function writeScenarioCodexStub(wd: string, body: string): Promise<string> {
  const stub = join(wd, 'codex-scenario-stub.sh');
  await writeFile(
    stub,
    `#!/bin/sh
set -eu
output_path=''
model=''
while [ "$#" -gt 0 ]; do
  case "$1" in
    -o)
      output_path="$2"
      shift 2
      ;;
    -m)
      model="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done
if [ -z "$output_path" ]; then
  printf 'missing -o output path\n' >&2
  exit 1
fi
if [ -z "$model" ]; then
  printf 'missing -m model\n' >&2
  exit 1
fi
${body}
`,
  );
  await chmod(stub, 0o755);
  return stub;
}

async function writeExploreHarnessScenarioStub(wd: string, body: string): Promise<string> {
  const stub = join(wd, 'explore-scenario-stub.sh');
  await writeFile(
    stub,
    `#!/bin/sh
set -eu
${body}
`,
  );
  await chmod(stub, 0o755);
  return stub;
}

describe('parseExploreArgs', () => {
  it('parses --prompt form', () => {
    assert.deepEqual(parseExploreArgs(['--prompt', 'find', 'auth']), { prompt: 'find auth' });
  });

  it('parses --prompt= form', () => {
    assert.deepEqual(parseExploreArgs(['--prompt=find auth']), { prompt: 'find auth' });
  });

  it('parses --prompt-file form', () => {
    assert.deepEqual(parseExploreArgs(['--prompt-file', 'prompt.md']), { promptFile: 'prompt.md' });
  });

  it('throws on missing prompt', () => {
    assert.throws(() => parseExploreArgs([]), new RegExp(EXPLORE_USAGE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  it('throws on unknown flag', () => {
    assert.throws(() => parseExploreArgs(['--bogus']), /Unknown argument/);
  });

  it('rejects duplicate prompt sources', () => {
    assert.throws(() => parseExploreArgs(['--prompt', 'find auth', '--prompt-file', 'prompt.md']), /Choose exactly one/);
  });

  it('rejects missing prompt-file value', () => {
    assert.throws(() => parseExploreArgs(['--prompt-file']), /Missing path after --prompt-file/);
  });

  it('rejects missing prompt value', () => {
    assert.throws(() => parseExploreArgs(['--prompt']), /Missing text after --prompt/);
  });
});

describe('loadExplorePrompt', () => {
  it('reads prompt file content', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-prompt-'));
    try {
      const promptPath = join(wd, 'prompt.md');
      await writeFile(promptPath, '  find symbol refs  \n');
      assert.equal(await loadExplorePrompt({ promptFile: promptPath }), 'find symbol refs');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});

describe('buildExplorePromptWithWikiContext', () => {
  it('injects wiki matches into the explore prompt when local wiki pages exist', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-wiki-'));
    try {
      writePage(wd, {
        filename: 'runtime.md',
        frontmatter: {
          title: 'Runtime Architecture',
          tags: ['runtime', 'hooks'],
          created: '2026-01-01T00:00:00.000Z',
          updated: '2026-01-01T00:00:00.000Z',
          sources: ['test'],
          links: [],
          category: 'architecture',
          confidence: 'high',
          schemaVersion: WIKI_SCHEMA_VERSION,
        },
        content: '\n# Runtime Architecture\n\nSessionStart uses native hooks and session-end uses runtime cleanup.\n',
      });

      const prompt = buildExplorePromptWithWikiContext('how does session-start work', wd);
      assert.match(prompt, /\[RCS Wiki Context\]/);
      assert.match(prompt, /Runtime Architecture/);
      assert.match(prompt, /prefer repository-backed facts/i);
      assert.match(prompt, /Wiki mismatch/);
      assert.match(prompt, /Original Explore Prompt/);
      assert.equal(existsSync(join(wd, '.rcs', 'wiki', 'log.md')), false);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('does not mutate wiki logs when building read-only wiki context', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-wiki-log-'));
    try {
      writePage(wd, {
        filename: 'runtime.md',
        frontmatter: {
          title: 'Runtime Architecture',
          tags: ['runtime', 'hooks'],
          created: '2026-01-01T00:00:00.000Z',
          updated: '2026-01-01T00:00:00.000Z',
          sources: ['test'],
          links: [],
          category: 'architecture',
          confidence: 'high',
          schemaVersion: WIKI_SCHEMA_VERSION,
        },
        content: '\n# Runtime Architecture\n\nSessionStart uses native hooks and session-end uses runtime cleanup.\n',
      });

      buildExplorePromptWithWikiContext('session-start lifecycle', wd);
      const logPath = join(wd, '.rcs', 'wiki', 'log.md');
      assert.equal(existsSync(logPath), false);

      // sanity: direct query callers still log by default
      const { queryWiki } = await import('../../wiki/index.js');
      queryWiki(wd, 'session-start lifecycle');
      assert.equal(existsSync(logPath), true);
      assert.match(readFileSync(logPath, 'utf8'), /Query "session-start lifecycle"/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('warns when wiki pages are missing or too weak', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-no-wiki-'));
    try {
      const prompt = buildExplorePromptWithWikiContext('find auth', wd);
      assert.match(prompt, /\[RCS Wiki Status\]/);
      assert.match(prompt, /build an initial project wiki/i);
      assert.match(prompt, /Original Explore Prompt/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('warns when the wiki directory is missing entirely', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-missing-wiki-'));
    try {
      const prompt = buildExplorePromptWithWikiContext('find auth', wd);
      assert.match(prompt, /Wiki evidence is weak or missing/i);
      assert.match(prompt, /build an initial project wiki/i);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});

describe('resolvePackagedExploreHarnessCommand', () => {
  it('uses a packaged native binary when metadata matches the current platform', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-packaged-'));
    try {
      const binDir = join(wd, 'bin');
      await mkdir(binDir, { recursive: true });
      await writeFile(join(wd, 'package.json'), '{}\n');
      await writeFile(join(binDir, 'rcs-explore-harness.meta.json'), JSON.stringify({
        binaryName: packagedExploreHarnessBinaryName(),
        platform: process.platform,
        arch: process.arch,
      }));
      const binaryPath = join(binDir, packagedExploreHarnessBinaryName());
      await writeFile(binaryPath, '#!/bin/sh\nexit 0\n');
      await chmod(binaryPath, 0o755);

      const resolved = resolvePackagedExploreHarnessCommand(wd);
      assert.deepEqual(resolved, { command: binaryPath, args: [] });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('ignores packaged binaries built for a different platform', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-packaged-mismatch-'));
    try {
      const binDir = join(wd, 'bin');
      await mkdir(binDir, { recursive: true });
      await writeFile(join(wd, 'package.json'), '{}\n');
      await writeFile(join(binDir, 'rcs-explore-harness.meta.json'), JSON.stringify({
        binaryName: packagedExploreHarnessBinaryName('linux'),
        platform: process.platform === 'win32' ? 'linux' : 'win32',
        arch: process.arch,
      }));
      await writeFile(join(binDir, packagedExploreHarnessBinaryName('linux')), '#!/bin/sh\nexit 0\n');

      assert.equal(resolvePackagedExploreHarnessCommand(wd), undefined);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});

describe('resolveExploreHarnessCommand', () => {
  it('uses env override when provided', () => {
    const resolved = resolveExploreHarnessCommand('/repo', { RCS_EXPLORE_BIN: '/tmp/rcs-explore-stub' } as NodeJS.ProcessEnv);
    assert.deepEqual(resolved, { command: '/tmp/rcs-explore-stub', args: [] });
  });

  it('prefers a packaged native harness binary when present', async () => {
    await withPackagedExploreHarnessLock(async () => {
      const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-native-'));
      try {
        const binDir = join(wd, 'bin');
        await mkdir(binDir, { recursive: true });
        await writeFile(join(wd, 'package.json'), '{}\n');
        await writeFile(join(binDir, 'rcs-explore-harness.meta.json'), JSON.stringify({
          binaryName: packagedExploreHarnessBinaryName(),
          platform: process.platform,
          arch: process.arch,
        }));
        const nativePath = join(binDir, packagedExploreHarnessBinaryName());
        await writeFile(nativePath, '#!/bin/sh\necho native\n');
        await chmod(nativePath, 0o755);

        const resolved = resolveExploreHarnessCommand(wd, {} as NodeJS.ProcessEnv);
        assert.deepEqual(resolved, { command: nativePath, args: [] });
      } finally {
        await rm(wd, { recursive: true, force: true });
      }
    });
  });

  it('uses an existing repo-built native harness before cargo fallback', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-target-'));
    try {
      const targetDir = join(wd, 'target', 'release');
      await mkdir(targetDir, { recursive: true });
      await writeFile(join(wd, 'package.json'), '{}\n');
      await writeFile(join(targetDir, packagedExploreHarnessBinaryName()), '#!/bin/sh\nexit 0\n');
      await chmod(join(targetDir, packagedExploreHarnessBinaryName()), 0o755);
      await mkdir(join(wd, 'crates', 'rcs-explore'), { recursive: true });
      await writeFile(join(wd, 'crates', 'rcs-explore', 'Cargo.toml'), '[package]\nname="rcs-explore-harness"\nversion="0.0.0"\n');

      const repoBuilt = repoBuiltExploreHarnessCommand(wd);
      assert.deepEqual(repoBuilt, { command: join(targetDir, packagedExploreHarnessBinaryName()), args: [] });

      const resolved = resolveExploreHarnessCommand(wd, {} as NodeJS.ProcessEnv);
      assert.deepEqual(resolved, { command: join(targetDir, packagedExploreHarnessBinaryName()), args: [] });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('builds cargo fallback command otherwise', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-fallback-'));
    try {
      const crateDir = join(wd, 'crates', 'rcs-explore');
      await mkdir(crateDir, { recursive: true });
      await writeFile(join(wd, 'package.json'), '{}\n');
      await writeFile(join(crateDir, 'Cargo.toml'), '[package]\nname = "rcs-explore-harness"\nversion = "0.0.0"\n');

      const resolved = resolveExploreHarnessCommand(wd, {} as NodeJS.ProcessEnv);
      assert.equal(resolved.command, 'cargo');
      assert.ok(resolved.args.includes('--manifest-path'));
      assert.ok(resolved.args.includes(join(wd, 'crates', 'rcs-explore', 'Cargo.toml')));
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('hydrates a native harness for packaged installs before attempting cargo fallback', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-hydrated-'));
    try {
      const assetRoot = join(wd, 'assets');
      const cacheDir = join(wd, 'cache');
      const stagingDir = join(wd, 'staging');
      await mkdir(assetRoot, { recursive: true });
      await mkdir(stagingDir, { recursive: true });
      await writeFile(join(wd, 'package.json'), JSON.stringify({
        version: '0.8.15',
        repository: { url: 'git+https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills.git' },
      }));
      await mkdir(join(wd, 'crates', 'rcs-explore'), { recursive: true });
      await writeFile(join(wd, 'crates', 'rcs-explore', 'Cargo.toml'), '[package]\nname=\"rcs-explore-harness\"\nversion=\"0.8.15\"\n');
      const binaryPath = join(stagingDir, packagedExploreHarnessBinaryName());
      await writeFile(binaryPath, '#!/bin/sh\necho hydrated-explore\n');
      await chmod(binaryPath, 0o755);

      const archiveName = `rcs-explore-harness-${process.platform}-${process.arch}.tar.gz`;
      const archivePath = join(assetRoot, archiveName);
      const archive = spawnSync('tar', ['-czf', archivePath, '-C', stagingDir, packagedExploreHarnessBinaryName()], { encoding: 'utf-8' });
      assert.equal(archive.status, 0, archive.stderr || archive.stdout);
      const archiveBuffer = await readFile(archivePath);
      const checksum = createHash('sha256').update(archiveBuffer).digest('hex');

      let server: { baseUrl: string; close: () => Promise<void> };
      try {
        server = await new Promise<{ baseUrl: string; close: () => Promise<void> }>((resolve, reject) => {
          const srv = createServer(async (req, res) => {
            const url = new URL(req.url || '/', 'http://127.0.0.1');
            const filePath = join(assetRoot, url.pathname.replace(/^\//, ''));
            try {
              res.writeHead(200);
              res.end(await readFile(filePath));
            } catch {
              res.writeHead(404);
              res.end('missing');
            }
          });
          srv.once('error', reject);
          srv.listen(0, '127.0.0.1', () => {
            const address = srv.address();
            if (!address || typeof address === 'string') {
              reject(new Error('bad address'));
              return;
            }
            resolve({
              baseUrl: `http://127.0.0.1:${address.port}`,
              close: () => new Promise<void>((done, rejectClose) => srv.close((err: Error | undefined) => err ? rejectClose(err) : done())),
            });
          });
        });
      } catch (err) {
        if (shouldSkipLocalListen(err)) return;
        throw err;
      }

      try {
        await writeFile(join(assetRoot, 'native-release-manifest.json'), JSON.stringify({
          version: '0.8.15',
          assets: [{
            product: 'rcs-explore-harness',
            version: '0.8.15',
            platform: process.platform,
            arch: process.arch,
            archive: archiveName,
            binary: 'rcs-explore-harness',
            binary_path: 'rcs-explore-harness',
            sha256: checksum,
            size: archiveBuffer.length,
            download_url: `${server.baseUrl}/${archiveName}`,
          }],
        }, null, 2));

        const resolved = await resolveExploreHarnessCommandWithHydration(wd, {
          RCS_NATIVE_MANIFEST_URL: `${server.baseUrl}/native-release-manifest.json`,
          RCS_NATIVE_CACHE_DIR: cacheDir,
        } as NodeJS.ProcessEnv);
        assert.notEqual(resolved.command, 'cargo');
        assert.match(resolved.command, /cache/);
      } finally {
        await server.close();
      }
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('reports a clean fallback error when the native manifest is unavailable for packaged installs', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-missing-manifest-'));
    try {
      await writeFile(join(wd, 'package.json'), JSON.stringify({
        version: '0.8.15',
        repository: { url: 'git+https://github.com/Yeachan-Heo/roblox-ai-os-creator-skills.git' },
      }));
      let server: { baseUrl: string; close: () => Promise<void> };
      try {
        server = await new Promise<{ baseUrl: string; close: () => Promise<void> }>((resolve, reject) => {
          const srv = createServer((_req, res) => {
            res.writeHead(404);
            res.end('missing');
          });
          srv.once('error', reject);
          srv.listen(0, '127.0.0.1', () => {
            const address = srv.address();
            if (!address || typeof address === 'string') {
              reject(new Error('bad address'));
              return;
            }
            resolve({
              baseUrl: `http://127.0.0.1:${address.port}`,
              close: () => new Promise<void>((done, rejectClose) => srv.close((err: Error | undefined) => err ? rejectClose(err) : done())),
            });
          });
        });
      } catch (err) {
        if (shouldSkipLocalListen(err)) return;
        throw err;
      }

      try {
        await assert.rejects(
          () => resolveExploreHarnessCommandWithHydration(wd, {
            RCS_NATIVE_MANIFEST_URL: `${server.baseUrl}/native-release-manifest.json`,
            RCS_NATIVE_CACHE_DIR: join(wd, 'cache'),
          } as NodeJS.ProcessEnv),
          /no compatible native harness is available/,
        );
      } finally {
        await server.close();
      }
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});

describe('buildExploreHarnessArgs', () => {
  it('includes cwd, prompt, prompt contract, and constrained model settings', () => {
    const wd = join(tmpdir(), 'rcs-explore-arg-test');
    const isolatedCodexHome = join(
      tmpdir(),
      `rcs-explore-defaults-${process.pid}-${Date.now()}`,
    );
    const savedEnv = new Map<string, string | undefined>();
    for (const key of [
      'CODEX_HOME',
      'RCS_DEFAULT_FRONTIER_MODEL',
      'RCS_DEFAULT_STANDARD_MODEL',
      'RCS_DEFAULT_SPARK_MODEL',
      'RCS_SPARK_MODEL',
    ] as const) {
      savedEnv.set(key, process.env[key]);
      delete process.env[key];
    }

    try {
      const args = buildExploreHarnessArgs('find auth', wd, {
        CODEX_HOME: isolatedCodexHome,
        RCS_EXPLORE_SPARK_MODEL: 'spark-model',
      } as NodeJS.ProcessEnv, '/pkg');
      assert.deepEqual(args.slice(0, 3), ['--cwd', wd, '--prompt']);
      assert.match(args[3] || '', /Original Explore Prompt/);
      assert.match(args[3] || '', /find auth/);
      assert.deepEqual(args.slice(4), [
        '--prompt-file',
        '/pkg/prompts/explore-harness.md',
        '--instructions-file',
        '/pkg/templates/model-instructions/explore-lightweight-AGENTS.md',
        '--model-spark',
        'spark-model',
        '--model-fallback',
        'gpt-5.5',
      ]);
    } finally {
      for (const [key, value] of savedEnv.entries()) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });

  it('honors configured env overrides for fallback model and instructions file', async () => {
    const codexHome = await mkdtemp(join(tmpdir(), 'rcs-explore-config-env-'));
    await writeFile(join(codexHome, '.rcs-config.json'), JSON.stringify({
      env: {
        RCS_DEFAULT_STANDARD_MODEL: 'standard-local',
        RCS_DEFAULT_SPARK_MODEL: 'spark-local',
        RCS_EXPLORE_MODEL_INSTRUCTIONS_FILE: '/config/explore-instructions.md',
      },
    }));

    try {
      const wd = join(tmpdir(), 'rcs-explore-arg-test');
      const args = buildExploreHarnessArgs('find auth', wd, {
        CODEX_HOME: codexHome,
      } as NodeJS.ProcessEnv, '/pkg');
      assert.deepEqual(args.slice(4), [
        '--prompt-file',
        '/pkg/prompts/explore-harness.md',
        '--instructions-file',
        '/config/explore-instructions.md',
        '--model-spark',
        'spark-local',
        '--model-fallback',
        'standard-local',
      ]);
    } finally {
      await rm(codexHome, { recursive: true, force: true });
    }
  });

  it('applies persisted project CODEX_HOME fallback before reading explore config overrides', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-project-codex-home-'));
    const badHome = join(wd, 'home-as-file');
    await writeFile(badHome, 'not-a-directory');
    await mkdir(join(wd, '.rcs'), { recursive: true });
    await writeFile(join(wd, '.rcs', 'setup-scope.json'), JSON.stringify({ scope: 'project' }));
    await mkdir(join(wd, '.codex'), { recursive: true });
    await writeFile(join(wd, '.codex', '.rcs-config.json'), JSON.stringify({
      env: {
        RCS_DEFAULT_STANDARD_MODEL: 'standard-project',
        RCS_DEFAULT_SPARK_MODEL: 'spark-project',
      },
    }));

    try {
      const env = resolveExploreEnv(wd, { HOME: badHome } as NodeJS.ProcessEnv);
      assert.equal(env.CODEX_HOME, join(wd, '.codex'));
      const args = buildExploreHarnessArgs('find auth', wd, env, '/pkg');
      assert.deepEqual(args.slice(4), [
        '--prompt-file',
        '/pkg/prompts/explore-harness.md',
        '--instructions-file',
        '/pkg/templates/model-instructions/explore-lightweight-AGENTS.md',
        '--model-spark',
        'spark-project',
        '--model-fallback',
        'standard-project',
      ]);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});

describe('resolveExploreSparkShellRoute', () => {
  it('keeps natural-language exploration prompts on the direct harness path', () => {
    assert.equal(resolveExploreSparkShellRoute('which files define team routing'), undefined);
    assert.equal(resolveExploreSparkShellRoute('map the relationship between hooks and tmux helpers'), undefined);
  });

  it('routes qualifying read-only git commands to sparkshell', () => {
    assert.deepEqual(resolveExploreSparkShellRoute('git log --oneline'), {
      argv: ['git', 'log', '--oneline'],
      reason: 'long-output',
    });
    assert.deepEqual(resolveExploreSparkShellRoute('run git diff --stat'), {
      argv: ['git', 'diff', '--stat'],
      reason: 'long-output',
    });
  });

  it('rejects non-read-only or shell-unsafe commands for sparkshell routing', () => {
    assert.equal(resolveExploreSparkShellRoute('git commit -m test'), undefined);
    assert.equal(resolveExploreSparkShellRoute('npm test'), undefined);
    assert.equal(resolveExploreSparkShellRoute('git log | head'), undefined);
    assert.equal(resolveExploreSparkShellRoute('find /tmp -maxdepth 1'), undefined);
  });
});

describe('exploreCommand', () => {
  it('routes qualifying read-only shell commands through sparkshell instead of the direct harness', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-sparkshell-route-'));
    try {
      const sparkshellStub = join(wd, 'sparkshell-stub.sh');
      const harnessStub = join(wd, 'explore-stub.sh');
      const capturePath = join(wd, 'sparkshell-capture.txt');
      await writeFile(
        sparkshellStub,
        `#!/bin/sh\nprintf '%s\n' "$@" > ${JSON.stringify(capturePath)}\nprintf '# Answer\n- routed via sparkshell\n'\n`,
      );
      await writeFile(harnessStub, '#!/bin/sh\nprintf harness-should-not-run\n');
      await chmod(sparkshellStub, 0o755);
      await chmod(harnessStub, 0o755);

      const result = runRcsCli(wd, ['explore', '--prompt', 'git log --oneline'], {
        RCS_SPARKSHELL_BIN: sparkshellStub,
        RCS_EXPLORE_BIN: harnessStub,
      });
      if (shouldSkipForSpawnPermissions(result.error)) return;

      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.equal(result.stdout, '# Answer\n- routed via sparkshell\n');
      assert.equal(result.stderr, '');
      const captured = (await readFile(capturePath, 'utf-8')).trim().split('\n');
      assert.deepEqual(captured, ['git', 'log', '--oneline']);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('falls back to the explore harness when sparkshell backend is unavailable', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-sparkshell-fallback-'));
    try {
      const harnessStub = join(wd, 'explore-stub.sh');
      await writeFile(
        harnessStub,
        '#!/bin/sh\nprintf "%s\\n" "# Answer" "- fallback harness recovered the lookup"\n',
      );
      await chmod(harnessStub, 0o755);

      const result = runRcsCli(wd, ['explore', '--prompt', 'git log --oneline'], {
        RCS_SPARKSHELL_BIN: join(wd, 'missing-sparkshell'),
        RCS_EXPLORE_BIN: harnessStub,
      });
      if (shouldSkipForSpawnPermissions(result.error)) return;

      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(result.stderr, /sparkshell backend unavailable/);
      assert.match(result.stderr, /Falling back to the explore harness/);
      assert.match(result.stdout, /fallback harness recovered the lookup/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('falls back to the explore harness when sparkshell is GLIBC-incompatible', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-sparkshell-glibc-'));
    try {
      const sparkshellStub = join(wd, 'sparkshell-stub.sh');
      const harnessStub = join(wd, 'explore-stub.sh');
      await writeFile(
        sparkshellStub,
        "#!/bin/sh\necho \"rcs-sparkshell: /lib/x86_64-linux-gnu/libc.so.6: version \\`GLIBC_2.39' not found\" 1>&2\nexit 1\n",
      );
      await writeFile(
        harnessStub,
        '#!/bin/sh\nprintf "%s\\n" "# Answer" "- fallback harness recovered the lookup"\n',
      );
      await chmod(sparkshellStub, 0o755);
      await chmod(harnessStub, 0o755);

      const result = runRcsCli(wd, ['explore', '--prompt', 'git log --oneline'], {
        RCS_SPARKSHELL_BIN: sparkshellStub,
        RCS_EXPLORE_BIN: harnessStub,
      });
      if (shouldSkipForSpawnPermissions(result.error)) return;

      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(result.stderr, /GLIBC symbols/i);
      assert.match(result.stderr, /Falling back to the explore harness/);
      assert.match(result.stdout, /fallback harness recovered the lookup/);
      assert.doesNotMatch(result.stderr, /version `GLIBC_2\.39' not found/);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('passes prompt to harness and preserves markdown stdout', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-cmd-'));
    try {
      const stub = join(wd, 'explore-stub.sh');
      const capturePath = join(wd, 'capture.txt');
      await writeFile(
        stub,
        `#!/bin/sh\nprintf '%s\n' \"$@\" > ${JSON.stringify(capturePath)}\nprintf '# Files\\n- demo\\n'\n`,
      );
      await chmod(stub, 0o755);

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];
      const originalStdout = process.stdout.write.bind(process.stdout);
      const originalStderr = process.stderr.write.bind(process.stderr);
      process.stdout.write = ((chunk: string | Uint8Array) => {
        stdoutChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
        return true;
      }) as typeof process.stdout.write;
      process.stderr.write = ((chunk: string | Uint8Array) => {
        stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
        return true;
      }) as typeof process.stderr.write;

      const originalEnv = process.env.RCS_EXPLORE_BIN;
      process.env.RCS_EXPLORE_BIN = stub;
      const originalCwd = process.cwd();
      process.chdir(wd);
      try {
        await exploreCommand(['--prompt', 'find', 'auth']);
      } finally {
        process.chdir(originalCwd);
        if (originalEnv === undefined) delete process.env.RCS_EXPLORE_BIN;
        else process.env.RCS_EXPLORE_BIN = originalEnv;
        process.stdout.write = originalStdout;
        process.stderr.write = originalStderr;
      }

      assert.equal(stderrChunks.join(''), '');
      assert.equal(stdoutChunks.join(''), '# Files\n- demo\n');
      const captured = (await readFile(capturePath, 'utf-8')).trim().split('\n');
      assert.ok(captured.includes('--prompt'));
      assert.ok(captured.includes('find auth'));
      assert.ok(captured.includes('--model-spark'));
      assert.ok(captured.includes('--model-fallback'));
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('works end-to-end through rcs explore', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-e2e-'));
    try {
      const stub = join(wd, 'explore-stub.sh');
      await writeFile(
        stub,
        '#!/bin/sh\nprintf "# Answer\\nReady to proceed\\n"\n',
      );
      await chmod(stub, 0o755);

      const result = runRcsCli(wd, ['explore', '--prompt', 'find auth'], { RCS_EXPLORE_BIN: stub });
      if (shouldSkipForSpawnPermissions(result.error)) return;
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.equal(result.stdout, '# Answer\nReady to proceed\n');
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('passes project-local CODEX_HOME to the harness when persisted setup scope is project', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-project-codex-home-e2e-'));
    try {
      const stub = join(wd, 'explore-stub.sh');
      const capturePath = join(wd, 'capture.txt');
      const badHome = join(wd, 'home-as-file');
      await writeFile(badHome, 'not-a-directory');
      await mkdir(join(wd, '.rcs'), { recursive: true });
      await writeFile(join(wd, '.rcs', 'setup-scope.json'), JSON.stringify({ scope: 'project' }));
      await writeFile(
        stub,
        `#!/bin/sh\nprintf 'CODEX_HOME=%s\\n' \"$CODEX_HOME\" > ${JSON.stringify(capturePath)}\nprintf '# Answer\\nReady to proceed\\n'\n`,
      );
      await chmod(stub, 0o755);

      const result = runRcsCli(wd, ['explore', '--prompt', 'find auth'], {
        HOME: badHome,
        RCS_EXPLORE_BIN: stub,
      });
      if (shouldSkipForSpawnPermissions(result.error)) return;
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.equal(result.stdout, '# Answer\nReady to proceed\n');
      assert.equal(normalizeDarwinTmpPath(await readFile(capturePath, 'utf-8')), `CODEX_HOME=${normalizeDarwinTmpPath(join(wd, '.codex'))}\n`);
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('launches an env-node codex binary while keeping model shell commands allowlisted', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-harness-e2e-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const capturePath = join(wd, 'capture.json');
        const codexStub = await writeEnvNodeCodexStub(wd, capturePath);
        const testPath = await createExploreTestPath(wd);

        const result = runRcsCli(wd, ['explore', '--prompt', 'find buildTmuxPaneCommand'], {
          RCS_EXPLORE_CODEX_BIN: codexStub,
          PATH: testPath,
        });
        if (shouldSkipForSpawnPermissions(result.error)) return;

        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.equal(result.stdout, '# Answer\nHarness completed\n');
        const captured = await readFile(capturePath, 'utf-8');
        assert.match(captured, /PATH=.*rcs-explore-allowlist-/);
        assert.match(captured, /SHELL=.*rcs-explore-allowlist-.*\/bin\/bash$/m);
      assert.match(captured, /ALLOWED_STATUS=0/);
      assert.match(captured, /BLOCKED_STATUS=(?!0)\d+/);
      assert.match(captured, /--ARGV--[\s\S]*\nexec\n/);
      assert.match(captured, /model_instructions_file=.*explore-lightweight-AGENTS\.md/);
      assert.match(captured, /--ALLOWED_STDOUT--[\s\S]*ripgrep/i);
      assert.match(captured, /--BLOCKED_STDERR--[\s\S]*not on the rcs explore allowlist/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('bypasses a POSIX package-manager codex shim without broadening the allowlisted PATH', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-harness-posix-shim-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const capturePath = join(wd, 'capture.txt');
        const codexShim = await writePosixPackageManagerCodexShim(wd, capturePath);
        const testPath = await createExploreTestPath(wd);

        const result = runRcsCli(wd, ['explore', '--prompt', 'find buildTmuxPaneCommand'], {
          RCS_EXPLORE_CODEX_BIN: codexShim,
          PATH: testPath,
        });
        if (shouldSkipForSpawnPermissions(result.error)) return;

        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.equal(result.stdout, '# Answer\nHarness completed\n');
        const captured = await readFile(capturePath, 'utf-8');
        assert.match(captured, /ARGV0=.*\/node$/m);
        assert.match(captured, /ARGV1=.*node_modules\/@openai\/codex\/bin\/codex\.js$/m);
        assert.match(captured, /PATH=.*rcs-explore-allowlist-/);
        assert.doesNotMatch(captured, /PATH=.*node_modules\/\.bin/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('supports --prompt-file end-to-end with the harness', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-harness-prompt-file-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const capturePath = join(wd, 'capture.json');
        const codexStub = await writeEnvNodeCodexStub(wd, capturePath);
        const testPath = await createExploreTestPath(wd);
        const promptPath = join(wd, 'prompt.md');
        await writeFile(promptPath, 'find prompt-file support\n');

        const result = runRcsCli(wd, ['explore', '--prompt-file', promptPath], {
          RCS_EXPLORE_CODEX_BIN: codexStub,
          PATH: testPath,
        });
        if (shouldSkipForSpawnPermissions(result.error)) return;

        assert.equal(result.status, 0, result.stderr || result.stdout);
        assert.equal(result.stdout, '# Answer\nHarness completed\n');
        const captured = await readFile(capturePath, 'utf-8');
        assert.match(captured, /--ARGV--[\s\S]*find prompt-file support/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('preserves must-preserve facts in a long noisy summary fixture', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-fidelity-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const harnessStub = await writeExploreHarnessScenarioStub(
          wd,
          `
printf '%s\n' '# Answer' '## Critical facts' '- MUST: summary mode stayed read-only' '- MUST: blocked command stayed node --version' '- MUST: next command is rcs team status <team-name>' '' '## Noise'
i=0
while [ "$i" -lt 80 ]; do
  printf '%s\n' "- distractor line $i"
  i=$((i + 1))
done
exit 0
`,
        );

        const result = await runExploreCommandForTest(wd, ['--prompt', 'surface the critical facts'], {
          RCS_EXPLORE_BIN: harnessStub,
        });

        assert.equal(result.exitCode, 0, result.stderr || result.stdout);
        assert.match(result.stdout, /MUST: summary mode stayed read-only/);
        assert.match(result.stdout, /MUST: blocked command stayed node --version/);
        assert.match(result.stdout, /MUST: next command is rcs team status <team-name>/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('preserves buried critical facts in adversarial noisy output', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-adversarial-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const harnessStub = await writeExploreHarnessScenarioStub(
          wd,
          `
printf '# Answer\n'
i=0
while [ "$i" -lt 40 ]; do
  printf '%s\n' "- noise before signal $i"
  i=$((i + 1))
done
printf '%s\n' '- MUST: fallback route remained available'
i=0
while [ "$i" -lt 40 ]; do
  printf '%s\n' "- noise after signal $i"
  i=$((i + 1))
done
printf '%s\n' '- MUST: stderr guidance stayed actionable'
printf '%s\n' '- MUST: semantic facts survive compression'
exit 0
`,
        );

        const result = await runExploreCommandForTest(wd, ['--prompt', 'extract buried signals'], {
          RCS_EXPLORE_BIN: harnessStub,
        });

        assert.equal(result.exitCode, 0, result.stderr || result.stdout);
        assert.match(result.stdout, /MUST: fallback route remained available/);
        assert.match(result.stdout, /MUST: stderr guidance stayed actionable/);
        assert.match(result.stdout, /MUST: semantic facts survive compression/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('falls back after spark failure with explicit output notice and actionable stderr guidance', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-fallback-success-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const harnessStub = await writeExploreHarnessScenarioStub(
          wd,
          `
printf '[rcs explore] fallback-attempt=model from=\`%s\` to=\`gpt-5.5\` reason=spark_attempt_failed exit=17. Cost/behavior boundary changed if fallback succeeds; stdout fallback notice is emitted only after successful fallback output.\n' "\${RCS_EXPLORE_SPARK_MODEL:-spark-test-model}" >&2
printf '[rcs explore] spark model \`%s\` unavailable or failed (exit 17). Falling back to \`gpt-5.5\`.\n' "\${RCS_EXPLORE_SPARK_MODEL:-spark-test-model}" >&2
printf '[rcs explore] spark stderr: spark timed out; retry with the frontier fallback\n' >&2
printf '%s\n' '## RCS Explore fallback' '- fallback: model' '- from: \`spark-test-model\`' '- to: \`gpt-5.5\`' '- reason: spark attempt failed with exit 17' '- boundary: cost/behavior may differ from the low-cost spark path' '' '# Answer' '- recovered with fallback model' '- MUST: actionable recovery path remained available'
`,
        );

        const result = await runExploreCommandForTest(wd, ['--prompt', 'validate fallback recovery'], {
          RCS_EXPLORE_BIN: harnessStub,
          RCS_EXPLORE_SPARK_MODEL: 'spark-test-model',
        });

        assert.equal(result.exitCode, 0, result.stderr || result.stdout);
        assert.match(result.stderr, /fallback-attempt=model from=`spark-test-model` to=`gpt-5\.5` reason=spark_attempt_failed exit=17/);
        assert.match(result.stderr, /stdout fallback notice is emitted only after successful fallback output/);
        assert.match(result.stderr, /spark model `spark-test-model` unavailable or failed \(exit 17\)/);
        assert.match(result.stderr, /spark stderr: spark timed out; retry with the frontier fallback/);
        assert.match(result.stdout, /## RCS Explore fallback/);
        assert.match(result.stdout, /fallback: model/);
        assert.match(result.stdout, /from: `spark-test-model`/);
        assert.match(result.stdout, /to: `gpt-5\.5`/);
        assert.match(result.stdout, /cost\/behavior may differ from the low-cost spark path/);
        assert.match(result.stdout, /recovered with fallback model/);
        assert.match(result.stdout, /MUST: actionable recovery path remained available/);
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });

  it('reports both failed attempts with codes and final actionable stderr end-to-end', async () => {
    const wd = await mkdtemp(join(tmpdir(), 'rcs-explore-fallback-failure-'));
    try {
      await withPackagedExploreHarnessHidden(async () => {
        const harnessStub = await writeExploreHarnessScenarioStub(
          wd,
          `
printf '[rcs explore] fallback-attempt=model from=\`%s\` to=\`gpt-5.5\` reason=spark_attempt_failed exit=23. Cost/behavior boundary changed if fallback succeeds; stdout fallback notice is emitted only after successful fallback output.\n' "\${RCS_EXPLORE_SPARK_MODEL:-spark-test-model}" >&2
printf '[rcs explore] spark model \`%s\` unavailable or failed (exit 23). Falling back to \`gpt-5.5\`.\n' "\${RCS_EXPLORE_SPARK_MODEL:-spark-test-model}" >&2
printf '[rcs explore] spark stderr: spark backend unavailable; install the fallback runtime\n' >&2
printf '[rcs explore] both spark (\`%s\`) and fallback (\`gpt-5.5\`) attempts failed (codes 23 / 29). Last stderr: fallback backend unavailable; set RCS_EXPLORE_BIN to a working harness\n' "\${RCS_EXPLORE_SPARK_MODEL:-spark-test-model}" >&2
exit 1
`,
        );

        const result = await runExploreCommandForTest(wd, ['--prompt', 'validate failure guidance'], {
          RCS_EXPLORE_BIN: harnessStub,
          RCS_EXPLORE_SPARK_MODEL: 'spark-test-model',
        });

        assert.equal(result.exitCode, 1, result.stderr || result.stdout);
        assert.match(result.stderr, /fallback-attempt=model from=`spark-test-model` to=`gpt-5\.5` reason=spark_attempt_failed exit=23/);
        assert.match(result.stderr, /stdout fallback notice is emitted only after successful fallback output/);
        assert.doesNotMatch(result.stderr, /output includes a fallback notice/);
        assert.doesNotMatch(result.stdout, /## RCS Explore fallback/);
        assert.match(result.stderr, /spark model `spark-test-model` unavailable or failed \(exit 23\)/);
        assert.match(result.stderr, /spark stderr: spark backend unavailable; install the fallback runtime/);
        assert.match(
          result.stderr,
          /both spark \(`spark-test-model`\) and fallback \(`gpt-5\.5`\) attempts failed \(codes 23 \/ 29\)\. Last stderr: fallback backend unavailable; set RCS_EXPLORE_BIN to a working harness/,
        );
      });
    } finally {
      await rm(wd, { recursive: true, force: true });
    }
  });
});
