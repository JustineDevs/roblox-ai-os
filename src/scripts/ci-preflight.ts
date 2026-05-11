#!/usr/bin/env node
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnPlatformCommandSync } from '../utils/platform-command.js';

export type CiPreflightMode = 'full' | 'quick';

export interface CiPreflightStage {
  id: string;
  label: string;
  command: string;
  args: string[];
  modes: CiPreflightMode[];
}

export const CI_PREFLIGHT_STAGES: readonly CiPreflightStage[] = [
  { id: 'rustfmt', label: 'Rust formatting', command: 'cargo', args: ['fmt', '--all', '--check'], modes: ['full'] },
  { id: 'clippy', label: 'Rust clippy', command: 'cargo', args: ['clippy', '--workspace', '--all-targets', '--', '-D', 'warnings'], modes: ['full'] },
  { id: 'lint', label: 'Biome lint', command: 'npm', args: ['run', 'lint'], modes: ['full', 'quick'] },
  { id: 'tsc-noemit', label: 'TypeScript noEmit', command: 'npx', args: ['tsc', '--noEmit'], modes: ['full', 'quick'] },
  { id: 'check-no-unused', label: 'TypeScript no-unused', command: 'npm', args: ['run', 'check:no-unused'], modes: ['full', 'quick'] },
  { id: 'build', label: 'Build dist', command: 'npm', args: ['run', 'build'], modes: ['full', 'quick'] },
  { id: 'sync-release-notes-check', label: 'Release notes sync check', command: 'npm', args: ['run', 'sync:release-notes:check'], modes: ['full', 'quick'] },
  { id: 'verify-native-agents', label: 'Verify native agents', command: 'node', args: ['dist/scripts/verify-native-agents.js'], modes: ['full', 'quick'] },
  { id: 'verify-plugin-bundle', label: 'Verify plugin bundle', command: 'node', args: ['dist/scripts/sync-plugin-mirror.js', '--check'], modes: ['full', 'quick'] },
  { id: 'team-state-runtime', label: 'Test lane: team/state/runtime', command: 'node', args: ['dist/scripts/run-test-files.js', 'dist/team/__tests__', 'dist/state/__tests__', 'dist/forge/__tests__', 'dist/blueprint/__tests__', 'dist/runtime/__tests__'], modes: ['full', 'quick'] },
  { id: 'hooks-notify-platform', label: 'Test lane: hooks/notify/platform', command: 'node', args: ['dist/scripts/run-test-files.js', 'dist/hooks/__tests__', 'dist/hooks/code-simplifier/__tests__', 'dist/hooks/extensibility/__tests__', 'dist/notifications/__tests__', 'dist/mcp/__tests__', 'dist/hud/__tests__', 'dist/verification/__tests__', 'dist/openclaw/__tests__'], modes: ['full'] },
  { id: 'cli-core-rest', label: 'Test lane: cli/core/rest', command: 'node', args: ['dist/scripts/run-test-files.js', 'dist/cli/__tests__', 'dist/agents/__tests__', 'dist/autoresearch/__tests__', 'dist/catalog/__tests__', 'dist/compat/__tests__', 'dist/config/__tests__', 'dist/modes/__tests__', 'dist/pipeline/__tests__', 'dist/planning/__tests__', 'dist/scripts/__tests__', 'dist/session-history/__tests__', 'dist/subagents/__tests__', 'dist/utils/__tests__', 'dist/visual/__tests__'], modes: ['full'] },
  { id: 'catalog-check', label: 'Generated catalog docs check', command: 'node', args: ['dist/scripts/generate-catalog-docs.js', '--check'], modes: ['full'] },
  { id: 'smoke-cross-rebase', label: 'Smoke: cross-rebase', command: 'npm', args: ['run', 'test:team:cross-rebase-smoke:compiled'], modes: ['full'] },
  { id: 'smoke-remaining', label: 'Smoke: remaining suite', command: 'node', args: ['--test', 'dist/cli/__tests__/packaged-script-resolution.test.js', 'dist/cli/__tests__/package-bin-contract.test.js', 'dist/cli/__tests__/explore.test.js', 'dist/cli/__tests__/sparkshell-cli.test.js', 'dist/hooks/__tests__/explore-routing.test.js', 'dist/hooks/__tests__/explore-sparkshell-guidance-contract.test.js', 'dist/scripts/__tests__/smoke-packed-install.test.js', 'dist/verification/__tests__/explore-harness-release-workflow.test.js', 'dist/compat/__tests__/*.test.js'], modes: ['full'] },
  { id: 'coverage-team-critical', label: 'Coverage: team critical', command: 'npm', args: ['run', 'coverage:team-critical:compiled'], modes: ['full'] },
  { id: 'coverage-ts-full', label: 'Coverage: TypeScript full', command: 'npm', args: ['run', 'coverage:ts:full:compiled'], modes: ['full'] },
];

export interface CiPreflightOptions {
  mode: CiPreflightMode;
  only: string[] | null;
  cwd?: string;
}

function usage(): never {
  console.error(
    'Usage: node dist/scripts/ci-preflight.js [--mode full|quick] [--only <stage-id>[,<stage-id>...]] [--list]',
  );
  process.exit(1);
}

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function parseArgs(): CiPreflightOptions & { list: boolean } {
  const modeRaw = arg('--mode') ?? 'full';
  if (modeRaw !== 'full' && modeRaw !== 'quick') usage();
  const only = arg('--only');
  return {
    mode: modeRaw,
    only: only ? only.split(',').map((value) => value.trim()).filter(Boolean) : null,
    list: process.argv.includes('--list'),
  };
}

export function resolveCiPreflightStages(options: CiPreflightOptions): CiPreflightStage[] {
  const stages = CI_PREFLIGHT_STAGES.filter((stage) => stage.modes.includes(options.mode));
  if (!options.only || options.only.length === 0) return stages;
  const selected = stages.filter((stage) => options.only?.includes(stage.id));
  if (selected.length !== options.only.length) {
    const missing = options.only.filter((id) => !selected.some((stage) => stage.id === id));
    throw new Error(`ci_preflight_unknown_stage:${missing.join(',')}`);
  }
  return selected;
}

function printStageList(): void {
  for (const stage of CI_PREFLIGHT_STAGES) {
    console.log(`${stage.id}\t${stage.modes.join(',')}\t${stage.command} ${stage.args.join(' ')}`);
  }
}

export function runCiPreflight(options: CiPreflightOptions): void {
  const cwd = resolve(options.cwd ?? process.cwd());
  const stages = resolveCiPreflightStages(options);
  for (const stage of stages) {
    console.log(`\n[ci-preflight] ${stage.id}: ${stage.label}`);
    const { result } = spawnPlatformCommandSync(
      stage.command,
      stage.args,
      { cwd, encoding: 'utf-8', stdio: 'inherit' as const },
    );
    if (result.status !== 0) {
      throw new Error(`ci_preflight_failed:${stage.id}:${result.status ?? 1}`);
    }
    if (result.error) {
      throw result.error;
    }
  }
}

function main(): void {
  const parsed = parseArgs();
  if (parsed.list) {
    printStageList();
    return;
  }
  runCiPreflight(parsed);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
