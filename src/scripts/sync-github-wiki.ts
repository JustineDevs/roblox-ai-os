#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const MANIFEST_NAME = '.rcs-wiki-sync-manifest.json';

interface Options {
  sourceDir: string;
  outDir: string;
  branch: string;
  repoUrl?: string;
  check: boolean;
}

interface SyncResult {
  changed: boolean;
  writtenFiles: string[];
  deletedFiles: string[];
}

interface SyncManifest {
  managedFiles: string[];
}

function usage(): never {
  console.error(
    'Usage: node dist/scripts/sync-github-wiki.js [--source <dir>] [--out <dir>] [--branch <name>] [--repo-url <https://github.com/owner/repo>] [--check]',
  );
  process.exit(1);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function normalizeSlashes(value: string): string {
  return value.replaceAll('\\', '/');
}

function normalizeRepoUrl(value: string): string {
  return value.replace(/^git\+/, '').replace(/\.git$/, '');
}

function isSubpath(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && rel !== '..');
}

function loadRepositoryUrl(cwd: string): string {
  if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY) {
    return `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`;
  }
  const pkgPath = join(cwd, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
    repository?: { url?: string } | string;
  };
  const repository = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  if (!repository) {
    throw new Error('github_wiki_sync_requires_repository_url');
  }
  return normalizeRepoUrl(repository).replace(/^git:/, 'https:');
}

function parseArgs(cwd: string): Options {
  const unknownArgs = process.argv.slice(2).filter((value, index, array) => {
    if (['--check', '--source', '--out', '--branch', '--repo-url'].includes(value)) return false;
    const previous = array[index - 1];
    if (['--source', '--out', '--branch', '--repo-url'].includes(previous ?? '')) return false;
    return true;
  });
  if (unknownArgs.length > 0) usage();
  return {
    sourceDir: arg('--source') ?? 'docs/wiki',
    outDir: arg('--out') ?? '.tmp/github-wiki',
    branch: arg('--branch') ?? 'main',
    repoUrl: arg('--repo-url') ?? loadRepositoryUrl(cwd),
    check: process.argv.includes('--check'),
  };
}

function walkMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);
    if (stats.isDirectory()) {
      results.push(...walkMarkdownFiles(entryPath));
      continue;
    }
    if (stats.isFile() && entry.toLowerCase().endsWith('.md')) {
      results.push(entryPath);
    }
  }
  return results.sort((left, right) => left.localeCompare(right));
}

function loadManifest(outDir: string): SyncManifest {
  const manifestPath = join(outDir, MANIFEST_NAME);
  if (!existsSync(manifestPath)) return { managedFiles: [] };
  return JSON.parse(readFileSync(manifestPath, 'utf8')) as SyncManifest;
}

function splitHash(target: string): { path: string; hash: string } {
  const index = target.indexOf('#');
  if (index === -1) return { path: target, hash: '' };
  return {
    path: target.slice(0, index),
    hash: target.slice(index),
  };
}

function rewriteMarkdownLinks(
  content: string,
  sourceFile: string,
  sourceRoot: string,
  repoRoot: string,
  repoUrl: string,
  branch: string,
): string {
  return content.replaceAll(/(!?\[[^\]]*]\()([^)]+)(\))/g, (full, prefix, rawTarget, suffix) => {
    const wrapped = String(rawTarget);
    const target = wrapped.startsWith('<') && wrapped.endsWith('>') ? wrapped.slice(1, -1) : wrapped;
    if (
      target === '' ||
      target.startsWith('#') ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:')
    ) {
      return full;
    }

    const { path, hash } = splitHash(target);
    const resolved = resolve(dirname(sourceFile), path);

    if (isSubpath(sourceRoot, resolved) && resolved.toLowerCase().endsWith('.md')) {
      const wikiPage = normalizeSlashes(relative(sourceRoot, resolved)).replace(/\.md$/i, '');
      const rewritten = `${repoUrl}/wiki/${encodeURI(wikiPage)}${hash}`;
      return `${prefix}${rewritten}${suffix}`;
    }

    if (isSubpath(repoRoot, resolved)) {
      const repoPath = normalizeSlashes(relative(repoRoot, resolved));
      const rewritten = `${repoUrl}/blob/${branch}/${repoPath}${hash}`;
      return `${prefix}${rewritten}${suffix}`;
    }

    return full;
  });
}

