# Roblox Creator Skills (RCS)

这份本地化 README 有意保持简洁。
当前产品表面请以下方链接的规范文档为准。

- 包名：`@jstn-sdk/rcs`
- 仓库：`https://github.com/JustineDevs/roblox-ai-os`
- 入门： [../getting-started.html](../getting-started.html)
- Skills 参考： [../skills.html](../skills.html)
- 贡献者 Wiki： [../wiki/Home.md](../wiki/Home.md)
- 路线图： [../wiki/Roadmap.md](../wiki/Roadmap.md)
- 架构： [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- 贡献指南： [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- 集成： [../integrations.html](../integrations.html)
- 规范 README： [../../README.md](../../README.md)

## 规范的创作者工作流

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

对于 Roblox 实现工作，任何代码生成之前都必须先通过 pre-action gate：
- 收集参考资料
- 建立理解
- 统一术语
- 设计模块化文件树架构
- 然后才开始实现

参见：
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP 激活

执行 `rcs setup` 之后，默认的 Codex 兼容配置应包含两层 MCP：

1. 通过 `rcs mcp-serve` 提供的 **RCS 第一方 MCP 服务器**
2. 通过 GitMCP 远程传输提供的 **默认 Roblox 参考 MCP 服务器**

推荐模型：
- 保持 **`rcs mcp-serve`** 处于启用状态，用于本地 runtime / state / control-plane 工作
- 默认启用 **GitMCP Roblox 参考服务器**，以减少幻觉并提高平台语境准确度
- 只有在你需要 Codex CLI 与 Roblox Studio 的实时连接时，才手动启用 **`robloxstudio-mcp`**

重要说明：
- `rcs mcp-serve` 只服务于 **RCS 自有的本地 MCP 服务器**
- 它 **不会** 服务 `robloxstudio-mcp`
- 插件安装与启用请先遵循上游 `robloxstudio-mcp` 指南；RCS 兼容性文档**不**替代这些步骤

## 贡献

- 优先查找带有 `good first issue` 或 `help wanted` 标签的 issue。
- 文档、本地化、QA 和发布整理类贡献同样受欢迎。
- 使用贡献者 Wiki 和路线图来保持范围小且清晰。
- 贡献者 Wiki **不是** `.rcs/wiki/` 下的本地运行时 Wiki。

## 所有权

RCS 由 [JustineDevs](https://github.com/JustineDevs) 和 [@JustineDevs](https://github.com/JustineDevs) 拥有并维护，用于 Roblox 创作者工作流。

## 致谢

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## 许可证

[MIT](https://opensource.org/licenses/MIT)
