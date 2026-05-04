import { CODEX_BYPASS_FLAG, MADMAX_FLAG } from './constants.js';
import { parseInitArgs } from './autoresearch-guided.js';

export const AUTORESEARCH_DEPRECATION_MESSAGE = [
  'rcs autoresearch is hard-deprecated.',
  'Use the `$autoresearch` skill for the hook-native persistent loop.',
  'Use `$deep-interview --autoresearch` to create or refine mission artifacts before execution.',
  'Direct CLI launch, resume, run, bare mission-dir aliases, and tmux split-pane launch are no longer supported.',
].join(' ');

export const AUTORESEARCH_HELP = `rcs autoresearch - Hard-deprecated legacy command surface

Usage:
  rcs autoresearch --help

Deprecated legacy forms (all fail intentionally):
  rcs autoresearch
  rcs autoresearch [--topic T] [--evaluator CMD] [--keep-policy P] [--slug S]
  rcs autoresearch init [--topic T] [--evaluator CMD] [--keep-policy P] [--slug S]
  rcs autoresearch run <mission-dir> [codex-args...]
  rcs autoresearch <mission-dir> [codex-args...]
  rcs autoresearch --resume <run-id> [codex-args...]

Migration:
  - Use \`$deep-interview --autoresearch\` to clarify the mission and write canonical artifacts under \`.rcs/specs/autoresearch-{slug}/\`
  - Use \`$autoresearch "your mission"\` for the stateful validator-gated execution loop
  - Choose validation mode at init:
      1. mission-validator-script
      2. prompt-architect-artifact
  - Completion now depends on validator evidence, not repeated no-ops or detached tmux launch parity
`;

export interface ParsedAutoresearchArgs {
  missionDir: string | null;
  runId: string | null;
  codexArgs: string[];
  guided?: boolean;
  initArgs?: string[];
  seedArgs?: ReturnType<typeof parseInitArgs>;
  runSubcommand?: boolean;
}

export function normalizeAutoresearchCodexArgs(codexArgs: readonly string[]): string[] {
  const normalized: string[] = [];
  let hasBypass = false;

  for (const arg of codexArgs) {
    if (arg === MADMAX_FLAG) {
      if (!hasBypass) {
        normalized.push(CODEX_BYPASS_FLAG);
        hasBypass = true;
      }
      continue;
    }
    if (arg === CODEX_BYPASS_FLAG) {
      if (!hasBypass) {
        normalized.push(arg);
        hasBypass = true;
      }
      continue;
    }
    normalized.push(arg);
  }

  if (!hasBypass) {
    normalized.push(CODEX_BYPASS_FLAG);
  }

  return normalized;
}

export function parseAutoresearchArgs(args: readonly string[]): ParsedAutoresearchArgs {
  const values = [...args];
  if (values.length === 0) {
    return { missionDir: null, runId: null, codexArgs: [], guided: true };
  }

  const first = values[0];
  if (first === 'init') {
    return { missionDir: null, runId: null, codexArgs: [], guided: true, initArgs: values.slice(1) };
  }
  if (first === '--help' || first === '-h' || first === 'help') {
    return { missionDir: '--help', runId: null, codexArgs: [] };
  }
  if (first === '--resume') {
    return { missionDir: null, runId: values[1]?.trim() || null, codexArgs: values.slice(2) };
  }
  if (first.startsWith('--resume=')) {
    return { missionDir: null, runId: first.slice('--resume='.length).trim() || null, codexArgs: values.slice(1) };
  }
  if (first === 'run') {
    return { missionDir: values[1]?.trim() || null, runId: null, codexArgs: values.slice(2), runSubcommand: true };
  }
  if (first.startsWith('-')) {
    return { missionDir: null, runId: null, codexArgs: [], guided: true, seedArgs: parseInitArgs(values) };
  }
  return { missionDir: first, runId: null, codexArgs: values.slice(1) };
}

function shouldShowHelp(args: readonly string[]): boolean {
  return args.length > 0 && args.every((arg) => arg === '--help' || arg === '-h' || arg === 'help');
}

export async function autoresearchCommand(args: string[]): Promise<void> {
  if (shouldShowHelp(args)) {
    console.log(AUTORESEARCH_HELP);
    return;
  }

  throw new Error(`${AUTORESEARCH_DEPRECATION_MESSAGE}\n\n${AUTORESEARCH_HELP}`);
}
