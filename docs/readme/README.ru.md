# Roblox Creator Skills (RCS)

Этот локализованный README намеренно сделан кратким.
Для актуальной поверхности продукта используйте канонические документы по ссылкам ниже.

- Пакет: `@jstn-sdk/rcs`
- Репозиторий: `https://github.com/JustineDevs/roblox-ai-os`
- Начало работы: [../getting-started.html](../getting-started.html)
- Справочник skills: [../skills.html](../skills.html)
- Вики для контрибьюторов: [../wiki/Home.md](../wiki/Home.md)
- Дорожная карта: [../wiki/Roadmap.md](../wiki/Roadmap.md)
- Архитектура: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Руководство по вкладу: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Интеграции: [../integrations.html](../integrations.html)
- Канонический README: [../../README.md](../../README.md)

## Канонический workflow для создателей

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Для работы по реализации в Roblox обязательный pre-action gate применяется до любой генерации кода:
- собрать ссылки и материалы
- сформировать понимание
- стандартизировать термины
- спроектировать модульную архитектуру дерева файлов
- и только потом реализовывать

См.:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Активация MCP

После `rcs setup` стандартная совместимая с Codex конфигурация должна включать два слоя MCP:

1. **Серверы MCP first-party RCS** через `rcs mcp-serve`
2. **Серверы MCP для справочных Roblox-источников** через удалённый transport GitMCP

Рекомендуемая модель:
- держать **`rcs mcp-serve`** включённым для локальной runtime/state/control-plane работы
- держать **справочные Roblox-серверы через GitMCP** включёнными по умолчанию, чтобы снижать галлюцинации и улучшать привязку к платформе
- включать **`robloxstudio-mcp`** вручную только тогда, когда нужна живая связь между Codex CLI и Roblox Studio

Важное уточнение:
- `rcs mcp-serve` обслуживает только **локальные MCP-серверы, принадлежащие RCS**
- он **не** обслуживает `robloxstudio-mcp`

## Вклад

- Ищите issues с метками `good first issue` или `help wanted`.
- Вклад в документацию, локализацию, QA и аккуратность релизов приветствуется.
- Используйте вики для контрибьюторов и дорожную карту, чтобы держать scope небольшим и понятным.
- Вики для контрибьюторов **не** совпадает с локальной runtime-вики в `.rcs/wiki/`.

## Владение

RCS принадлежит [JustineDevs](https://github.com/JustineDevs) и [@JustineDevs](https://github.com/JustineDevs) и поддерживается ими для creator-workflow в Roblox.

## Благодарности

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Лицензия

[MIT](https://opensource.org/licenses/MIT)
