import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  resolveReplyListenerLiveEnv,
  runReplyListenerLiveSmoke,
} from '../test-reply-listener-live.js';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has('content-type')) {
    headers.set('content-type', 'application/json');
  }
  return new Response(JSON.stringify(body), { ...init, headers });
}

test('resolveReplyListenerLiveEnv stays disabled until explicitly opted in', () => {
  const result = resolveReplyListenerLiveEnv({
    RCS_DISCORD_NOTIFIER_BOT_TOKEN: 'discord-token',
    RCS_DISCORD_NOTIFIER_CHANNEL: 'channel-1',
    RCS_TELEGRAM_BOT_TOKEN: 'telegram-token',
    RCS_TELEGRAM_CHAT_ID: 'chat-1',
  });

  assert.deepEqual(result, {
    enabled: false,
    missing: [],
    config: null,
  });
});

test('resolveReplyListenerLiveEnv reports missing credentials when opted in', () => {
  const result = resolveReplyListenerLiveEnv({
    RCS_REPLY_LISTENER_LIVE: '1',
    RCS_DISCORD_NOTIFIER_BOT_TOKEN: 'discord-token',
    RCS_TELEGRAM_CHAT_ID: 'chat-1',
  });

  assert.equal(result.enabled, true);
  assert.deepEqual(result.missing, [
    'RCS_DISCORD_NOTIFIER_CHANNEL',
    'RCS_TELEGRAM_BOT_TOKEN',
  ]);
  assert.equal(result.config, null);
});

test('runReplyListenerLiveSmoke exercises Discord and Telegram send + cleanup requests', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const logs: string[] = [];

  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });

    if (url === 'https://discord.com/api/v10/channels/channel-1/messages') {
      assert.equal(init?.method, 'POST');
      assert.match(String(init?.body), /Discord connectivity probe/);
      return jsonResponse({ id: 'discord-message-1' });
    }

    if (url === 'https://discord.com/api/v10/channels/channel-1/messages/discord-message-1') {
      assert.equal(init?.method, 'DELETE');
      return new Response(null, { status: 204 });
    }

    if (url === 'https://api.telegram.org/bottelegram-token/sendMessage') {
      assert.equal(init?.method, 'POST');
      assert.match(String(init?.body), /Telegram connectivity probe/);
      return jsonResponse({ ok: true, result: { message_id: 42 } });
    }

    if (url === 'https://api.telegram.org/bottelegram-token/deleteMessage') {
      assert.equal(init?.method, 'POST');
      const payload = JSON.parse(String(init?.body)) as { chat_id: string; message_id: number };
      assert.deepEqual(payload, { chat_id: 'chat-1', message_id: 42 });
      return jsonResponse({ ok: true, result: true });
    }

    throw new Error(`Unexpected live smoke fetch url: ${url}`);
  };

  const result = await runReplyListenerLiveSmoke(
    {
      discordBotToken: 'discord-token',
      discordChannelId: 'channel-1',
      telegramBotToken: 'telegram-token',
      telegramChatId: 'chat-1',
    },
    {
      fetchImpl,
      log: (message) => logs.push(message),
    },
  );

  assert.deepEqual(result, {
    discordMessageId: 'discord-message-1',
    telegramMessageId: '42',
  });
  assert.equal(calls.length, 4);
  assert.ok(logs.some((entry) => entry.includes('Discord probe message sent: discord-message-1')));
  assert.ok(logs.some((entry) => entry.includes('Telegram probe message sent: 42')));
});
