import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  isPlanningComplete,
  readApprovedExecutionLaunchHint,
  readLatestPlanningArtifacts,
  readPlanningArtifacts,
  readTeamDagArtifactResolution,
} from '../artifacts.js';
import { readTeamDagHandoffForLatestPlan } from '../../team/dag-schema.js';

let tempDir: string;

async function setup(): Promise<void> {
  tempDir = await mkdtemp(join(tmpdir(), 'rcs-planning-artifacts-'));
}

async function cleanup(): Promise<void> {
  if (tempDir && existsSync(tempDir)) {
    await rm(tempDir, { recursive: true, force: true });
  }
}

describe('planning artifacts', () => {
  beforeEach(async () => { await setup(); });
  afterEach(async () => { await cleanup(); });

  it('requires both PRD and test spec for planning completion', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-issue-827.md'), '# PRD\n');

    const artifacts = readPlanningArtifacts(tempDir);
    assert.equal(isPlanningComplete(artifacts), false);
    assert.equal(artifacts.prdPaths.length, 1);
    assert.equal(artifacts.testSpecPaths.length, 0);
  });


  it('resolves matching Team DAG sidecar before markdown handoff', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-repo-aware.md'),
      '# PRD\n\n## Team DAG Handoff\n```json\n{"source":"markdown"}\n```\n',
    );
    await writeFile(join(plansDir, 'test-spec-repo-aware.md'), '# Test Spec\n');
    await writeFile(join(plansDir, 'team-dag-repo-aware.json'), '{"source":"sidecar"}\n');

    const resolution = readTeamDagArtifactResolution(tempDir);

    assert.equal(resolution.source, 'json-sidecar');
    assert.equal(resolution.planSlug, 'repo-aware');
    assert.equal(resolution.artifactPath, join(plansDir, 'team-dag-repo-aware.json'));
    assert.equal(resolution.content, '{"source":"sidecar"}\n');
    assert.deepEqual(resolution.warnings, []);
  });

  it('falls back to embedded Team DAG handoff when sidecar is absent', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-repo-aware.md'),
      '# PRD\n\n## Team DAG Handoff\n```json\n{"nodes":[]}\n```\n',
    );
    await writeFile(join(plansDir, 'test-spec-repo-aware.md'), '# Test Spec\n');

    const resolution = readTeamDagArtifactResolution(tempDir);

    assert.equal(resolution.source, 'markdown-handoff');
    assert.equal(resolution.planSlug, 'repo-aware');
    assert.equal(resolution.content, '{"nodes":[]}');
    assert.equal(resolution.artifactPath, undefined);
  });

  it('returns none for Team DAG resolution when planning is incomplete', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-repo-aware.md'), '# PRD\n');

    const resolution = readTeamDagArtifactResolution(tempDir);

    assert.equal(resolution.source, 'none');
    assert.equal(resolution.prdPath, null);
    assert.equal(resolution.planSlug, null);
    assert.deepEqual(resolution.warnings, ['planning_incomplete']);
  });


  it('does not approve latest PRD launch hints without a matching test spec slug', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-alpha.md'), '# Alpha\n\nLaunch via rcs team 2:executor "Execute alpha"\n');
    await writeFile(join(plansDir, 'test-spec-other.md'), '# Other Test Spec\n');

    assert.equal(readApprovedExecutionLaunchHint(tempDir, 'team'), null);
  });

  it('does not resolve Team DAG artifacts without a matching test spec slug', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-repo-aware.md'), '# PRD\n');
    await writeFile(join(plansDir, 'test-spec-other.md'), '# Other Test Spec\n');
    await writeFile(join(plansDir, 'team-dag-repo-aware.json'), '{"source":"sidecar"}\n');

    const resolution = readTeamDagArtifactResolution(tempDir);

    assert.equal(resolution.source, 'none');
    assert.equal(resolution.planSlug, 'repo-aware');
    assert.deepEqual(resolution.warnings, ['missing_matching_test_spec']);
  });

  it('prefers timestamped PRD/test-spec pairs while keeping legacy artifacts compatible', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-legacy.md'),
      '# Legacy\n\nLaunch via rcs ralph "Execute legacy plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-legacy.md'), '# Legacy Test Spec\n');
    await writeFile(
      join(plansDir, 'prd-20260427T153000Z-alpha.md'),
      '# Old Alpha\n\nLaunch via rcs ralph "Execute old alpha plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Legacy Test Spec\n');
    await writeFile(
      join(plansDir, 'prd-20260427T153100Z-alpha.md'),
      '# New Alpha\n\nLaunch via rcs ralph "Execute new alpha plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-20260427T153100Z-alpha.md'), '# Alpha Timestamped Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-alpha.md'), '# Alpha Legacy Deep Interview\n');
    await writeFile(join(specsDir, 'deep-interview-20260427T153100Z-alpha.md'), '# Alpha Timestamped Deep Interview\n');
    await writeFile(join(specsDir, 'deep-interview-autoresearch-20260427T153100Z-alpha.md'), '# Autoresearch Draft\n');

    const selection = readLatestPlanningArtifacts(tempDir);
    assert.equal(selection.prdPath, join(plansDir, 'prd-20260427T153100Z-alpha.md'));
    assert.deepEqual(selection.testSpecPaths, [join(plansDir, 'test-spec-20260427T153100Z-alpha.md')]);
    assert.deepEqual(selection.deepInterviewSpecPaths, [
      join(specsDir, 'deep-interview-alpha.md'),
      join(specsDir, 'deep-interview-20260427T153100Z-alpha.md'),
    ]);

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute new alpha plan');
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-20260427T153100Z-alpha.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [
      join(specsDir, 'deep-interview-alpha.md'),
      join(specsDir, 'deep-interview-20260427T153100Z-alpha.md'),
    ]);

    const artifacts = readPlanningArtifacts(tempDir);
    assert.equal(isPlanningComplete(artifacts), true);
  });

  it('keeps legacy test-spec compatibility aliases for non-timestamped PRDs', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-alpha.md'),
      '# Alpha\n\nLaunch via rcs ralph "Execute alpha"\n',
    );
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(plansDir, 'testspec-alpha.md'), '# Alpha Compatibility Test Spec\n');
    await writeFile(join(plansDir, 'test-spec-20260427T153100Z-alpha.md'), '# Alpha Timestamped Test Spec\n');

    const selection = readLatestPlanningArtifacts(tempDir);
    assert.equal(selection.prdPath, join(plansDir, 'prd-alpha.md'));
    assert.deepEqual(selection.testSpecPaths, [
      join(plansDir, 'test-spec-alpha.md'),
      join(plansDir, 'testspec-alpha.md'),
    ]);

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.ok(hint);
    assert.deepEqual(hint?.testSpecPaths, [
      join(plansDir, 'test-spec-alpha.md'),
      join(plansDir, 'testspec-alpha.md'),
    ]);
  });

  it('fails closed for timestamped PRDs when only legacy slug test specs exist', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-20260427T153100Z-alpha.md'),
      '# Alpha\n\nLaunch via rcs ralph "Execute alpha"\n',
    );
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Legacy Test Spec\n');

    const artifacts = readPlanningArtifacts(tempDir);
    assert.equal(isPlanningComplete(artifacts), false);

    const selection = readLatestPlanningArtifacts(tempDir);
    assert.equal(selection.prdPath, join(plansDir, 'prd-20260427T153100Z-alpha.md'));
    assert.deepEqual(selection.testSpecPaths, []);

    assert.equal(readApprovedExecutionLaunchHint(tempDir, 'ralph'), null);

    const resolution = readTeamDagArtifactResolution(tempDir);
    assert.equal(resolution.source, 'none');
    assert.equal(resolution.prdPath, join(plansDir, 'prd-20260427T153100Z-alpha.md'));
    assert.equal(resolution.planSlug, '20260427T153100Z-alpha');
    assert.deepEqual(resolution.warnings, ['missing_matching_test_spec']);
  });


  it('parses $ralph aliases with single-quoted task text for approved launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-1072.md'),
      "# PRD\n\nLaunch via $ralph 'Execute approved issue 1072 plan'\n",
    );
    await writeFile(join(plansDir, 'test-spec-issue-1072.md'), '# Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-issue-1072.md'), '# Deep Interview Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.ok(hint);
    assert.equal(hint?.command, "$ralph 'Execute approved issue 1072 plan'");
    assert.equal(hint?.task, 'Execute approved issue 1072 plan');
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-issue-1072.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-issue-1072.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-issue-1072.md')]);
  });

  it('includes approved Ralph launch context with test and deep-interview artifacts', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-1072.md'),
      '# PRD\n\nLaunch via rcs ralph "Execute approved issue 1072 plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-issue-1072.md'), '# Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-issue-1072.md'), '# Deep Interview Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute approved issue 1072 plan');
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-issue-1072.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-issue-1072.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-issue-1072.md')]);
  });

  it('parses $team aliases with single-quoted task text for approved launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-1142.md'),
      "# PRD\n\nLaunch via $team ralph 4:debugger 'Execute approved issue 1142 plan'\n",
    );
    await writeFile(join(plansDir, 'test-spec-issue-1142.md'), '# Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-issue-1142.md'), '# Deep Interview Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');
    assert.ok(hint);
    assert.equal(hint?.command, "$team ralph 4:debugger 'Execute approved issue 1142 plan'");
    assert.equal(hint?.task, 'Execute approved issue 1142 plan');
    assert.equal(hint?.workerCount, 4);
    assert.equal(hint?.agentType, 'debugger');
    assert.equal(hint?.linkedRalph, true);
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-issue-1142.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-issue-1142.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-issue-1142.md')]);
  });

  it('includes approved team launch context with staffing and matching artifacts', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-1142.md'),
      '# PRD\n\nLaunch via rcs team ralph 4:debugger "Execute approved issue 1142 plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-issue-1142.md'), '# Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-issue-1142.md'), '# Deep Interview Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute approved issue 1142 plan');
    assert.equal(hint?.workerCount, 4);
    assert.equal(hint?.agentType, 'debugger');
    assert.equal(hint?.linkedRalph, true);
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-issue-1142.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-issue-1142.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-issue-1142.md')]);
  });

  it('binds approved team handoff context to the selected PRD slug in multi-plan repos', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-alpha.md'), '# Alpha\n\nLaunch via rcs team 2:executor "Execute alpha"\n');
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-alpha.md'), '# Alpha Deep Interview\n');
    await writeFile(join(plansDir, 'prd-zeta.md'), '# Zeta\n\nLaunch via rcs team 5 "Execute zeta"\n');
    await writeFile(join(plansDir, 'test-spec-zeta.md'), '# Zeta Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-zeta.md'), '# Zeta Deep Interview\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute zeta');
    assert.equal(hint?.workerCount, 5);
    assert.equal(hint?.agentType, undefined);
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-zeta.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-zeta.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-zeta.md')]);
  });

  it('binds approved handoff context to the selected PRD slug in multi-plan repos', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-alpha.md'), '# Alpha\n\nLaunch via rcs ralph "Execute alpha"\n');
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-alpha.md'), '# Alpha Deep Interview\n');
    await writeFile(join(plansDir, 'prd-zeta.md'), '# Zeta\n\nLaunch via rcs ralph "Execute zeta"\n');
    await writeFile(join(plansDir, 'test-spec-zeta.md'), '# Zeta Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-zeta.md'), '# Zeta Deep Interview\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute zeta');
    assert.equal(hint?.sourcePath, join(plansDir, 'prd-zeta.md'));
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-zeta.md')]);
    assert.deepEqual(hint?.deepInterviewSpecPaths, [join(specsDir, 'deep-interview-zeta.md')]);
  });

  it('binds approved launch hints to the requested prd path', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    const alphaPrdPath = join(plansDir, 'prd-alpha.md');
    await writeFile(alphaPrdPath, '# Alpha\n\nLaunch via rcs ralph "Execute alpha"\n');
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(plansDir, 'prd-zeta.md'), '# Zeta\n\nLaunch via rcs ralph "Execute zeta"\n');
    await writeFile(join(plansDir, 'test-spec-zeta.md'), '# Zeta Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph', { prdPath: alphaPrdPath });
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute alpha');
    assert.equal(hint?.sourcePath, alphaPrdPath);
    assert.deepEqual(hint?.testSpecPaths, [join(plansDir, 'test-spec-alpha.md')]);
  });

  it('honors the requested Ralph task when a single plan lists multiple Ralph launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-909.md'),
      [
        '# PRD',
        '',
        'Launch via rcs ralph "Execute alpha"',
        'Launch via rcs ralph "Execute beta"',
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-909.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph', { task: 'Execute alpha' });
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute alpha');
    assert.equal(hint?.command, 'rcs ralph "Execute alpha"');
  });

  it('fails closed for bare Ralph lookups when a single plan lists multiple Ralph launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-909-bare.md'),
      [
        '# PRD',
        '',
        'Launch via rcs ralph "Execute alpha"',
        'Launch via rcs ralph "Execute beta"',
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-909-bare.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');
    assert.equal(hint, null);
  });

  it('honors the requested team task when a single plan lists multiple team launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-910.md'),
      [
        '# PRD',
        '',
        'Launch via rcs team 2:executor "Execute alpha"',
        'Launch via rcs team 5:debugger "Execute beta"',
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-910.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team', { task: 'Execute alpha' });
    assert.ok(hint);
    assert.equal(hint?.task, 'Execute alpha');
    assert.equal(hint?.workerCount, 2);
    assert.equal(hint?.agentType, 'executor');
    assert.equal(hint?.command, 'rcs team 2:executor "Execute alpha"');
  });

  it('fails closed when a single plan repeats the same team task in multiple launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const prdPath = join(plansDir, 'prd-issue-910-duplicate.md');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      prdPath,
      [
        '# PRD',
        '',
        'Launch via rcs team 2:executor "Execute alpha"',
        'Launch via $team 5:debugger "Execute alpha"',
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-910-duplicate.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team', {
      prdPath,
      task: 'Execute alpha',
    });
    assert.equal(hint, null);
  });

  it('rehydrates the exact team launch hint by command when one PRD repeats the same task', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const sharedTask = 'Ship feature';
    const primaryCommand = `rcs team 2:executor ${JSON.stringify(sharedTask)}`;
    const secondaryCommand = `$team ralph 5:debugger ${JSON.stringify(sharedTask)}`;
    const prdPath = join(plansDir, 'prd-issue-910-command.md');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      prdPath,
      [
        '# Approved plan',
        '',
        `Launch via ${primaryCommand}`,
        `Launch via ${secondaryCommand}`,
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-910-command.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team', {
      prdPath,
      task: sharedTask,
      command: primaryCommand,
    });
    assert.ok(hint);
    assert.equal(hint?.command, primaryCommand);
    assert.equal(hint?.workerCount, 2);
    assert.equal(hint?.agentType, 'executor');
    assert.equal(hint?.linkedRalph, false);
  });

  it('fails closed for bare team lookups when a single plan lists multiple team launch hints', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-910-bare.md'),
      [
        '# PRD',
        '',
        'Launch via rcs team 2:executor "Execute alpha"',
        'Launch via rcs team 5:debugger "Execute beta"',
      ].join('\n'),
    );
    await writeFile(join(plansDir, 'test-spec-issue-910-bare.md'), '# Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');
    assert.equal(hint, null);
  });


  it('attaches bounded approved repository context from a matching latest-plan sidecar', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-issue-2039.md'),
      '# PRD\n\nLaunch via rcs team 3:executor "Execute approved issue 2039 plan"\n',
    );
    await writeFile(join(plansDir, 'test-spec-issue-2039.md'), '# Test Spec\n');
    await writeFile(join(plansDir, 'repo-context-issue-2039.md'), 'Key files: src/planning/artifacts.ts\n'.repeat(120));

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');

    assert.ok(hint?.repositoryContextSummary);
    assert.equal(hint.repositoryContextSummary.sourcePath, join(plansDir, 'repo-context-issue-2039.md'));
    assert.match(hint.repositoryContextSummary.content, /Key files: src\/planning\/artifacts\.ts/);
    assert.equal(hint.repositoryContextSummary.truncated, true);
    assert.ok(hint.repositoryContextSummary.content.split('\n').length <= 80);
  });

  it('prefers exact timestamped repository context sidecars for timestamped PRDs', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-20260427T153100Z-alpha.md'),
      '# Alpha\n\nLaunch via rcs team 2:executor "Execute alpha"\n',
    );
    await writeFile(join(plansDir, 'test-spec-20260427T153100Z-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(plansDir, 'repo-context-alpha.md'), 'stale alpha context\n');
    await writeFile(
      join(plansDir, 'repo-context-20260427T153100Z-alpha.md'),
      'fresh alpha context\n',
    );

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');

    assert.ok(hint?.repositoryContextSummary);
    assert.equal(
      hint.repositoryContextSummary.sourcePath,
      join(plansDir, 'repo-context-20260427T153100Z-alpha.md'),
    );
    assert.equal(hint.repositoryContextSummary.content, 'fresh alpha context');
  });

  it('does not attach stale repository context from a different PRD slug', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-alpha.md'), '# Alpha\n\nLaunch via rcs team 2:executor "Execute alpha"\n');
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test Spec\n');
    await writeFile(join(plansDir, 'repo-context-alpha.md'), 'stale alpha context\n');
    await writeFile(join(plansDir, 'prd-zeta.md'), '# Zeta\n\nLaunch via rcs team 3:executor "Execute zeta"\n');
    await writeFile(join(plansDir, 'test-spec-zeta.md'), '# Zeta Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'team');

    assert.ok(hint);
    assert.equal(hint.task, 'Execute zeta');
    assert.equal(hint.repositoryContextSummary, undefined);
  });

  it('falls back to an inline approved repository context section when no sidecar exists', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(
      join(plansDir, 'prd-inline.md'),
      '# PRD\n\nLaunch via rcs ralph "Execute inline"\n\n## Approved Repository Context Summary\n\n- Reuse src/cli/ralph.ts.\n\n## Verification\nRun tests.\n',
    );
    await writeFile(join(plansDir, 'test-spec-inline.md'), '# Inline Test Spec\n');

    const hint = readApprovedExecutionLaunchHint(tempDir, 'ralph');

    assert.ok(hint?.repositoryContextSummary);
    assert.equal(hint.repositoryContextSummary.sourcePath, join(plansDir, 'prd-inline.md'));
    assert.equal(hint.repositoryContextSummary.content, '- Reuse src/cli/ralph.ts.');
  });

  it('surfaces deep-interview specs for downstream traceability', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    const specsDir = join(tempDir, '.rcs', 'specs');
    await mkdir(plansDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-issue-827.md'), '# PRD\n');
    await writeFile(join(plansDir, 'test-spec-issue-827.md'), '# Test Spec\n');
    await writeFile(join(specsDir, 'deep-interview-issue-827.md'), '# Deep Interview Spec\n');

    const artifacts = readPlanningArtifacts(tempDir);
    assert.equal(isPlanningComplete(artifacts), true);
    assert.deepEqual(
      artifacts.deepInterviewSpecPaths.map((file) => file.split('/').pop()),
      ['deep-interview-issue-827.md'],
    );
  });

  it('loads a matching Team DAG sidecar for the latest PRD slug', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-alpha.md'), '# Alpha\n');
    await writeFile(join(plansDir, 'test-spec-alpha.md'), '# Alpha Test\n');
    await writeFile(join(plansDir, 'team-dag-alpha.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'impl', subject: 'Implement alpha', description: 'Implement alpha DAG' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'sidecar');
    assert.equal(result.planSlug, 'alpha');
    assert.equal(result.dag?.nodes[0]?.id, 'impl');
  });

  it('prefers exact timestamped Team DAG sidecars for timestamped PRDs', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-20260427T153100Z-alpha.md'), '# Alpha\n');
    await writeFile(join(plansDir, 'test-spec-20260427T153100Z-alpha.md'), '# Alpha Test\n');
    await writeFile(join(plansDir, 'team-dag-alpha.json'), '{"source":"stale"}\n');
    await writeFile(
      join(plansDir, 'team-dag-20260427T153100Z-alpha.json'),
      '{"source":"fresh"}\n',
    );

    const resolution = readTeamDagArtifactResolution(tempDir);

    assert.equal(resolution.source, 'json-sidecar');
    assert.equal(resolution.planSlug, '20260427T153100Z-alpha');
    assert.equal(
      resolution.artifactPath,
      join(plansDir, 'team-dag-20260427T153100Z-alpha.json'),
    );
    assert.equal(resolution.content, '{"source":"fresh"}\n');
    assert.deepEqual(resolution.warnings, []);
  });

  it('does not overmatch sidecars for a different slug prefix', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-foo.md'), '# Foo\n');
    await writeFile(join(plansDir, 'test-spec-foo.md'), '# Foo Test\n');
    await writeFile(join(plansDir, 'team-dag-foobar.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'wrong', subject: 'Wrong slug', description: 'Must not match foo' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'none');
    assert.equal(result.planSlug, 'foo');
    assert.equal(result.dag, null);
  });

  it('prefers sidecar DAG over embedded PRD Team DAG Handoff block', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-beta.md'), '# Beta\n\n## Team DAG Handoff\n```json\n{"schema_version":1,"nodes":[{"id":"markdown","subject":"Markdown"}]}\n```\n');
    await writeFile(join(plansDir, 'test-spec-beta.md'), '# Beta Test\n');
    await writeFile(join(plansDir, 'team-dag-beta.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'sidecar', subject: 'Sidecar wins', description: 'Sidecar DAG' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'sidecar');
    assert.equal(result.dag?.nodes[0]?.id, 'sidecar');
  });

  it('reports multiple matching sidecars and chooses the lexicographically latest', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-gamma.md'), '# Gamma\n');
    await writeFile(join(plansDir, 'test-spec-gamma.md'), '# Gamma Test\n');
    await writeFile(join(plansDir, 'team-dag-gamma-a.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'old', subject: 'Old', description: 'Old DAG' }],
    }));
    await writeFile(join(plansDir, 'team-dag-gamma-z.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'new', subject: 'New', description: 'New DAG' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.warning, 'multiple_matches');
    assert.equal(result.dag?.nodes[0]?.id, 'new');
  });


  it('does not load a Team DAG handoff when the latest PRD lacks a matching test spec', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-epsilon.md'), '# Epsilon\n');
    await writeFile(join(plansDir, 'test-spec-other.md'), '# Other Test\n');
    await writeFile(join(plansDir, 'team-dag-epsilon.json'), JSON.stringify({
      schema_version: 1,
      nodes: [{ id: 'impl', subject: 'Implement epsilon', description: 'Implement epsilon DAG' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'none');
    assert.equal(result.dag, null);
    assert.equal(result.error, 'missing_matching_test_spec');
  });

  it('rejects a Team DAG sidecar whose declared plan_slug does not match the latest PRD', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-zeta.md'), '# Zeta\n');
    await writeFile(join(plansDir, 'test-spec-zeta.md'), '# Zeta Test\n');
    await writeFile(join(plansDir, 'team-dag-zeta.json'), JSON.stringify({
      schema_version: 1,
      plan_slug: 'other',
      nodes: [{ id: 'impl', subject: 'Implement zeta', description: 'Implement zeta DAG' }],
    }));

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'sidecar');
    assert.equal(result.dag, null);
    assert.match(result.error ?? '', /does not match/);
  });

  it('fails open with explicit parse error metadata for malformed DAG sidecars', async () => {
    const plansDir = join(tempDir, '.rcs', 'plans');
    await mkdir(plansDir, { recursive: true });
    await writeFile(join(plansDir, 'prd-delta.md'), '# Delta\n');
    await writeFile(join(plansDir, 'test-spec-delta.md'), '# Delta Test\n');
    await writeFile(join(plansDir, 'team-dag-delta.json'), '{bad json');

    const result = readTeamDagHandoffForLatestPlan(tempDir);
    assert.equal(result.source, 'sidecar');
    assert.equal(result.dag, null);
    assert.match(result.error ?? '', /JSON|property/i);
  });

});
