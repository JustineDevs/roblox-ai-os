# LLM Provider Abstraction

Status: canonical model- and API-agnostic provider layer for RCS runtime configuration.

## Purpose

RCS should treat LLM providers as interchangeable components, not permanent dependencies.

That means:
- model routing is separate from provider routing
- provider configuration is explicit
- fallback providers can be declared without rewriting core logic
- OpenAI-compatible gateways, Anthropic-style gateways, or other future providers can be swapped in without redesigning the product surface

## Core Principle

RCS routes work by:
1. workflow or role intent
2. model lane
3. provider selection

The application should not have to change its core logic just because the backing provider changes.

## Config Shape

`.rcs-config.json` may now include:

```json
{
  "providers": {
    "openrouter": {
      "base_url": "https://openrouter.ai/api/v1",
      "api_format": "openai-compatible",
      "env_key": "OPENROUTER_API_KEY",
      "capabilities": ["chat", "reasoning"],
      "label": "OpenRouter"
    }
  },
  "routing": {
    "default_provider": "openrouter",
    "mode_providers": {
      "forge": "openrouter"
    },
    "fallback_providers": ["openrouter"],
    "mode_fallback_providers": {
      "forge": ["openrouter"]
    },
    "hot_swap": true,
    "failover": true
  }
}
```

## What This Enables

- **Provider-agnostic routing** — use one model/provider abstraction without hard-wiring a single vendor into every workflow
- **OpenAI-compatible gateways** — route through unified proxy formats where useful
- **Mode-specific provider policies** — for example one provider for `forge`, another for `team`
- **Fallback chains** — define ordered failover providers for runtime resilience
- **Hot-swap intent** — document whether provider hot-swapping is considered part of the runtime policy

## Important Clarification

This layer is about **LLM/model provider routing**.

It is **not** the same as:
- `robloxstudio-mcp` live Studio transport
- OpenClaw notifications/gateway delivery

### OpenClaw

OpenClaw is adjacent infrastructure:
- useful for notifications/gateway automation
- not the canonical LLM provider abstraction
- should not be treated as the model-provider routing layer

## Current Runtime Hooks

Implemented runtime helpers live in:
- `src/config/models.ts`

They now support:
- provider profile reads
- default provider resolution
- mode-specific provider resolution
- fallback provider lists
- hot-swap/failover flags
- normalized active provider connection summaries
