import { spawn } from 'node:child_process';
import { resolveRcsCliEntryPath } from '../utils/paths.js';
import type { QuestionAnswer, QuestionAnswerEntry, QuestionInput, NormalizedQuestionItem } from './types.js';

export interface RcsQuestionSuccessPayload {
  ok: true;
  question_id: string;
  session_id?: string;
  questions: NormalizedQuestionItem[];
  answers: QuestionAnswerEntry[];
  prompt?: QuestionInput | NormalizedQuestionItem;
  question?: QuestionInput | NormalizedQuestionItem;
  answer?: QuestionAnswer;
}

export interface RcsQuestionErrorPayload {
  ok: false;
  question_id?: string;
  session_id?: string;
  error: {
    code: string;
    message: string;
  };
}

export type RcsQuestionPayload = RcsQuestionSuccessPayload | RcsQuestionErrorPayload;

export interface RcsQuestionClientOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  argv1?: string | null;
  runner?: RcsQuestionProcessRunner;
}

export interface RcsQuestionProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

export type RcsQuestionProcessRunner = (
  command: string,
  args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv },
) => Promise<RcsQuestionProcessResult>;

export class RcsQuestionError extends Error {
  readonly code: string;
  readonly payload?: RcsQuestionErrorPayload;
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number | null;

  constructor(
    code: string,
    message: string,
    options: {
      payload?: RcsQuestionErrorPayload;
      stdout?: string;
      stderr?: string;
      exitCode?: number | null;
    } = {},
  ) {
    super(`${code}: ${message}`);
    this.name = 'RcsQuestionError';
    this.code = code;
    this.payload = options.payload;
    this.stdout = options.stdout ?? '';
    this.stderr = options.stderr ?? '';
    this.exitCode = options.exitCode ?? null;
  }
}

export async function defaultRcsQuestionProcessRunner(
  command: string,
  args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv },
): Promise<RcsQuestionProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

function parseQuestionStdout(stdout: string, stderr: string, exitCode: number | null): RcsQuestionPayload {
  const trimmed = stdout.trim();
  if (!trimmed) {
    throw new RcsQuestionError('question_no_stdout', 'rcs question did not emit a JSON response on stdout.', {
      stdout,
      stderr,
      exitCode,
    });
  }

  try {
    return JSON.parse(trimmed) as RcsQuestionPayload;
  } catch (error) {
    throw new RcsQuestionError(
      'question_invalid_stdout',
      `rcs question emitted invalid JSON on stdout: ${(error as Error).message}`,
      { stdout, stderr, exitCode },
    );
  }
}

export async function runRcsQuestion(
  input: (Partial<QuestionInput> & { question: string }) | { questions: Array<Partial<QuestionInput> & { question: string }>; header?: string; source?: string; session_id?: string },
  options: RcsQuestionClientOptions = {},
): Promise<RcsQuestionSuccessPayload> {
  const cwd = options.cwd ?? process.cwd();
  const env = options.env ?? process.env;
  const rcsBin = resolveRcsCliEntryPath({ argv1: options.argv1, cwd, env });
  if (!rcsBin) {
    throw new RcsQuestionError('question_cli_not_found', 'Could not resolve the rcs CLI entrypoint for blocking question execution.');
  }

  const runner = options.runner ?? defaultRcsQuestionProcessRunner;
  const result = await runner(
    process.execPath,
    [rcsBin, 'question', '--json', '--input', JSON.stringify(input)],
    { cwd, env },
  );
  const payload = parseQuestionStdout(result.stdout, result.stderr, result.code);

  if (!payload.ok) {
    throw new RcsQuestionError(payload.error.code, payload.error.message, {
      payload,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.code,
    });
  }

  if (result.code !== 0) {
    throw new RcsQuestionError(
      'question_nonzero_exit',
      `rcs question returned an answer but exited with code ${result.code}.`,
      { stdout: result.stdout, stderr: result.stderr, exitCode: result.code },
    );
  }

  return payload;
}
