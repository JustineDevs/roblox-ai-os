#!/usr/bin/env node

// RCS CLI entry point
// Requires compiled JavaScript output in dist/

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { existsSync, writeSync } from 'fs';
import { rememberRcsLaunchContext } from '../utils/paths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..', '..');

rememberRcsLaunchContext();

async function flushStandardStreams(): Promise<void> {
  await Promise.all([
    new Promise<void>((resolve) => process.stdout.write('', () => resolve())),
    new Promise<void>((resolve) => process.stderr.write('', () => resolve())),
  ]);
}

async function runQuestionFastPath(distRoot: string): Promise<boolean> {
  if (process.argv[2] !== 'question') return false;

  const questionEntry = join(distRoot, 'cli', 'question.js');
  const { questionCommand } = await import(pathToFileURL(questionEntry).href);

  try {
    await questionCommand(process.argv.slice(3));
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }

  await flushStandardStreams();
  return true;
}

async function runStateFastPath(distRoot: string): Promise<boolean> {
  if (process.argv[2] !== 'state') return false;

  const stateEntry = join(distRoot, 'cli', 'state.js');
  const { stateCommand } = await import(pathToFileURL(stateEntry).href);
  const stdout = (line: string) => {
    const rendered = `${line}\n`;
    if (process.stdout.isTTY) process.stdout.write(rendered);
    else writeSync(1, rendered);
  };
  const stderr = (line: string) => {
    const rendered = `${line}\n`;
    if (process.stderr.isTTY) process.stderr.write(rendered);
    else writeSync(2, rendered);
  };

  try {
    await stateCommand(process.argv.slice(3), { stdout, stderr });
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }

  await flushStandardStreams();
  return true;
}

async function runTeamFastPath(distRoot: string): Promise<boolean> {
  if (process.argv[2] !== 'team') return false;

  const teamEntry = join(distRoot, 'cli', 'team.js');
  const { teamCommand } = await import(pathToFileURL(teamEntry).href);
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const writeStdout = (line: string) => {
    const rendered = `${line}\n`;
    if (process.stdout.isTTY) process.stdout.write(rendered);
    else writeSync(1, rendered);
  };
  const writeStderr = (line: string) => {
    const rendered = `${line}\n`;
    if (process.stderr.isTTY) process.stderr.write(rendered);
    else writeSync(2, rendered);
  };
  console.log = (...args: unknown[]) => writeStdout(args.map(String).join(' '));
  console.warn = (...args: unknown[]) => writeStderr(args.map(String).join(' '));
  console.error = (...args: unknown[]) => writeStderr(args.map(String).join(' '));

  try {
    await teamCommand(process.argv.slice(3));
  } catch (error) {
    writeStderr(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }

  await flushStandardStreams();
  return true;
}

// Execute compiled entrypoint
const distEntry = join(root, 'dist', 'cli', 'index.js');

if (existsSync(distEntry)) {
  if (await runQuestionFastPath(join(root, 'dist'))) {
    // Let the process terminate naturally so piped stdout/stderr can drain.
  } else if (await runStateFastPath(join(root, 'dist'))) {
    // Let the process terminate naturally so piped stdout/stderr can drain.
  } else if (await runTeamFastPath(join(root, 'dist'))) {
    // Let the process terminate naturally so piped stdout/stderr can drain.
  } else {
    const { main } = await import(pathToFileURL(distEntry).href);
    await main(process.argv.slice(2));
    if (process.argv[2] !== 'mcp-serve') {
      // Let the process terminate naturally so piped stdout/stderr can drain.
      await flushStandardStreams();
    }
  }
} else {
  console.error('rcs: run "npm run build" first');
  process.exit(1);
}
