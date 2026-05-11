# Roblox Creator Skills (RCS)

이 현지화 README는 의도적으로 간결하게 유지됩니다.
현재 제품 표면에 대해서는 아래의 정식 문서를 참고하세요.

- 패키지: `@jstn-sdk/rcs`
- 저장소: `https://github.com/JustineDevs/roblox-ai-os`
- 시작 가이드: [../site/getting-started.html](../site/getting-started.html)
- 스킬 참고서: [../skills.html](../skills.html)
- 기여자 위키: [../wiki/Home.md](../wiki/Home.md)
- 로드맵: [../wiki/ROADMAP.md](../wiki/ROADMAP.md)
- 아키텍처: [../reference/multi-agent-compatibility-architecture.md](../reference/multi-agent-compatibility-architecture.md)
- 기여 가이드: [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- 통합 문서: [../site/integrations.html](../site/integrations.html)
- 정식 README: [../../README.md](../../README.md)

## 정식 크리에이터 워크플로우

`$brief` -> `$blueprint` -> `$forge` / `$crew` -> `$autoforge`

Roblox 구현 작업에서는 어떤 코드 생성보다 먼저 필수 pre-action gate가 적용됩니다:
- 참고 자료 수집
- 이해 형성
- 용어 표준화
- 모듈형 파일 트리 아키텍처 설계
- 그 다음에만 구현

참고:
- [../../README.md](../../README.md)
- [../skills.html](../skills.html)
- [../reference/roblox-pre-action-protocol.md](../reference/roblox-pre-action-protocol.md)

## MCP 활성화

`rcs setup` 이후 기본 Codex 호환 설정에는 두 가지 MCP 계층이 포함되어야 합니다:

1. `rcs mcp-serve`를 통한 **RCS 1st-party MCP 서버**
2. GitMCP 원격 전송을 통한 **기본 Roblox 참고 MCP 서버**

권장 모델:
- 로컬 runtime/state/control-plane 작업을 위해 **`rcs mcp-serve`** 를 활성 상태로 유지
- 환각을 줄이고 플랫폼 기반 정확도를 높이기 위해 **GitMCP Roblox 참고 서버**를 기본으로 활성화
- Codex CLI와 Roblox Studio 사이의 실시간 연결이 필요할 때만 **`robloxstudio-mcp`** 를 수동으로 활성화

중요한 설명:
- `rcs mcp-serve` 는 **RCS 소유의 로컬 MCP 서버**만 제공합니다
- `robloxstudio-mcp` 는 제공하지 않습니다
- 플러그인 설치와 활성화는 먼저 upstream `robloxstudio-mcp` 가이드를 따르세요. RCS 호환성 문서는 그 절차를 **대체하지 않습니다**

## 기여

- `good first issue` 또는 `help wanted` 라벨이 붙은 이슈를 먼저 살펴보세요.
- 문서, 번역, QA, 릴리스 정리 기여도 모두 환영합니다.
- 범위를 작고 분명하게 유지하려면 기여자 위키와 로드맵을 사용하세요.
- 기여자 위키는 `.rcs/wiki/` 아래의 로컬 런타임 위키와 **같지 않습니다**.

## 소유권

RCS는 Roblox 크리에이터 워크플로우를 위해 [JustineDevs](https://github.com/JustineDevs)와 [@JustineDevs](https://github.com/JustineDevs)가 소유하고 유지 관리합니다.

## 감사의 말

- [OpenAI Codex CLI](https://github.com/openai/codex)
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)
- [robloxstudio-mcp](https://github.com/boshyxd/robloxstudio-mcp)

## 라이선스

[MIT](https://opensource.org/licenses/MIT)
