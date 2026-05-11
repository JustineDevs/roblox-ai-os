# Roblox Creator Skills (RCS)

Ce README localisé est volontairement concis.
Utilise les documents canoniques liés ci-dessous pour la surface produit actuelle.

- Package : `@jstn-sdk/rcs`
- Dépôt : `https://github.com/JustineDevs/roblox-ai-os`
- Démarrage : [../getting-started.html](../getting-started.html)
- Référence des skills : [../skills.html](../skills.html)
- Intégrations : [../integrations.html](../integrations.html)
- README canonique : [../../README.md](../../README.md)

## Workflow créateur canonique

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Pour le travail d’implémentation Roblox, le pre-action gate obligatoire s’applique avant toute génération de code :
- rassembler les références
- construire la compréhension
- normaliser les termes
- concevoir une architecture modulaire de l’arborescence des fichiers
- puis seulement implémenter

Voir :
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## Activation MCP

Après `rcs setup`, la configuration compatible Codex devrait inclure deux couches MCP :

1. **Serveurs MCP first-party RCS** via `rcs mcp-serve`
2. **Serveurs MCP de référence Roblox** via le transport distant GitMCP

Modèle recommandé :
- garder **`rcs mcp-serve`** actif pour le travail local de runtime / state / control plane
- garder les **serveurs de référence Roblox via GitMCP** actifs par défaut pour réduire les hallucinations et améliorer l’ancrage à la plateforme
- activer **`robloxstudio-mcp`** manuellement uniquement si vous voulez une connexion en temps réel entre Codex CLI et Roblox Studio

Clarification importante :
- `rcs mcp-serve` ne sert que les **serveurs MCP locaux appartenant à RCS**
- il ne sert **pas** `robloxstudio-mcp`

## Propriété

RCS appartient à [JustineDevs](https://github.com/JustineDevs) et [@JustineDevs](https://github.com/JustineDevs), et est maintenu par eux pour les workflows créateur Roblox.

## Remerciements

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Licence

[MIT](https://opensource.org/licenses/MIT)
