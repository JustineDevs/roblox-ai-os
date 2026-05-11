#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MANAGED_START = '<!-- RCS:RELEASE-NOTES:START -->';
const MANAGED_END = '<!-- RCS:RELEASE-NOTES:END -->';

interface Options {
  version: string;
  date: string;
  templatePath: string;
  outPath: string;
  check: boolean;
}

function usage(): never {
  console.error(
    'Usage: node dist/scripts/sync-release-notes.js [--version <x.y.z>] [--date <YYYY-MM-DD>] [--template <path>] [--out <path>] [--check]',
  );
  process.exit(1);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function parseVersionFromPackageJson(cwd: string): string {
  const pkgPath = join(cwd, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string };
  if (!pkg.version || typeof pkg.version !== 'string') {
    throw new Error('release_notes_sync_requires_package_version');
  }
  return pkg.version;
}

function parseArgs(cwd: string): Options {
  const unknownArgs = process.argv.slice(2).filter((value, index, array) => {
    if (['--check', '--version', '--date', '--template', '--out'].includes(value)) return false;
    const previous = array[index - 1];
    if (['--version', '--date', '--template', '--out'].includes(previous ?? '')) return false;
    return true;
  });
  if (unknownArgs.length > 0) usage();

  const version = arg('--version') ?? parseVersionFromPackageJson(cwd);
  const date = arg('--date') ?? new Date().toISOString().slice(0, 10);
  const templatePath = arg('--template') ?? 'docs/release/release-notes-template.md';
  const outPath = arg('--out') ?? `docs/release/release-notes-v${version}.md`;
  const check = process.argv.includes('--check');
  return { version, date, templatePath, outPath, check };
}

function renderTemplate(template: string, version: string, date: string): string {
  return template
    .replaceAll('{{VERSION}}', version)
    .replaceAll('{{DATE}}', date);
}

function extractManagedBlock(content: string): string {
  const start = content.indexOf(MANAGED_START);
  const end = content.indexOf(MANAGED_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error('release_notes_sync_missing_managed_markers');
  }
  return content.slice(start, end + MANAGED_END.length).trim();
}

function replaceManagedBlock(existing: string, nextManagedBlock: string): string {
  const start = existing.indexOf(MANAGED_START);
  const end = existing.indexOf(MANAGED_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error('release_notes_sync_missing_managed_markers');
  }
  return `${existing.slice(0, start)}${nextManagedBlock}${existing.slice(end + MANAGED_END.length)}`;
}

export function syncReleaseNotes(options: Options, cwd = process.cwd()): {
  changed: boolean;
  outPath: string;
} {
  const templatePath = resolve(cwd, options.templatePath);
  const outPath = resolve(cwd, options.outPath);
  const rendered = renderTemplate(readFileSync(templatePath, 'utf8'), options.version, options.date).trimEnd() + '\n';
  const managedBlock = extractManagedBlock(rendered);

  if (!existsSync(outPath)) {
    if (options.check) {
      throw new Error(`release_notes_sync_out_of_date:missing:${options.outPath}`);
    }
    writeFileSync(outPath, rendered);
    return { changed: true, outPath };
  }

  const existing = readFileSync(outPath, 'utf8');
  const next = replaceManagedBlock(existing, managedBlock);
  if (next === existing) {
    return { changed: false, outPath };
  }
  if (options.check) {
    throw new Error(`release_notes_sync_out_of_date:stale:${options.outPath}`);
  }
  writeFileSync(outPath, next);
  return { changed: true, outPath };
}

function main(): void {
  const cwd = resolve(process.cwd());
  const options = parseArgs(cwd);
  const result = syncReleaseNotes(options, cwd);
  console.log(`${options.check ? 'checked' : 'synced'} ${result.outPath}`);
}

if (process.argv[1]?.endsWith('sync-release-notes.js')) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
