# Roblox Creator Skills (RCS)

To zlokalizowane README jest celowo zwięzłe.
Aktualną powierzchnię produktu opisują kanoniczne dokumenty podlinkowane poniżej.

- Pakiet: `@jstn-sdk/rcs`
- Repozytorium: `https://github.com/JustineDevs/roblox-ai-os`
- Pierwsze kroki: [../site/getting-started.html](../site/getting-started.html)
- Dokumentacja skills: [../skills.html](../skills.html)
- Wiki dla współtwórców: [../wiki/Home.md](../wiki/Home.md)
- Plan rozwoju: [../wiki/Roadmap.md](../wiki/Roadmap.md)
- Architektura: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Współtworzenie: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Integracje: [../site/integrations.html](../site/integrations.html)
- Kanoniczne README: [../../README.md](../../README.md)

## Kanoniczny workflow twórcy

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Dla prac implementacyjnych Roblox obowiązkowa bramka pre-action ma zastosowanie przed jakimkolwiek generowaniem kodu:
- zbierz materiały referencyjne
- zbuduj zrozumienie
- ujednolić terminologię
- zaprojektuj modułową architekturę drzewa plików
- dopiero potem wdrażaj

Zobacz:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Aktywacja MCP

Po `rcs setup` domyślna konfiguracja zgodna z Codex powinna zawierać dwie warstwy MCP:

1. **Serwery MCP first-party RCS** przez `rcs mcp-serve`
2. **Domyślne serwery referencyjne Roblox MCP** przez zdalny transport GitMCP

Zalecany model:
- pozostaw **`rcs mcp-serve`** aktywne dla lokalnej pracy runtime/state/control-plane
- pozostaw **serwery referencyjne Roblox przez GitMCP** aktywne domyślnie, aby ograniczać halucynacje i poprawić osadzenie w platformie
- włączaj **`robloxstudio-mcp`** ręcznie tylko wtedy, gdy chcesz połączenia w czasie rzeczywistym między Codex CLI a Roblox Studio

Ważne doprecyzowanie:
- `rcs mcp-serve` obsługuje tylko **lokalne serwery MCP należące do RCS**
- **nie** obsługuje `robloxstudio-mcp`
- instalację i aktywację wtyczki wykonaj najpierw według upstreamowego przewodnika `robloxstudio-mcp`; dokumentacja kompatybilności RCS **nie** zastępuje tych kroków

## Wkład

- Szukaj issues oznaczonych `good first issue` lub `help wanted`.
- Wkład w dokumentację, lokalizację, QA i higienę wydań jest mile widziany.
- Korzystaj z wiki współtwórców i planu rozwoju, aby utrzymywać mały i jasny zakres pracy.
- Wiki współtwórców **nie** jest tym samym co lokalne wiki runtime w `.rcs/wiki/`.

## Własność

RCS należy do [JustineDevs](https://github.com/JustineDevs) i [@JustineDevs](https://github.com/JustineDevs) oraz jest przez nich utrzymywany dla workflow twórców Roblox.

## Podziękowania

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Licencja

[MIT](https://opensource.org/licenses/MIT)
