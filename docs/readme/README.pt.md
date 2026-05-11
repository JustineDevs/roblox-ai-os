# Roblox Creator Skills (RCS)

Este README localizado é intencionalmente conciso.
Use a documentação canônica abaixo para a superfície atual do produto.

- Pacote: `@jstn-sdk/rcs`
- Repositório: `https://github.com/JustineDevs/roblox-ai-os`
- Primeiros passos: [../getting-started.html](../getting-started.html)
- Referência de skills: [../skills.html](../skills.html)
- Integrações: [../integrations.html](../integrations.html)
- README canônico: [../../README.md](../../README.md)

## Fluxo canônico para creators

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Para trabalho de implementação em Roblox, o pre-action gate obrigatório se aplica antes de qualquer geração de código:
- reunir referências
- construir entendimento
- padronizar termos
- projetar uma arquitetura modular da árvore de arquivos
- só então implementar

Veja:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Ativação de MCP

Depois de `rcs setup`, a configuração padrão compatível com o Codex deve incluir duas camadas de MCP:

1. **Servidores MCP first-party do RCS** via `rcs mcp-serve`
2. **Servidores MCP de referência Roblox** via transporte remoto GitMCP

Modelo recomendado:
- mantenha **`rcs mcp-serve`** ativo para trabalho local de runtime/estado/plano de controle
- mantenha os **servidores de referência Roblox via GitMCP** ativos por padrão para reduzir alucinações e melhorar o grounding na plataforma
- ative **`robloxstudio-mcp`** manualmente apenas quando quiser uma conexão em tempo real entre Codex CLI e Roblox Studio

Esclarecimento importante:
- `rcs mcp-serve` serve apenas **servidores MCP locais pertencentes ao RCS**
- ele **não** serve `robloxstudio-mcp`

## Propriedade

RCS pertence a [JustineDevs](https://github.com/JustineDevs) e [@JustineDevs](https://github.com/JustineDevs), e é mantido por eles para workflows de creators do Roblox.

## Agradecimentos

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Licença

[MIT](https://opensource.org/licenses/MIT)
