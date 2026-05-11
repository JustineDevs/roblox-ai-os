# Roblox Creator Skills (RCS)

Este README localizado es intencionalmente breve.
Usa la documentación canónica enlazada abajo para la superficie actual del producto.

- Paquete: `@jstn-sdk/rcs`
- Repositorio: `https://github.com/JustineDevs/roblox-ai-os`
- Primeros pasos: [../getting-started.html](../getting-started.html)
- Referencia de skills: [../skills.html](../skills.html)
- Integraciones: [../integrations.html](../integrations.html)
- README canónico: [../../README.md](../../README.md)

## Flujo canónico para creadores

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Para trabajo de implementación en Roblox, la compuerta previa obligatoria se aplica antes de cualquier generación de código:
- recopilar referencias
- construir entendimiento
- estandarizar términos
- diseñar una arquitectura modular del árbol de archivos
- y solo entonces implementar

Ver:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Activación de MCP

Después de `rcs setup`, la configuración compatible con Codex debería incluir dos capas de MCP:

1. **Servidores MCP propios de RCS** mediante `rcs mcp-serve`
2. **Servidores MCP de referencia de Roblox** mediante GitMCP remote transport

Modelo recomendado:
- mantén **`rcs mcp-serve`** activo para trabajo local de runtime/estado/plano de control
- mantén los **servidores de referencia Roblox vía GitMCP** activos por defecto para reducir alucinaciones y mejorar el anclaje a la plataforma
- activa **`robloxstudio-mcp`** manualmente solo cuando quieras una conexión en tiempo real entre Codex CLI y Roblox Studio

Aclaración importante:
- `rcs mcp-serve` solo sirve **servidores MCP locales propiedad de RCS**
- **no** sirve `robloxstudio-mcp`

## Propiedad

RCS es propiedad y es mantenido por [JustineDevs](https://github.com/JustineDevs) y [@JustineDevs](https://github.com/JustineDevs) para flujos de trabajo de creadores de Roblox.

## Agradecimientos

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Licencia

[MIT](https://opensource.org/licenses/MIT)
