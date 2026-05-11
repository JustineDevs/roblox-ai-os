# Forge Persistence Gate

Release gate checklist for the lower-level persistent completion runtime.

| ID | Scenario | Required evidence | Status |
|---|---|---|---|
| V1 | Session-scoped state is preferred over root fallback | state-path + session runtime tests | [x] |
| V2 | Cross-session safety is preserved | session/runtime compatibility tests | [x] |
| V3 | Legacy PRD/progress migration is one-way and deterministic | forge persistence tests | [x] |
| V4 | Legacy phase normalization is enforced | state-server phase tests | [x] |
| V5 | Terminal completion is persisted correctly | lifecycle/runtime tests | [x] |
| V6 | Linked cleanup behavior is preserved | cancel/runtime tests | [x] |
| V7 | Cancellation produces terminal non-active state | cancel contract tests | [x] |
| V8 | Notify/runtime readers honor authoritative scope | HUD / notify / trace tests | [x] |
| V9 | Prompt-side activation does not bypass explicit PRD startup rules | forge PRD tests | [x] |
| V10 | CI blocks release when this matrix is not covered | forge persistence gate test + CI job | [x] |

Compatibility window note:
- `RCS_FORGE_PERSISTENCE_PORT=1` is the current release-port marker.
- Older migration notes may still mention pre-Forge persistence markers; those are historical only and no longer canonical.
