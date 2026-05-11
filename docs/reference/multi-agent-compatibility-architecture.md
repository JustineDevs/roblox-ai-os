# Multi-Agent Compatibility Architecture

RCS already ships a real multi-agent compatibility system, but in this repo it is split across **native agent definitions**, **catalog policy**, **native Codex TOML generation**, and **adapter targets**.

This document names that architecture explicitly so contributors do not project an external `src/agents.ts` example onto the wrong files.

## Canonical files

- Native agent registry: [`src/agents/definitions.ts`](../../src/agents/definitions.ts)
- Native-agent install policy: [`src/agents/policy.ts`](../../src/agents/policy.ts)
- Native-agent config adapter/generator: [`src/agents/native-config.ts`](../../src/agents/native-config.ts)
- Public catalog manifest: [`src/catalog/manifest.json`](../../src/catalog/manifest.json)
- External adapter target contracts: [`src/adapt/contracts.ts`](../../src/adapt/contracts.ts)
- External adapter target registry: [`src/adapt/registry.ts`](../../src/adapt/registry.ts)
- CLI native-agent management: [`src/cli/agents.ts`](../../src/cli/agents.ts)
- Native-agent verification: [`src/scripts/verify-native-agents.ts`](../../src/scripts/verify-native-agents.ts)

## Core patterns

### Registry pattern

RCS uses **two registries**:

- `AGENT_DEFINITIONS` in `src/agents/definitions.ts`
- target descriptors in `src/adapt/registry.ts`

Those registries keep agent and adapter metadata centralized instead of scattering role-specific logic through setup, runtime, and verification code.

### Adapter pattern

RCS does not expose prompt markdown or external target state directly.

Instead:

- `src/agents/native-config.ts` adapts prompt markdown plus `AgentDefinition` metadata into native Codex TOML files
- `src/adapt/*` adapts target-specific runtime evidence such as OpenClaw or Hermes into a shared envelope/probe/status contract

The rest of the system can therefore consume a stable RCS-owned shape rather than raw target-specific details.

### Strategy pattern

The compatibility layer applies strategy-like decisions through registry-backed metadata instead of giant conditionals:

- `modelClass`, `posture`, and `routingRole` select native-agent instruction overlays and model resolution behavior
- adapter target descriptors select target-specific capability reports while preserving a shared foundation contract
- catalog `status` values such as `active`, `internal`, `alias`, and `merged` determine installability and canonical-target behavior

### Plugin-style architecture

RCS supports extension without rewriting the core native-agent installer:

- add or adjust a native role in `AGENT_DEFINITIONS`
- classify it in `src/catalog/manifest.json`
- provide the matching prompt asset in `prompts/`
- let `verify-native-agents` enforce the contract

For external targets, add a target contract and registry descriptor under `src/adapt/*` without changing unrelated adapter lanes.

## Supporting techniques

### Configuration-driven design

The compatibility layer is mostly declarative:

- agent metadata is data-first in `AGENT_DEFINITIONS`
- installability and canonical aliases are data-first in `src/catalog/manifest.json`
- adapter capabilities are data-first in `TARGET_DESCRIPTORS`

That keeps policy visible and reviewable.

### Facade pattern

RCS exposes small facade helpers over the registries instead of forcing consumers to walk raw objects:

- `getAgent`
- `listAgents`
- `getAgentNames`
- `getAgentsByCategory`
- `getAgentsByPosture`
- `getAgentsByRoutingRole`
- `getInstallableNativeAgentNames`
- `listAdaptTargets`
- `getAdaptTargetDescriptor`

### Canonical-boundary pattern

RCS keeps ownership boundaries explicit:

- prompt markdown is setup-owned source content under `prompts/`
- generated native Codex agent TOML is emitted under `~/.codex/agents/` or `./.codex/agents/`
- plugin manifests must **not** claim setup-owned `agents`, `prompts`, or `hooks`
- adapter writes stay under `.rcs/adapters/<target>/...`

This avoids duplication and prevents plugin/runtime surfaces from silently fighting over the same artifacts.

## What this architecture is not

This repo does **not** currently use the external example's exact shape:

- no monolithic `src/agents.ts`
- no `.agents/skills` universal-directory + symlink installer as the core native-agent mechanism
- no per-agent `detectInstalled()` registry for dozens of third-party coding tools as the main compatibility layer

RCS instead centers on:

- native Codex agent-role generation
- catalog-governed canonical/alias boundaries
- adapter-target compatibility lanes such as OpenClaw and Hermes

## Verification contract

The architecture is guarded by tests and verification surfaces:

- [`src/agents/__tests__/definitions.test.ts`](../../src/agents/__tests__/definitions.test.ts)
- [`src/agents/__tests__/native-config.test.ts`](../../src/agents/__tests__/native-config.test.ts)
- [`src/adapt/__tests__/foundation.test.ts`](../../src/adapt/__tests__/foundation.test.ts)
- [`src/scripts/__tests__/verify-native-agents.test.ts`](../../src/scripts/__tests__/verify-native-agents.test.ts)
- [`src/verification/__tests__/multi-agent-compatibility-architecture.test.ts`](../../src/verification/__tests__/multi-agent-compatibility-architecture.test.ts)

If you change the compatibility architecture, update the doc and the contract tests together.
