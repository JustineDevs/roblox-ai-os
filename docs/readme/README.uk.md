# Roblox Creator Skills (RCS)

Цей локалізований README навмисно зроблено стислим.
Для актуальної поверхні продукту використовуйте канонічні документи за посиланнями нижче.

- Пакет: `@jstn-sdk/rcs`
- Репозиторій: `https://github.com/JustineDevs/roblox-ai-os`
- Початок роботи: [../getting-started.html](../getting-started.html)
- Довідник skills: [../skills.html](../skills.html)
- Вікі для контриб'юторів: [../wiki/Home.md](../wiki/Home.md)
- Дорожня карта: [../wiki/Roadmap.md](../wiki/Roadmap.md)
- Архітектура: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Посібник з внеску: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Інтеграції: [../integrations.html](../integrations.html)
- Канонічний README: [../../README.md](../../README.md)

## Канонічний workflow для creator

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Для роботи з реалізацією в Roblox обов’язковий pre-action gate застосовується до будь-якої генерації коду:
- зібрати референси
- побудувати розуміння
- стандартизувати терміни
- спроєктувати модульну архітектуру дерева файлів
- і лише потім реалізовувати

Див.:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Активація MCP

Після `rcs setup` типова сумісна з Codex конфігурація має містити два шари MCP:

1. **First-party MCP сервери RCS** через `rcs mcp-serve`
2. **MCP сервери довідкових Roblox-джерел** через віддалений transport GitMCP

Рекомендована модель:
- залишайте **`rcs mcp-serve`** активним для локальної runtime/state/control-plane роботи
- залишайте **довідкові Roblox сервери через GitMCP** увімкненими за замовчуванням, щоб зменшувати галюцинації й покращувати прив’язку до платформи
- вмикайте **`robloxstudio-mcp`** вручну лише тоді, коли потрібне живе з’єднання між Codex CLI та Roblox Studio

Важливе уточнення:
- `rcs mcp-serve` обслуговує лише **локальні MCP сервери, що належать RCS**
- він **не** обслуговує `robloxstudio-mcp`

## Внесок

- Шукайте issues з мітками `good first issue` або `help wanted`.
- Внески в документацію, локалізацію, QA та чистоту релізів вітаються.
- Використовуйте вікі для контриб'юторів і дорожню карту, щоб тримати scope малим і зрозумілим.
- Вікі для контриб'юторів **не** є тим самим, що локальна runtime-вікі в `.rcs/wiki/`.

## Власність

RCS належить [JustineDevs](https://github.com/JustineDevs) та [@JustineDevs](https://github.com/JustineDevs) і підтримується ними для creator-workflow у Roblox.

## Подяки

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Ліцензія

[MIT](https://opensource.org/licenses/MIT)
