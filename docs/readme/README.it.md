# Roblox Creator Skills (RCS)

Questo README localizzato è volutamente conciso.
Usa la documentazione canonica collegata qui sotto per la superficie attuale del prodotto.

- Pacchetto: `@jstn-sdk/rcs`
- Repository: `https://github.com/JustineDevs/roblox-ai-os`
- Introduzione: [../site/getting-started.html](../site/getting-started.html)
- Riferimento skills: [../skills.html](../skills.html)
- Wiki dei contributori: [../wiki/Home.md](../wiki/Home.md)
- Roadmap: [../wiki/ROADMAP.md](../wiki/ROADMAP.md)
- Architettura: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- Contribuire: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- Integrazioni: [../site/integrations.html](../site/integrations.html)
- README canonico: [../../README.md](../../README.md)

## Flusso creator canonico

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Per il lavoro di implementazione Roblox, il pre-action gate obbligatorio si applica prima di qualsiasi generazione di codice:
- raccogliere riferimenti
- costruire comprensione
- standardizzare i termini
- progettare un’architettura modulare dell’albero dei file
- solo dopo implementare

Vedi:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Attivazione MCP

Dopo `rcs setup`, la configurazione compatibile con Codex dovrebbe includere due livelli MCP:

1. **Server MCP first-party RCS** tramite `rcs mcp-serve`
2. **Server MCP di riferimento Roblox** tramite trasporto remoto GitMCP

Modello consigliato:
- mantieni **`rcs mcp-serve`** attivo per il lavoro locale di runtime/stato/control-plane
- mantieni i **server di riferimento Roblox via GitMCP** attivi per impostazione predefinita per ridurre le allucinazioni e migliorare il grounding sulla piattaforma
- abilita **`robloxstudio-mcp`** manualmente solo quando vuoi una connessione in tempo reale tra Codex CLI e Roblox Studio

Chiarimento importante:
- `rcs mcp-serve` serve solo **server MCP locali di proprietà RCS**
- **non** serve `robloxstudio-mcp`
- per installazione e attivazione del plugin, segui prima la guida upstream di `robloxstudio-mcp`; la documentazione di compatibilità RCS **non** sostituisce quei passaggi

## Contributi

- Cerca issue con le etichette `good first issue` o `help wanted`.
- I contributi su documentazione, localizzazione, QA e igiene delle release sono benvenuti.
- Usa il wiki dei contributori e la roadmap per mantenere lo scope piccolo e chiaro.
- Il wiki dei contributori **non** è lo stesso del wiki runtime locale in `.rcs/wiki/`.

## Proprietà

RCS è di proprietà ed è mantenuto da [JustineDevs](https://github.com/JustineDevs) e [@JustineDevs](https://github.com/JustineDevs) per i workflow creator di Roblox.

## Ringraziamenti

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Licenza

[MIT](https://opensource.org/licenses/MIT)
