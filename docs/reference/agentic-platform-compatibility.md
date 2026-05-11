# Agentic Platform Compatibility

RCS should be portable across agentic AI platforms, but **portability does not mean pretending every platform has the same runtime model as Codex**.

The correct goal is:

- one canonical authoring surface
- one compatibility contract
- multiple platform-specific delivery lanes

That contract is now materialized in:

- [`src/platform-targets/manifest.json`](../../src/platform-targets/manifest.json)
- [`src/platform-targets/schema.ts`](../../src/platform-targets/schema.ts)
- [`src/platform-targets/reader.ts`](../../src/platform-targets/reader.ts)

## What stays canonical

These are the source-of-truth surfaces inside this repo:

- `skills/` — canonical workflow skills
- `prompts/` — canonical prompt guidance for setup-owned native-agent generation
- `src/agents/definitions.ts` — canonical native-agent role registry
- `src/catalog/manifest.json` — canonical installability and alias/merged policy
- `templates/AGENTS.md` — canonical orchestration brain template
- `src/config/rcs-first-party-mcp.ts` and related config generators — canonical first-party MCP metadata

Everything else should be an **emitted delivery surface** or an **adapter surface**.

## Delivery lanes

### 1. Codex native setup lane

This is the deepest-supported lane today.

It includes:

- generated native agents under `.codex/agents/`
- installed prompts under `.codex/prompts/`
- installed skills under the selected setup scope
- setup-owned runtime hooks
- `.rcs/` runtime state

This lane is driven by `rcs setup`.

### 2. Codex plugin + marketplace lane

This is the installable bundle lane today.

It includes:

- plugin bundle under `plugins/roblox-ai-os-creator-skills/`
- marketplace metadata in `.agents/plugins/marketplace.json`
- plugin-scoped skill discovery
- plugin-scoped MCP/app companion metadata

Important boundary:

- the plugin bundle is **not** the full runtime setup
- setup-owned prompts, native-agent TOMLs, and runtime hooks remain outside the plugin manifest

### 3. Adapter lane for external platforms

This is how non-Codex platforms should be integrated.

Examples:

- OpenClaw
- Hermes
- future Claude-oriented or marketplace-oriented bridges

The rule is:

- do not fork canonical skill/prompt/runtime truth into platform-specific ad hoc copies
- add a platform adapter or delivery contract that maps canonical RCS surfaces into the target platform’s format

## What “compatible with any agentic AI platform” should mean

It should mean:

- RCS authors once from canonical source surfaces
- RCS can emit or adapt those surfaces for a target platform
- each target gets the format it actually supports

It should **not** mean:

- every platform receives the exact same file layout
- every platform gets Codex-only runtime semantics
- plugin, marketplace, hooks, prompts, and native agents all collapse into one fake universal package

## Platform model

Use this mental model:

- **Canonical source layer**: skills, prompts, registry, catalog, templates
- **Delivery layer**: Codex native setup, Codex plugin bundle, marketplace package
- **Adapter layer**: target-specific bridge for platforms with different runtime rules

## Claude-style example

For a Claude-like platform, the right question is not:

- “Can we copy the Codex plugin/runtime shape into `.claude/`?”

The right question is:

- “Which canonical RCS surfaces should be delivered natively, and which must stay adapter-owned because the target platform does not share Codex runtime semantics?”

That usually means:

- skills may be portable
- selected guidance may be portable
- marketplace/package metadata may be portable
- setup-owned native agents and runtime hooks are **not** automatically portable one-to-one

## Marketplace example

For a marketplace-oriented platform, the package should be treated as a delivery artifact:

- emitted from canonical repo sources
- versioned from canonical package/release metadata
- validated against a platform-specific boundary contract

Not as a second source of truth.

## Current repo posture

Today RCS is strongest in:

- Codex native setup
- Codex plugin/marketplace packaging
- adapter-style compatibility lanes such as OpenClaw/Hermes

It is **not yet** a finished universal emitter for every external agent platform.

Planned delivery targets in the manifest (for example `cursor` and `mcp-capable-ide`) reserve names and boundaries for those hosts without claiming they are fully implemented today.

That is intentional. The repo should grow by adding **clean adapters/delivery contracts**, not by duplicating the product into platform-specific silos.

## Concrete target lanes

The current platform target manifest defines these concrete lanes:

- `codex-native`
- `codex-plugin`
- `claude-like`
- `cursor` (planned delivery for Cursor rules/skills/MCP clients)
- `marketplace-bundle`
- `mcp-capable-ide` (planned delivery for MCP-attached editors and assistants)
- `adapter-openclaw`
- `adapter-hermes`
