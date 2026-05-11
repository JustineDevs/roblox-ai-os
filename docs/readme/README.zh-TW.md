# Roblox Creator Skills (RCS)

這份在地化 README 刻意保持精簡。
目前產品表面請以下方連結的正規文件為準。

- 套件：`@jstn-sdk/rcs`
- 儲存庫：`https://github.com/JustineDevs/roblox-ai-os`
- 快速開始： [../getting-started.html](../getting-started.html)
- Skills 參考： [../skills.html](../skills.html)
- 整合： [../integrations.html](../integrations.html)
- 正規 README： [../../README.md](../../README.md)

## 正規創作者工作流程

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

對於 Roblox 實作工作，在任何程式碼產生之前都必須先通過 pre-action gate：
- 蒐集參考資料
- 建立理解
- 統一術語
- 設計模組化檔案樹架構
- 然後才開始實作

請參考：
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP 啟用

執行 `rcs setup` 之後，預設的 Codex 相容設定應包含兩層 MCP：

1. 透過 `rcs mcp-serve` 提供的 **RCS 第一方 MCP 伺服器**
2. 透過 GitMCP 遠端傳輸提供的 **預設 Roblox 參考 MCP 伺服器**

建議模式：
- 保持 **`rcs mcp-serve`** 啟用，用於本機 runtime / state / control-plane 工作
- 預設保持 **GitMCP Roblox 參考伺服器** 啟用，以減少幻覺並提升平台脈絡準確度
- 只有在需要 Codex CLI 與 Roblox Studio 之間的即時連線時，才手動啟用 **`robloxstudio-mcp`**

重要說明：
- `rcs mcp-serve` 只服務 **RCS 自有的本機 MCP 伺服器**
- 它 **不會** 服務 `robloxstudio-mcp`

## 擁有權

RCS 由 [JustineDevs](https://github.com/JustineDevs) 與 [@JustineDevs](https://github.com/JustineDevs) 擁有並維護，用於 Roblox 創作者工作流程。

## 致謝

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## 授權

[MIT](https://opensource.org/licenses/MIT)
