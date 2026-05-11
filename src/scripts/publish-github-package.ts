#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

interface PackageJson {
  name?: string;
  version?: string;
  publishConfig?: Record<string, unknown>;
  repository?: string | { url?: string; [key: string]: unknown };
}

interface PackageLockJson {
  name?: string;
  version?: string;
  packages?: Record<string, { name?: string; version?: string; [key: string]: unknown }>;
}

function normalizeScopeOwner(owner: string): string {
  return owner.trim().toLowerCase();
}

function resolveRepositoryUrl(pkg: PackageJson): string {
  if (typeof pkg.repository === 'string') return pkg.repository;
  if (pkg.repository && typeof pkg.repository === 'object' && typeof pkg.repository.url === 'string') {
    return pkg.repository.url;
  }
  throw new Error('github_packages_publish_requires_repository_url');
}

function resolveGitHubOwner(pkg: PackageJson): string {
  const repositoryUrl = resolveRepositoryUrl(pkg);
  const match = repositoryUrl.match(/github\.com[:/](.+?)\/(.+?)(?:\.git)?$/i);
  if (!match?.[1]) {
    throw new Error(`unable_to_resolve_github_owner_from_repository:${repositoryUrl}`);
  }
  return normalizeScopeOwner(match[1]);
}

function resolvePackageBaseName(pkg: PackageJson): string {
  const name = (pkg.name ?? '').trim();
  if (!name) throw new Error('github_packages_publish_requires_package_name');
  const last = name.split('/').at(-1);
  if (!last) throw new Error('github_packages_publish_requires_package_name');
  return last;
}

function buildGitHubPackagesName(pkg: PackageJson): string {
  return `@${resolveGitHubOwner(pkg)}/${resolvePackageBaseName(pkg)}`;
}

function main(): void {
  const root = process.cwd();
  const dryRun = process.argv.includes('--dry-run');
  const packagePath = join(root, 'package.json');
  const lockPath = join(root, 'package-lock.json');

  const originalPackage = readFileSync(packagePath, 'utf8');
  const originalLock = readFileSync(lockPath, 'utf8');

  const pkg = JSON.parse(originalPackage) as PackageJson;
  const lock = JSON.parse(originalLock) as PackageLockJson;
  const githubPackageName = buildGitHubPackagesName(pkg);

  pkg.name = githubPackageName;
  pkg.publishConfig = {
    ...(pkg.publishConfig ?? {}),
    registry: 'https://npm.pkg.github.com',
  };

  lock.name = githubPackageName;
  if (lock.packages?.['']) {
    lock.packages[''].name = githubPackageName;
  }

  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

  try {
    const args = ['publish', ...(dryRun ? ['--dry-run'] : [])];
    const result = spawnSync('npm', args, {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  } finally {
    writeFileSync(packagePath, originalPackage);
    writeFileSync(lockPath, originalLock);
  }
}

main();
