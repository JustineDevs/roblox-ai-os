# Roblox Creator Skills (RCS)

Bu yerelleştirilmiş README bilinçli olarak kısa tutulmuştur.
Ürünün güncel yüzeyi için aşağıdaki kanonik belgelere bakın.

- Paket: `@jstn-sdk/rcs`
- Depo: `https://github.com/JustineDevs/roblox-ai-os`
- Başlangıç: [../getting-started.html](../getting-started.html)
- Skill başvurusu: [../skills.html](../skills.html)
- Entegrasyonlar: [../integrations.html](../integrations.html)
- Kanonik README: [../../README.md](../../README.md)

## Kanonik creator iş akışı

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Roblox uygulama işi için zorunlu pre-action gate, herhangi bir kod üretiminden önce uygulanır:
- referansları topla
- anlayış oluştur
- terimleri standartlaştır
- modüler dosya ağacı mimarisi tasarla
- ancak ondan sonra uygula

Bakınız:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP etkinleştirme

`rcs setup` sonrasında varsayılan Codex uyumlu yapılandırma iki MCP katmanı içermelidir:

1. `rcs mcp-serve` üzerinden **RCS birinci taraf MCP sunucuları**
2. GitMCP uzak taşıması üzerinden **varsayılan Roblox referans MCP sunucuları**

Önerilen model:
- yerel runtime/state/control-plane çalışmaları için **`rcs mcp-serve`** etkin kalsın
- halüsinasyonları azaltmak ve platforma dayalı doğruluğu artırmak için **GitMCP Roblox referans sunucuları** varsayılan olarak etkin kalsın
- yalnızca Codex CLI ile Roblox Studio arasında gerçek zamanlı bağlantı istediğinizde **`robloxstudio-mcp`** yi manuel olarak etkinleştirin

Önemli açıklama:
- `rcs mcp-serve` yalnızca **RCS’ye ait yerel MCP sunucularını** sunar
- `robloxstudio-mcp` yi sunmaz

## Sahiplik

RCS, Roblox creator iş akışları için [JustineDevs](https://github.com/JustineDevs) ve [@JustineDevs](https://github.com/JustineDevs) tarafından sahiplenilir ve sürdürülür.

## Teşekkürler

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## Lisans

[MIT](https://opensource.org/licenses/MIT)
