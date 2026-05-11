# Roblox Creator Skills (RCS)

Diese lokalisierte README ist bewusst kompakt gehalten.
Nutze die unten verlinkten kanonischen Dokumente für die aktuelle Produktoberfläche.

- Paket: `@jstn-sdk/rcs`
- Repository: `https://github.com/JustineDevs/roblox-ai-os`
- Einstieg: [../getting-started.html](../getting-started.html)
- Skills-Referenz: [../skills.html](../skills.html)
- Mitwirkenden-Wiki: [../wiki/Home.md](../wiki/Home.md)
- Roadmap: [../wiki/Roadmap.md](../wiki/Roadmap.md)
- Architektur: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Mitwirken: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Integrationen: [../integrations.html](../integrations.html)
- Kanonische README: [../../README.md](../../README.md)

## Kanonischer Creator-Workflow

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Für Roblox-Implementierungsarbeit gilt das verpflichtende Pre-Action-Gate vor jeder Codegenerierung:
- Referenzen sammeln
- Verständnis aufbauen
- Begriffe standardisieren
- modulare Dateibaum-Architektur entwerfen
- erst dann implementieren

Siehe:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP-Aktivierung

Nach `rcs setup` sollte die standardmäßige Codex-kompatible Konfiguration zwei MCP-Ebenen enthalten:

1. **First-Party-RCS-MCP-Server** über `rcs mcp-serve`
2. **Standardmäßige Roblox-Referenz-MCP-Server** über den GitMCP-Remote-Transport

Empfohlenes Modell:
- **`rcs mcp-serve`** für lokales Runtime-/State-/Control-Plane-Work aktiviert lassen
- **GitMCP-Roblox-Referenzserver** standardmäßig aktiviert lassen, um Halluzinationen zu reduzieren und die Plattform-Erdung zu verbessern
- **`robloxstudio-mcp`** nur manuell aktivieren, wenn du eine Live-Verbindung zwischen Codex CLI und Roblox Studio brauchst

Wichtige Klarstellung:
- `rcs mcp-serve` dient nur **RCS-eigenen lokalen MCP-Servern**
- es dient **nicht** `robloxstudio-mcp`
- für Plugin-Installation und Aktivierung zuerst die Upstream-Anleitung zu `robloxstudio-mcp` verwenden; die RCS-Kompatibilitätsdoku ersetzt diese Schritte **nicht**

## Beiträge

- Suche nach Issues mit `good first issue` oder `help wanted`.
- Beiträge zu Dokumentation, Lokalisierung, QA und Release-Hygiene sind ausdrücklich willkommen.
- Nutze das Mitwirkenden-Wiki und die Roadmap, um Arbeiten klein und klar zu halten.
- Das Mitwirkenden-Wiki ist **nicht** dasselbe wie das lokale Runtime-Wiki unter `.rcs/wiki/`.

## Eigentümerschaft

RCS wird von [JustineDevs](https://github.com/JustineDevs) und [@JustineDevs](https://github.com/JustineDevs) für Roblox-Creator-Workflows entwickelt und gepflegt.

## Danksagungen

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Lizenz

[MIT](https://opensource.org/licenses/MIT)
