# RCS Roadmap

This is the canonical versioned product roadmap for **RCS** from the current `0.2.0` baseline through `3.0.0`.

This file is the source of truth for:

- repository roadmap links
- contributor planning
- the generated GitHub Wiki mirror

## Roadmap philosophy

RCS should grow by becoming:

1. more useful to real Roblox creators
2. more structured in how it produces outputs
3. more trustworthy in implementation and verification
4. easier to adopt in real workspaces and environments

The roadmap is intentionally **capability-sequenced**, not idea-spammed.

That means:
- each version entry should deliver a real user-facing capability
- related features should be grouped into suites
- versions should unlock the next layer cleanly
- maintenance-only work can ship inside a release, but should not define the milestone identity by itself

## Delivery architecture

RCS should implement roadmap features using one shared system design:

### 1. Planning layer

Capture:
- intent
- constraints
- target audience
- acceptance criteria
- non-goals

### 2. Production spec layer

Each feature should produce a structured spec, not only prose.

Examples:
- `gui-spec.md`
- `vfx-spec.md`
- `sfx-cue-sheet.md`
- `animation-state-spec.md`
- `monetization-plan.md`
- `retention-map.md`
- `live-ops-cycle.md`

### 3. Artifact layer

Turn approved specs into:
- templates
- manifests
- docs
- scaffold files
- checklists

### 4. Implementation layer

Only after planning/spec output is stable should RCS generate:
- code scaffolds
- UI scaffolds
- module boundaries
- config and runtime glue

### 5. Verification layer

Every roadmap feature should define:
- a rubric
- acceptance checks
- handoff expectations
- proof signals

## Version rules

- `0.x` = fast-moving capability expansion, but still disciplined
- `1.x` = stable creator operating layer
- `2.x` = stable platform and adoption maturity
- `3.0.0` = confident production-grade creator platform across real environments and workspaces

## Current baseline

### `0.2.0` — Ecosystem Reference

Status:
- shipped

Outcome:
- Cursor reference support
- MCP-capable IDE preset docs
- platform target manifest
- clearer support matrix for non-Codex consumption
- stronger ecosystem/reference positioning without pretending every host works like Codex

What this unlocked:
- a real cross-platform compatibility story
- a base for future non-Codex delivery/adapters

## Near-term roadmap

### `0.2.1` — Patch and Release Assistant

Goal:
- turn implementation deltas into ship-ready communication and QA outputs

New capability:
- given changed files, commits, or release scope, output:
  - update notes
  - devlog copy
  - QA checklist
  - release readiness review

Expected outcome:
- creators can go from “work merged” to “player-facing patch communication” without manual rewriting
- release follow-through becomes part of the workflow

Success criteria:
- one canonical patch-assistant workflow exists
- works on both code-heavy and docs-heavy changes
- generates short patch notes plus longer devlog summaries

### `0.2.2` — Monetization and Retention Suite

Goal:
- make monetization and retention planning first-class Roblox-native workflows

New capability:
- output:
  - game pass ideas
  - dev product loops
  - subscription perks
  - private server strategy
  - Creator Rewards fit by genre
  - target player habits
  - expected session length
  - social hooks
  - replay loops
  - return triggers

Expected outcome:
- creators can pressure-test monetization and retention before implementation
- gameplay loops and monetization stay connected instead of being designed separately

Success criteria:
- outputs remain genre-aware
- recommendations avoid pay-to-win drift
- planning stays Roblox-native rather than generic SaaS/product language

### `0.2.3` — Experience Surface Suite

Goal:
- expand RCS from code/workflow strength into real experience-production support

New capability:
- output:
  - GUI creator specs
  - VFX creator specs
  - SFX cue sheets
  - animation planning/state specs
  - GFX/branding helper outputs

Expected outcome:
- creators can use RCS for the visible, audible, and animated layers of the experience, not only logic and planning

Success criteria:
- output is structured and reusable
- ownership boundaries stay clear between client, server, shared, and content-only surfaces

### `0.2.4` — Live Ops Suite

Goal:
- add an operational layer for weekly and seasonal Roblox experience planning

New capability:
- output:
  - weekly update plan
  - event cadence
  - seasonal content beats
  - private-server hooks
  - acquisition loops tied to monetization and Creator Rewards
  - patch/release follow-through via the patch assistant

Expected outcome:
- creators can plan ongoing operations, not just one-time features

Success criteria:
- cadence planning is repeatable
- outputs connect retention, monetization, and content rhythm

### `0.2.5` — Unified Creator Planning and Production Suite

Goal:
- unify the strongest planning and production surfaces into one higher-order creator suite

New capability:
- one connected layer across:
  - monetization
  - retention
  - live ops
  - patch/release planning
  - GUI/VFX/SFX/animation production specs

Expected outcome:
- creators stop bouncing between disconnected specialized flows

Success criteria:
- shared vocabulary
- reusable templates
- clearer handoff into `$forge` / `$crew`

## `0.3.x` and beyond

### `0.3.0` — Studio-Connected Build Loop

Goal:
- make real Studio-state truth easier to use safely during implementation

New capability:
- stronger official Roblox MCP / upstream `robloxstudio-mcp` integration guidance
- smoother inspector-first workflows
- clearer live-truth vs repo-source split
- better local diagnostics for Studio connection problems

Expected outcome:
- creators can inspect live Studio state with less friction and less confusion

### `0.4.0` — Gameplay Systems Scaffold Pack

