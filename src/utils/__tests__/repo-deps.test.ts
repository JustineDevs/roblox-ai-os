import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  ensureReusableNodeModules,
  hasUsableNodeModules,
  resolveGitCommonDir,
  resolveReusableNodeModulesSource,
} from '../repo-deps.js';

test('resolveGitCommonDir resolves relative git common dir output against cwd', () => {
  const commonDir = resolveGitCommonDir('/tmp/worktree', () => ({
    status: 0,
    stdout: '../primary/.git\n',
    stderr: '',
  }) as any);
  assert.equal(commonDir, '/tmp/primary/.git');
});

test('hasUsableNodeModules requires core dependency markers', async () => {
  const root = await mkdtemp(join(tmpdir(), 'rcs-repo-deps-'));
  try {
    const nodeModules = join(root, 'node_modules');
    await mkdir(join(nodeModules, 'typescript'), { recursive: true });
    await mkdir(join(nodeModules, '@iarna', 'toml'), { recursive: true });
    await mkdir(join(nodeModules, '@modelcontextprotocol', 'sdk'), { recursive: true });
    await mkdir(join(nodeModules, 'zod'), { recursive: true });
    await writeFile(join(nodeModules, 'typescript', 'package.json'), '{}');
    await writeFile(join(nodeModules, '@iarna', 'toml', 'package.json'), '{}');
    await writeFile(join(nodeModules, '@modelcontextprotocol', 'sdk', 'package.json'), '{}');
    await writeFile(join(nodeModules, 'zod', 'package.json'), '{}');
    assert.equal(hasUsableNodeModules(root), true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('resolveReusableNodeModulesSource returns parent repo node_modules for worktrees', async () => {
  const root = await mkdtemp(join(tmpdir(), 'rcs-reuse-node-modules-'));
  try {
    const primaryRepo = join(root, 'primary');
    const worktreeRepo = join(root, 'worktree');
    await mkdir(join(primaryRepo, 'node_modules', 'typescript'), { recursive: true });
    await mkdir(join(primaryRepo, 'node_modules', '@iarna', 'toml'), { recursive: true });
    await mkdir(join(primaryRepo, 'node_modules', '@modelcontextprotocol', 'sdk'), { recursive: true });
    await mkdir(join(primaryRepo, 'node_modules', 'zod'), { recursive: true });
    await writeFile(join(primaryRepo, 'node_modules', 'typescript', 'package.json'), '{}');
    await writeFile(join(primaryRepo, 'node_modules', '@iarna', 'toml', 'package.json'), '{}');
    await writeFile(join(primaryRepo, 'node_modules', '@modelcontextprotocol', 'sdk', 'package.json'), '{}');
    await writeFile(join(primaryRepo, 'node_modules', 'zod', 'package.json'), '{}');
    await mkdir(worktreeRepo, { recursive: true });

    const reusable = resolveReusableNodeModulesSource(worktreeRepo, () => ({
      status: 0,
      stdout: `${join(primaryRepo, '.git')}\n`,
      stderr: '',
    }) as any);

    assert.equal(reusable, join(primaryRepo, 'node_modules'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ensureReusableNodeModules returns warning when no reusable parent dependencies exist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'rcs-missing-node-modules-'));
  try {
    const result = ensureReusableNodeModules(root, {
      gitRunner: () => ({ status: 1, stdout: '', stderr: 'not a worktree' }) as any,
    });
    assert.equal(result.strategy, 'missing');
    assert.match(String(result.warning || ''), /No reusable parent-repo node_modules was found/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
