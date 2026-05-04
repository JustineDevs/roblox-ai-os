/**
 * Dispatch Notification Cooldown
 *
 * Prevents flooding users with team dispatch notifications by enforcing a
 * minimum interval between dispatches. Similar to idle-cooldown.ts but
 * specifically for dispatch-related notifications.
 *
 * Config key : notifications.dispatchCooldownSeconds in ~/.codex/.rcs-config.json
 * Env var    : RCS_DISPATCH_COOLDOWN_SECONDS  (overrides config)
 * State file : .rcs/state/dispatch-notif-cooldown.json
 *              (session-scoped when sessionId is available)
 *
 * A cooldown value of 0 disables throttling entirely.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { codexHome } from '../utils/paths.js';

const DEFAULT_COOLDOWN_SECONDS = 60;
const SESSION_ID_SAFE_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,255}$/;

/**
 * Read the dispatch notification cooldown in seconds.
 *
 * Resolution order:
 *   1. RCS_DISPATCH_COOLDOWN_SECONDS env var
 *   2. notifications.dispatchCooldownSeconds in ~/.codex/.rcs-config.json
 *   3. Default: 60 seconds
 */
export function getDispatchNotificationCooldownSeconds(): number {
  // 1. Environment variable override
  const envVal = process.env.RCS_DISPATCH_COOLDOWN_SECONDS;
  if (envVal !== undefined) {
    const parsed = Number(envVal);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.floor(parsed);
    }
  }

  // 2. Config file
  try {
    const configPath = join(codexHome(), '.rcs-config.json');
    if (existsSync(configPath)) {
      const raw = JSON.parse(readFileSync(configPath, 'utf-8')) as Record<string, unknown>;
      const notifications = raw?.notifications as Record<string, unknown> | undefined;
      const val = notifications?.dispatchCooldownSeconds;
      if (typeof val === 'number' && Number.isFinite(val)) {
        return Math.max(0, Math.floor(val));
      }
    }
  } catch {
    // ignore parse errors — fall through to default
  }

  return DEFAULT_COOLDOWN_SECONDS;
}

/**
 * Resolve the path to the dispatch cooldown state file.
 * Uses a session-scoped path when sessionId is provided and safe.
 */
function getCooldownStatePath(stateDir: string, sessionId?: string): string {
  if (sessionId && SESSION_ID_SAFE_PATTERN.test(sessionId)) {
    return join(stateDir, 'sessions', sessionId, 'dispatch-notif-cooldown.json');
  }
  return join(stateDir, 'dispatch-notif-cooldown.json');
}

/**
 * Check whether the dispatch notification cooldown has elapsed.
 *
 * Returns true if the notification should be sent (cooldown has elapsed or is disabled).
 * Returns false if the notification should be suppressed (too soon since last send).
 */
export function shouldSendDispatchNotification(stateDir: string, sessionId?: string): boolean {
  const cooldownSecs = getDispatchNotificationCooldownSeconds();

  // Cooldown of 0 means disabled — always send
  if (cooldownSecs === 0) return true;

  const cooldownPath = getCooldownStatePath(stateDir, sessionId);
  try {
    if (!existsSync(cooldownPath)) return true;

    const data = JSON.parse(readFileSync(cooldownPath, 'utf-8')) as Record<string, unknown>;
    if (data?.lastSentAt && typeof data.lastSentAt === 'string') {
      const lastSentMs = new Date(data.lastSentAt).getTime();
      if (Number.isFinite(lastSentMs)) {
        const elapsedSecs = (Date.now() - lastSentMs) / 1000;
        if (elapsedSecs < cooldownSecs) return false;
      }
    }
  } catch {
    // ignore read/parse errors — treat as no cooldown file, allow send
  }

  return true;
}

/**
 * Record that a dispatch notification was sent at the current timestamp.
 * Call this after a successful dispatch to arm the cooldown.
 */
export function recordDispatchNotificationSent(stateDir: string, sessionId?: string): void {
  const cooldownPath = getCooldownStatePath(stateDir, sessionId);
  try {
    const dir = dirname(cooldownPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(cooldownPath, JSON.stringify({ lastSentAt: new Date().toISOString() }, null, 2));
  } catch {
    // ignore write errors — best effort
  }
}
