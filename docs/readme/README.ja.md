# Roblox Creator Skills (RCS)

この翻訳版 README は意図的に簡潔にしています。
現在の製品面については、下記の正規ドキュメントを参照してください。

- パッケージ: `@jstn-sdk/rcs`
- リポジトリ: `https://github.com/JustineDevs/roblox-ai-os`
- はじめに: [../getting-started.html](../getting-started.html)
- Skills リファレンス: [../skills.html](../skills.html)
- 連携: [../integrations.html](../integrations.html)
- 正規 README: [../../README.md](../../README.md)

## 正規のクリエイターワークフロー

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Roblox 実装作業では、コード生成の前に必須の pre-action gate を通す必要があります。
- 参照資料を集める
- 理解を構築する
- 用語を標準化する
- モジュール化されたファイルツリー設計を行う
- その後に実装する

参照:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP の有効化

`rcs setup` の後、Codex 互換の標準設定には 2 つの MCP レイヤーが含まれているべきです。

1. `rcs mcp-serve` による **RCS ファーストパーティ MCP サーバー**
2. GitMCP リモート transport による **Roblox 参照 MCP サーバー**

推奨モデル:
- ローカルの runtime / state / control-plane 用に **`rcs mcp-serve`** を有効のままにする
- 幻覚を減らしプラットフォーム理解を強めるため、**GitMCP の Roblox 参照サーバー**を標準で有効にする
- **`robloxstudio-mcp`** は Codex CLI と Roblox Studio のリアルタイム接続が必要な場合にのみ手動で有効にする

重要な補足:
- `rcs mcp-serve` は **RCS 所有のローカル MCP サーバー**のみを提供します
- `robloxstudio-mcp` は **提供しません**

## 所有者

RCS は [JustineDevs](https://github.com/JustineDevs) と [@JustineDevs](https://github.com/JustineDevs) によって所有・保守されており、Roblox クリエイターワークフロー向けに提供されています。

## 謝辞

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## ライセンス

[MIT](https://opensource.org/licenses/MIT)
