#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { generateReleaseBody } from './generate-release-body.js';

interface Options {
  repo: string;
  tags: string[];
  all: boolean;
  prerelease: boolean;
  checkOnly: boolean;
}

function usage(): never {
  console.error(
    'Usage: node dist/scripts/backfill-github-releases.js --repo <owner/name> [--tag <vX>] [--all] [--prerelease] [--check-only]',
  );
  process.exit(1);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function runGit(args: string[], cwd: string): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return String(result.stdout || '').trim();
}

function runGh(args: string[], cwd: string): string {
  const result = spawnSync('gh', args, { cwd, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`gh ${args.join(' ')} failed: ${(result.stderr || result.stdout || '').trim()}`);
  }
  return String(result.stdout || '').trim();
}

function parseArgs(): Options {
  const repo = arg('--repo');
  if (!repo) usage();
  const tag = arg('--tag');
  const all = process.argv.includes('--all');
  const prerelease = process.argv.includes('--prerelease');
  const checkOnly = process.argv.includes('--check-only');
  if (!tag && !all) usage();
  return {
    repo,
    tags: tag ? [tag] : [],
    all,
    prerelease,
    checkOnly,
  };
}

function resolveAllTags(cwd: string): string[] {
  return runGit(['tag', '--list', 'v*', '--sort=v:refname'], cwd)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function releaseExists(repo: string, tag: string, cwd: string): boolean {
  const result = spawnSync(
    'gh',
    ['release', 'view', tag, '--repo', repo, '--json', 'tagName'],
    { cwd, encoding: 'utf8', stdio: 'pipe' },
  );
  return result.status === 0;
}

function resolveTemplatePath(cwd: string, tag: string): string {
  const version = tag.replace(/^v/, '');
  const versioned = join(cwd, `docs/release-notes-v${version}.md`);
  if (existsSync(versioned)) return versioned;
  return join(cwd, 'RELEASE_BODY.md');
}

async function main(): Promise<void> {
  const cwd = resolve(process.cwd());
  const options = parseArgs();
  const tags = options.all ? resolveAllTags(cwd) : options.tags;
  const tempDir = mkdtempSync(join(tmpdir(), 'rcs-release-backfill-'));
  try {
    for (const tag of tags) {
      const templatePath = resolveTemplatePath(cwd, tag);
      const outPath = join(tempDir, `${tag}.md`);
      if (templatePath.endsWith('RELEASE_BODY.md')) {
        await generateReleaseBody({
          cwd,
          templatePath: 'RELEASE_BODY.md',
          outPath,
          currentTag: tag,
          repo: options.repo,
        });
      } else {
        writeFileSync(outPath, readFileSync(templatePath, 'utf8'));
      }

      const exists = releaseExists(options.repo, tag, cwd);
      if (options.checkOnly) {
        console.log(`${tag}: ${exists ? 'release-exists' : 'release-missing'} -> ${templatePath}`);
        continue;
      }
      if (exists) {
        runGh(
          ['release', 'edit', tag, '--repo', options.repo, '--title', tag, '--notes-file', outPath],
          cwd,
        );
        console.log(`${tag}: updated release`);
        continue;
      }
      const args = [
        'release',
        'create',
        tag,
        '--repo',
        options.repo,
        '--verify-tag',
        '--title',
        tag,
        '--notes-file',
        outPath,
      ];
      if (options.prerelease) args.push('--prerelease');
      runGh(args, cwd);
      console.log(`${tag}: created release`);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

if (process.argv[1]?.endsWith('backfill-github-releases.js')) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
