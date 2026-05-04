interface ReplyListenerLiveConfig {
  discordBotToken: string;
  discordChannelId: string;
  telegramBotToken: string;
  telegramChatId: string;
}

interface ReplyListenerLiveEnvResolution {
  enabled: boolean;
  missing: string[];
  config: ReplyListenerLiveConfig | null;
}

interface ReplyListenerLiveSmokeResult {
  discordMessageId: string;
  telegramMessageId: string;
}

interface ReplyListenerLiveSmokeDeps {
  fetchImpl?: typeof fetch;
  log?: (message: string) => void;
}

const LIVE_ENABLE_ENV = 'RCS_REPLY_LISTENER_LIVE';
const REQUIRED_ENV_KEYS = [
  'RCS_DISCORD_NOTIFIER_BOT_TOKEN',
  'RCS_DISCORD_NOTIFIER_CHANNEL',
  'RCS_TELEGRAM_BOT_TOKEN',
  'RCS_TELEGRAM_CHAT_ID',
] as const;

function requireJsonObject(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} returned a non-object JSON payload`);
  }
  return value as Record<string, unknown>;
}

async function parseResponseJson(response: Response, label: string): Promise<Record<string, unknown>> {
  const body = await response.json() as unknown;
  return requireJsonObject(body, label);
}

export function resolveReplyListenerLiveEnv(env: NodeJS.ProcessEnv = process.env): ReplyListenerLiveEnvResolution {
  const enabled = env[LIVE_ENABLE_ENV] === '1';
  if (!enabled) {
    return { enabled: false, missing: [], config: null };
  }

  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = env[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
  if (missing.length > 0) {
    return { enabled: true, missing: [...missing], config: null };
  }

  return {
    enabled: true,
    missing: [],
    config: {
      discordBotToken: env.RCS_DISCORD_NOTIFIER_BOT_TOKEN!.trim(),
      discordChannelId: env.RCS_DISCORD_NOTIFIER_CHANNEL!.trim(),
      telegramBotToken: env.RCS_TELEGRAM_BOT_TOKEN!.trim(),
      telegramChatId: env.RCS_TELEGRAM_CHAT_ID!.trim(),
    },
  };
}

export async function runReplyListenerLiveSmoke(
  config: ReplyListenerLiveConfig,
  deps: ReplyListenerLiveSmokeDeps = {},
): Promise<ReplyListenerLiveSmokeResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const log = deps.log ?? console.log;
  const stamp = new Date().toISOString();

  const discordSendResponse = await fetchImpl(
    `https://discord.com/api/v10/channels/${config.discordChannelId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${config.discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `[rcs live smoke ${stamp}] reply-listener Discord connectivity probe`,
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!discordSendResponse.ok) {
    throw new Error(`Discord live smoke failed: HTTP ${discordSendResponse.status}`);
  }
  const discordPayload = await parseResponseJson(discordSendResponse, 'Discord sendMessage');
  const discordMessageId = typeof discordPayload.id === 'string' && discordPayload.id.trim()
    ? discordPayload.id
    : null;
  if (!discordMessageId) {
    throw new Error('Discord live smoke failed: missing message id');
  }
  log(`Discord probe message sent: ${discordMessageId}`);

  try {
    await fetchImpl(
      `https://discord.com/api/v10/channels/${config.discordChannelId}/messages/${discordMessageId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bot ${config.discordBotToken}` },
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    log(`Discord probe cleanup skipped for ${discordMessageId}`);
  }

  const telegramSendResponse = await fetchImpl(
    `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: `[rcs live smoke ${stamp}] reply-listener Telegram connectivity probe`,
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!telegramSendResponse.ok) {
    throw new Error(`Telegram live smoke failed: HTTP ${telegramSendResponse.status}`);
  }
  const telegramPayload = await parseResponseJson(telegramSendResponse, 'Telegram sendMessage');
  const telegramResult = requireJsonObject(telegramPayload.result, 'Telegram sendMessage.result');
  const telegramMessageId = typeof telegramResult.message_id === 'number' || typeof telegramResult.message_id === 'string'
    ? String(telegramResult.message_id)
    : null;
  if (!telegramMessageId) {
    throw new Error('Telegram live smoke failed: missing message id');
  }
  log(`Telegram probe message sent: ${telegramMessageId}`);

  try {
    await fetchImpl(
      `https://api.telegram.org/bot${config.telegramBotToken}/deleteMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegramChatId,
          message_id: Number(telegramMessageId),
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    log(`Telegram probe cleanup skipped for ${telegramMessageId}`);
  }

  return { discordMessageId, telegramMessageId };
}

export async function main(): Promise<void> {
  const resolution = resolveReplyListenerLiveEnv();
  if (!resolution.enabled) {
    console.log(`reply-listener live smoke: SKIP (${LIVE_ENABLE_ENV}=1 to enable)`);
    return;
  }
  if (!resolution.config) {
    console.log(`reply-listener live smoke: SKIP (missing env: ${resolution.missing.join(', ')})`);
    return;
  }

  const result = await runReplyListenerLiveSmoke(resolution.config);
  console.log('reply-listener live smoke: PASS');
  console.log(`discord_message_id=${result.discordMessageId}`);
  console.log(`telegram_message_id=${result.telegramMessageId}`);
}

const isMain = process.argv[1]
  ? import.meta.url === new URL(`file://${process.argv[1]}`).href
  : false;

if (isMain) {
  main().catch((error) => {
    console.error(`reply-listener live smoke: FAIL\n${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