Goal:
- ship reusable Roblox-native scaffold outputs for high-value gameplay systems

New capability:
- scaffold outputs for:
  - combat slices
  - loadout/kit systems
  - inventory/progression systems
  - economy and reward loops
  - HUD / match-state slices

Expected outcome:
- creators start from verified structures instead of generic codegen

### `0.5.0` — Team and Verification Maturity

Goal:
- make multi-agent delivery and proof more dependable

New capability:
- better team-runtime ergonomics
- stronger verification orchestration
- clearer preflight and release proof flows
- more reliable evidence capture

Expected outcome:
- larger creator projects become easier to coordinate without losing trust

### `0.6.0` — Plugin and Tool Authoring Suite

Goal:
- make RCS stronger for Roblox tool/plugin builders, not just experience authors

New capability:
- richer Studio plugin authoring workflows
- widget/toolbar/state scaffolds
- tool-specific planning and verification outputs

Expected outcome:
- plugin authors can use RCS as a serious tooling workflow layer

### `0.7.0` — Cross-Platform Delivery and Adapters

Goal:
- move from “reference support” to more concrete multi-platform delivery

New capability:
- stronger delivery/adapters for:
  - Codex-native
  - Codex plugin
  - Cursor
  - MCP-capable IDEs
  - future Claude-like host
  - OpenClaw / Hermes adapters

Expected outcome:
- RCS becomes easier to consume across agentic hosts without duplicating source truth

### `0.8.0` — Release Candidate Hardening

Goal:
- prepare the platform for a stable `1.0.0`

New capability:
- stronger compatibility guarantees
- cleaner onboarding guarantees
- firmer migration rules
- more stable workflow semantics

Expected outcome:
- the project feels predictable enough to call stable

### `1.0.0` — Stable Roblox Creator Operating Layer

Goal:
- reach a stable, trustworthy foundation for AI-assisted Roblox creation

Definition of done:
- one clear Roblox-native workflow model
- stable setup/runtime/release behavior
- mature planning + implementation + verification surfaces
- strong security/reference posture
- explicit cross-platform compatibility model
- dependable local and remote release proof

Expected outcome:
- RCS becomes a dependable creator operating layer for serious Roblox builders

## Post-1.0 roadmap

### `1.1.0` — Creator Workflow Depth

Goal:
- deepen the quality of the core creator workflows without breaking `1.0.0` stability

Expected outcome:
- patch assistant, monetization, retention, live ops, and production specs become more consistent and reusable

### `1.2.0` — Studio and Workspace Maturity

Goal:
- make real Roblox workspace usage smoother and less fragile

Expected outcome:
- stronger Rojo/Wally/Aftman guidance
- clearer bootstrapping for real game repos
- safer live Studio inspection/update patterns

### `1.3.0` — Team Delivery Reliability

Goal:
- make multi-agent/team execution dependable enough for routine use on larger creator projects

Expected outcome:
- less coordination overhead
- better recovery when one lane goes bad

### `1.4.0` — Security and Trust Boundary Maturity

Goal:
- raise the trust level of RCS in real creator environments

Expected outcome:
- stronger exploit-pattern guidance
- stricter unsafe-corpus handling
- better safe-generation defaults

### `1.5.0` — Production Project Readiness

Goal:
- make RCS more obviously suitable for serious, long-lived Roblox projects

Expected outcome:
- cleaner migration/upgrade guidance
- stronger observability and runtime durability
- lower “demo-only” feeling

### `2.0.0` — Stable Platform

Goal:
- reach a stable platform state beyond the initial creator-operating-layer baseline

Definition of done:
- serious creators can rely on RCS across repeated projects
- workflow semantics are predictable
- ecosystem compatibility is explicit and maintained
- local and CI/release behavior are consistently dependable

Expected outcome:
- `2.0.0` means RCS is stable in repeated day-to-day use, not just stable in principle

## Toward broad production adoption

### `2.1.0` — Real Workspace Adoption

Goal:
- make adoption easier across existing Roblox game repos and team workspaces

Expected outcome:
- easier migration into established codebases without full resets

### `2.2.0` — Environment Integration Layer

Goal:
- make RCS behave more predictably across real local environments

Expected outcome:
- fewer Windows/WSL2/macOS/Linux/container surprises
- clearer local setup diagnostics

### `2.3.0` — Organizational Workflow Adoption

Goal:
- make RCS easier to use as a team standard, not just a solo power-user system

Expected outcome:
- clearer contributor rollout
- better org/team-level operating guidance

### `2.4.0` — Creator Operations Suite

Goal:
- expand from implementation support into a fuller creator operations layer

Expected outcome:
- stronger continuity from concept to release to ongoing operations

### `2.5.0` — Workspace and Runtime Durability

Goal:
- reduce remaining advanced-but-fragile runtime/tooling sharpness

Expected outcome:
- stronger state durability
- safer recovery flows
- lower operational friction

### `3.0.0` — Production-Level Creator Platform

Goal:
- reach a state where RCS can be confidently used as a production-grade creator platform across real environments, real workspaces, and real teams

Definition of done:
- strong adoption in existing Roblox workspaces, not just greenfield repos
- dependable local/runtime/editor/environment integration
- stable CI/release/process maturity
- mature cross-platform delivery and adapter model
- production-trustworthy planning, implementation, verification, and operational workflows
- clear security posture and low ambiguity around trust boundaries

Expected outcome:
- `3.0.0` means RCS is confidently usable at production level, with existing environment and workspace adoption being a normal path rather than a special case
