# Canonical Vocabulary

Status: canonical repo-wide terminology contract for active RCS surfaces.

## Purpose

This file defines the vocabulary that active RCS surfaces should default to across:
- prompts
- skills
- missions
- AGENTS/runtime guidance
- creator-facing docs

The goal is not to ban every contextual mention of off-domain language. The goal is to ensure
that active product/workflow surfaces default to Roblox-native concepts instead of generic web,
enterprise, or backend-first abstractions.

## Audience Model

RCS is for:
- Roblox creators
- Roblox Studio builders
- creator-tool/plugin authors
- Codex users working on Roblox experiences and Studio-adjacent workflows

RCS is not a generic SaaS builder, generic web-app framework, or enterprise backend platform.

## Preferred Terms

| Canonical term | Use for | Prefer instead of |
|---|---|---|
| creator | repo/product audience | customer, tenant, SaaS user |
| player | game user | end user, consumer |
| experience | Roblox game/project surface | app, product, website |
| Roblox Studio | primary implementation environment | frontend app, web app |
| Luau | scripting language | app code, backend language |
| ModuleScript | reusable code unit | service, repository, controller |
| Script / LocalScript | server/client code units | backend handler, frontend component |
| ScreenGui / SurfaceGui / BillboardGui | UI surface | page, route, dashboard |
| plugin / widget / toolbar | Studio tooling surface | admin panel, settings page |
| RemoteEvent / RemoteFunction | network boundary | API endpoint, REST call |
| server authority | trust model | backend validation layer |
| DataStoreService | persistence surface | database, SQL store |
| replication | state distribution | sync API |
| economy | currencies, grants, purchases | billing system |
| live-ops | timed rewards, events, cadence | growth campaign |
| progression | levels, unlocks, prestige | user lifecycle funnel |
| retention | return behavior | engagement KPI only |
| creator workflow | RCS operating path | product workflow, app workflow |
| brief / blueprint / forge / crew | canonical workflow surfaces | generic PM/design/dev stages |

## Allowed Contextual Terms

These terms may still appear when they are the truthful local/runtime context:
- Codex CLI
- MCP
- plugin cache
- release workflow
- package / SDK / dependency
- CI / build / lint / verification
- external docs/reference research

These terms are allowed because they describe the actual implementation/runtime of RCS itself.

## Vocabulary Guardrails

### Default phrasing

When the scope is Roblox or creator-facing:
- prefer `experience` over `app`
- prefer `player` / `creator` over generic `user`
- prefer `RemoteEvent` / `RemoteFunction` over `API`
- prefer `DataStoreService` / persistence flow over `database`
- prefer `ScreenGui` / HUD / panel / menu over `page` / `dashboard`

### Banned-by-default abstractions

Do not default to these unless the scoped target is explicitly a real off-Roblox/runtime surface:
- DTO
- controller
- repository pattern
- microservice
- REST endpoint
- CRUD app
- backend service
- frontend framework assumptions
- tenant / SaaS framing

## Surface Taxonomy

Use these classifications consistently:

| Surface class | Meaning |
|---|---|
| canonical | active creator/runtime surface RCS wants users to learn |
| operator | advanced runtime/support surface for power users |
| internal | implementation/support surface, not public onboarding |
| historical | archival migration/reference content only |

## Enforcement Notes

- Active prompts/skills/missions should prefer this vocabulary.
- Active prompts/skills/missions should expose taxonomy frontmatter so generated surface maps and validators can classify them consistently.
- Generated surface-map output should stay synced with the active taxonomy layer.
- Tests may mention removed terms in negative assertions, migration guards, or compatibility fixtures, but not as active surface recommendations.
