# Roblox Creator Skills (RCS)

この翻訳版 README は意図的に簡潔にしています。
現在の製品面については、下記の正規ドキュメントを参照してください。

- パッケージ: `@jstn-sdk/rcs`
- リポジトリ: `https://github.com/JustineDevs/roblox-ai-os`
- はじめに: [../site/getting-started.html](../site/getting-started.html)
- Skills リファレンス: [../skills.html](../skills.html)
- コントリビューター向けWiki: [../wiki/Home.md](../wiki/Home.md)
- ロードマップ: [../wiki/ROADMAP.md](../wiki/ROADMAP.md)
- アーキテクチャ: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- 貢献ガイド: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- 連携: [../site/integrations.html](../site/integrations.html)
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
- プラグインの導入と有効化は、まず upstream の `robloxstudio-mcp` ガイドに従ってください。RCS の互換性ドキュメントはその手順を**置き換えません**

## コントリビューション

- `good first issue` または `help wanted` ラベルの issue を探してください。
- ドキュメント、翻訳、QA、リリース整備への貢献も歓迎します。
- スコープを小さく明確に保つため、コントリビューター向けWikiとロードマップを使ってください。
- コントリビューター向けWikiは `.rcs/wiki/` のローカル runtime wiki とは**別物**です。

## 所有者

RCS は [JustineDevs](https://github.com/JustineDevs) と [@JustineDevs](https://github.com/JustineDevs) によって所有・保守されており、Roblox クリエイターワークフロー向けに提供されています。

## 謝辞

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## ライセンス

[MIT](https://opensource.org/licenses/MIT)
