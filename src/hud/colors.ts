/**
 * RCS HUD - ANSI Color Utilities
 *
 * Terminal color codes for statusline rendering.
 * Ported from oh-my-claudecode.
 */

// ANSI escape codes
export const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
let colorEnabled = true;

export function setColorEnabled(enabled: boolean): void {
  colorEnabled = enabled;
}

export function isColorEnabled(): boolean {
  return colorEnabled;
}

function wrapColor(code: string, text: string): string {
  if (!colorEnabled) return text;
  return `${code}${text}${RESET}`;
}

export function green(text: string): string {
  return wrapColor(GREEN, text);
}

export function yellow(text: string): string {
  return wrapColor(YELLOW, text);
}

export function cyan(text: string): string {
  return wrapColor(CYAN, text);
}

export function dim(text: string): string {
  return wrapColor(DIM, text);
}

export function bold(text: string): string {
  return wrapColor(BOLD, text);
}

/**
 * Get color code based on forge iteration progress.
 */
export function getForgeColor(iteration: number, maxIterations: number): string {
  if (!colorEnabled) return '';
  const warningThreshold = Math.floor(maxIterations * 0.7);
  const criticalThreshold = Math.floor(maxIterations * 0.9);

  if (iteration >= criticalThreshold) return RED;
  if (iteration >= warningThreshold) return YELLOW;
  return GREEN;
}
