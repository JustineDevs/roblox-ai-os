#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import TOML from '@iarna/toml';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')) as Record<string, unknown>;
const workspace = TOML.parse(readFileSync(join(root, 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const explore = TOML.parse(readFileSync(join(root, 'crates', 'rcs-explore', 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const runtimeCore = TOML.parse(readFileSync(join(root, 'crates', 'rcs-runtime-core', 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const mux = TOML.parse(readFileSync(join(root, 'crates', 'rcs-mux', 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const runtime = TOML.parse(readFileSync(join(root, 'native', 'rcs-runtime', 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const sparkshell = TOML.parse(readFileSync(join(root, 'native', 'rcs-sparkshell', 'Cargo.toml'), 'utf-8')) as Record<string, unknown>;
const tagArgIndex = process.argv.indexOf('--tag');
const tag = tagArgIndex >= 0 ? process.argv[tagArgIndex + 1] : undefined;

const pkgVersion = String(pkg.version || '').trim();
const workspaceVersion = String((workspace.workspace as Record<string, unknown>)?.package as Record<string, unknown> !== undefined ? ((workspace.workspace as Record<string, unknown>).package as Record<string, unknown>)?.version || '' : '').trim();
const problems: string[] = [];

if (!pkgVersion) problems.push('package.json version is missing');
if (!workspaceVersion) problems.push('Cargo.toml [workspace.package].version is missing');
if (pkgVersion && workspaceVersion && pkgVersion !== workspaceVersion) {
  problems.push(`package.json version (${pkgVersion}) does not match workspace version (${workspaceVersion})`);
}
if ((explore.package as Record<string, unknown>)?.version !== undefined && ((explore.package as Record<string, unknown>).version as Record<string, unknown>)?.workspace !== true) {
  problems.push('crates/rcs-explore/Cargo.toml must use version.workspace = true');
}
if ((runtimeCore.package as Record<string, unknown>)?.version !== undefined && ((runtimeCore.package as Record<string, unknown>).version as Record<string, unknown>)?.workspace !== true) {
  problems.push('crates/rcs-runtime-core/Cargo.toml must use version.workspace = true');
}
if ((mux.package as Record<string, unknown>)?.version !== undefined && ((mux.package as Record<string, unknown>).version as Record<string, unknown>)?.workspace !== true) {
  problems.push('crates/rcs-mux/Cargo.toml must use version.workspace = true');
}
if ((runtime.package as Record<string, unknown>)?.version !== undefined && ((runtime.package as Record<string, unknown>).version as Record<string, unknown>)?.workspace !== true) {
  problems.push('native/rcs-runtime/Cargo.toml must use version.workspace = true');
}
if ((sparkshell.package as Record<string, unknown>)?.version !== undefined && ((sparkshell.package as Record<string, unknown>).version as Record<string, unknown>)?.workspace !== true) {
  problems.push('native/rcs-sparkshell/Cargo.toml must use version.workspace = true');
}
if (tag && tag !== `v${pkgVersion}`) {
  problems.push(`release tag (${tag}) does not match package.json version (v${pkgVersion})`);
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`[version-sync] ${problem}`);
  process.exit(1);
}

console.log(`[version-sync] OK package=${pkgVersion} workspace=${workspaceVersion}${tag ? ` tag=${tag}` : ''}`);
