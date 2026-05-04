#!/usr/bin/env node
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import process from 'process';
import { spawnSync } from 'child_process';
import { CLAUDE_SKIP_PERMISSIONS_FLAG } from '../cli/constants.js';

const PROVIDER_BINARIES: Record<string, string> = {
  claude: 'claude',
  gemini: 'gemini',
};
const ASK_ORIGINAL_TASK_ENV = 'RCS_ASK_ORIGINAL_TASK';
const ISSUE_WORK_PROMPT_PATTERNS = [
  /\bgh\s+issue\b/i,
  /\b(?:fix|work on|work|investigate|implement|triage|debug|review|handle)\s+issue\s*#?\d+\b/i,
  /\bissue\s*#\d+\b/i,
];

function usage(): void {
  console.error('Usage: rcs ask <claude|gemini> "<prompt>"');
  console.error('Legacy direct usage: node scripts/run-provider-advisor.js <claude|gemini> <prompt...>');
  console.error('                 or: node scripts/run-provider-advisor.js claude --print "<prompt>"');
  console.error('                 or: node scripts/run-provider-advisor.js gemini --prompt "<prompt>"');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'task';
}

function timestampToken(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

function parseArgs(argv: string[]): { provider: string; prompt: string } {
  const [providerRaw, ...rest] = argv;
  const provider = (providerRaw || '').toLowerCase();

  if (!provider || !(provider in PROVIDER_BINARIES)) {
    usage();
    process.exit(1);
  }

  if (rest.length === 0) {
    usage();
    process.exit(1);
  }

  if (rest[0] === '-p' || rest[0] === '--print' || rest[0] === '--prompt') {
    const prompt = rest.slice(1).join(' ').trim();
    if (!prompt) {
      usage();
      process.exit(1);
    }
    return { provider, prompt };
  }

  return { provider, prompt: rest.join(' ').trim() };
}

function ensureBinary(binary: string): void {
  const probe = spawnSync(binary, ['--version'], {
    stdio: 'ignore',
    encoding: 'utf8',
      windowsHide: true,
    });

  if (probe.error && (probe.error as NodeJS.ErrnoException).code === 'ENOENT') {
    const verify = `${binary} --version`;
    console.error(`[ask-${binary}] Missing required local CLI binary: ${binary}`);
    console.error(`[ask-${binary}] Install/configure ${binary} CLI, then verify with: ${verify}`);
    process.exit(1);
  }
}

function shouldUseClaudeIssuePermissionsBypass(provider: string, prompt: string): boolean {
  if (provider !== 'claude') return false;
  const trimmed = prompt.trim();
  if (trimmed === '') return false;
  return ISSUE_WORK_PROMPT_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function buildSummary(exitCode: number, output: string): string {
  if (exitCode === 0) {
    return 'Provider completed successfully. Review the raw output for details.';
  }

  const firstLine = output
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine
    ? `Provider command failed (exit ${exitCode}): ${firstLine}`
    : `Provider command failed with exit code ${exitCode}.`;
}

function buildActionItems(exitCode: number): string[] {
  if (exitCode === 0) {
    return ['Review the response and extract decisions you want to apply.', 'Capture follow-up implementation tasks if needed.'];
  }

  return ['Inspect the raw output error details.', 'Fix CLI/auth/environment issues and rerun the command.'];
}

async function writeArtifact({ provider, originalTask, finalPrompt, rawOutput, exitCode }: {
  provider: string;
  originalTask: string;
  finalPrompt: string;
  rawOutput: string;
  exitCode: number;
}): Promise<string> {
  const root = process.cwd();
  const artifactDir = join(root, '.rcs', 'artifacts');
  const slug = slugify(originalTask);
  const timestamp = timestampToken();
  const artifactPath = join(artifactDir, `${provider}-${slug}-${timestamp}.md`);

  const summary = buildSummary(exitCode, rawOutput);
  const actionItems = buildActionItems(exitCode);

  const body = [
    `# ${provider} advisor artifact`,
    '',
    `- Provider: ${provider}`,
    `- Exit code: ${exitCode}`,
    `- Created at: ${new Date().toISOString()}`,
    '',
    '## Original task',
    '',
    originalTask,
    '',
    '## Final prompt',
    '',
    finalPrompt,
    '',
    '## Raw output',
    '',
    '```text',
    rawOutput || '(no output)',
    '```',
    '',
    '## Concise summary',
    '',
    summary,
    '',
    '## Action items',
    '',
    ...actionItems.map((item) => `- ${item}`),
    '',
  ].join('\n');

  await mkdir(artifactDir, { recursive: true });
  await writeFile(artifactPath, body, 'utf8');
  return artifactPath;
}

async function main(): Promise<void> {
  const { provider, prompt } = parseArgs(process.argv.slice(2));
  const binary = PROVIDER_BINARIES[provider];
  const originalTask = process.env[ASK_ORIGINAL_TASK_ENV] ?? prompt;

  ensureBinary(binary);

  const launchArgs = shouldUseClaudeIssuePermissionsBypass(provider, originalTask)
    ? [CLAUDE_SKIP_PERMISSIONS_FLAG, '-p', prompt]
    : ['-p', prompt];

  const run = spawnSync(binary, launchArgs, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
      windowsHide: true,
    });

  const stdout = run.stdout || '';
  const stderr = run.stderr || '';
  const rawOutput = [stdout, stderr].filter(Boolean).join(stdout && stderr ? '\n\n' : '');
  const exitCode = typeof run.status === 'number' ? run.status : 1;

  const artifactPath = await writeArtifact({
    provider,
    originalTask,
    finalPrompt: prompt,
    rawOutput,
    exitCode,
  });

  console.log(artifactPath);

  if (run.error) {
    console.error(`[ask-${provider}] ${run.error.message}`);
  }

  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

main().catch((error) => {
  console.error(`[run-provider-advisor] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