function renderWikiPage(
  content: string,
  sourceFile: string,
  sourceRoot: string,
  repoRoot: string,
  repoUrl: string,
  branch: string,
): string {
  const repoRelative = normalizeSlashes(relative(repoRoot, sourceFile));
  const rewritten = rewriteMarkdownLinks(content, sourceFile, sourceRoot, repoRoot, repoUrl, branch).trimEnd();
  return `<!-- Generated from ${repoRelative}; edit the source file instead. -->\n\n${rewritten}\n`;
}

function ensureParentDir(path: string): void {
  mkdirSync(dirname(path), { recursive: true });
}

export function syncGithubWiki(options: Options, cwd = process.cwd()): SyncResult {
  const repoRoot = resolve(cwd);
  const sourceRoot = resolve(repoRoot, options.sourceDir);
  const outDir = resolve(repoRoot, options.outDir);
  const repoUrl = normalizeRepoUrl(options.repoUrl ?? loadRepositoryUrl(repoRoot));
  if (!existsSync(sourceRoot)) {
    throw new Error(`github_wiki_sync_missing_source:${options.sourceDir}`);
  }

  const sourceFiles = walkMarkdownFiles(sourceRoot);
  if (sourceFiles.length === 0) {
    throw new Error(`github_wiki_sync_empty_source:${options.sourceDir}`);
  }

  const previousManifest = loadManifest(outDir);
  const nextManagedFiles = new Set<string>();
  const writtenFiles: string[] = [];
  const deletedFiles: string[] = [];
  let changed = false;

  for (const sourceFile of sourceFiles) {
    const rel = normalizeSlashes(relative(sourceRoot, sourceFile));
    const outPath = join(outDir, rel);
    const nextContent = renderWikiPage(
      readFileSync(sourceFile, 'utf8'),
      sourceFile,
      sourceRoot,
      repoRoot,
      repoUrl,
      options.branch,
    );
    nextManagedFiles.add(rel);
    const currentContent = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
    if (currentContent === nextContent) continue;
    changed = true;
    writtenFiles.push(rel);
    if (!options.check) {
      ensureParentDir(outPath);
      writeFileSync(outPath, nextContent);
    }
  }

  for (const stale of previousManifest.managedFiles) {
    if (nextManagedFiles.has(stale)) continue;
    const stalePath = join(outDir, stale);
    if (!existsSync(stalePath)) continue;
    changed = true;
    deletedFiles.push(stale);
    if (!options.check) {
      rmSync(stalePath, { force: true });
    }
  }

  const manifest = JSON.stringify(
    {
      managedFiles: [...nextManagedFiles].sort(),
    },
    null,
    2,
  ) + '\n';
  const manifestPath = join(outDir, MANIFEST_NAME);
  const currentManifest = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : null;
  if (currentManifest !== manifest) {
    changed = true;
    writtenFiles.push(MANIFEST_NAME);
    if (!options.check) {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(manifestPath, manifest);
    }
  }

  if (options.check && changed) {
    throw new Error(
      `github_wiki_sync_out_of_date:write=${writtenFiles.join(',') || 'none'}:delete=${deletedFiles.join(',') || 'none'}`,
    );
  }

  return { changed, writtenFiles, deletedFiles };
}

function main(): void {
  const cwd = resolve(process.cwd());
  const options = parseArgs(cwd);
  const result = syncGithubWiki(options, cwd);
  console.log(
    `${options.check ? 'checked' : 'synced'} ${options.outDir} writes=${result.writtenFiles.length} deletes=${result.deletedFiles.length}`,
  );
}

if (process.argv[1]?.endsWith('sync-github-wiki.js')) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
