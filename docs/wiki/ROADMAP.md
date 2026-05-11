# RCS Roadmap

This is the canonical versioned product roadmap for **RCS** from the current `0.2.0` baseline to `1.0.0`.

## Roadmap rules

- In the `0.x` phase, each listed version entry is treated as a meaningful product increment.
- A roadmap version should represent a **new user-facing capability**, **new workflow surface**, or **new output type**.
- Maintenance-only work such as CI cleanup, docs-only polish, or contract repair can ship inside a version, but should not define the milestone by itself.
- Patch numbers in this roadmap are intentionally used for product progression while the project is still pre-1.0 and moving fast.

## Current baseline

### `0.2.0` — Ecosystem Reference

Shipped baseline.

Outcome:
- Cursor reference support
- MCP-capable IDE preset docs
- platform target manifest
- clearer support matrix for non-Codex consumption
- stronger ecosystem/reference positioning without pretending every host works like Codex

What this unlocked:
- a real cross-platform compatibility story
- a base for future non-Codex delivery/adapters

## Planned version entries

### `0.2.1` — Patch Assistant

Goal:
- Turn implementation deltas into ship-ready communication and QA outputs.

New capability:
- Given changed files, commits, or release scope, output:
  - update notes
  - devlog copy
  - QA checklist
  - release readiness review

Expected outcome:
- creators can go from “work merged” to “player-facing patch communication” without manual rewriting
- release follow-through becomes part of the workflow, not an afterthought

Success criteria:
- one canonical patch-assistant workflow exists
- works on both code-heavy and docs-heavy changes
- generates short, platform-appropriate patch summaries and longer devlog summaries

### `0.2.2` — Roblox Monetization Planner

Goal:
- Make monetization planning a first-class Roblox-native workflow.

New capability:
- output:
  - game pass ideas
  - dev product loops
  - subscription perks
  - private server strategy
  - Creator Rewards fit by genre

Expected outcome:
- creators can pressure-test monetization before implementation
- monetization logic stays attached to gameplay loops instead of being bolted on later

Success criteria:
- output separates soft-currency, premium-currency, and recurring-value logic clearly
- recommendations stay genre-aware and avoid pay-to-win drift

### `0.2.3` — Audience and Retention Planner

Goal:
- Make player-fit and retention logic explicit before system building.

New capability:
- output:
  - target player habits
  - expected session length
  - social hooks
  - replay loops
  - return triggers

Expected outcome:
- creators can reason about “who stays and why” before building progression and content cadence

Success criteria:
- outputs connect motivation, session shape, and replay behavior
- planning remains Roblox-native rather than generic consumer-product language

### `0.2.4` — Live Ops Mode

Goal:
- Add an operating layer for weekly and seasonal Roblox content planning.

New capability:
- output:
  - weekly update plan
  - event cadence
  - seasonal content beats
  - private-server hooks
  - acquisition loops tied to monetization and Creator Rewards

Expected outcome:
- creators can plan ongoing experience operations, not just one-time feature launches

Success criteria:
- supports repeatable cadence planning
- connects content rhythm with retention and monetization

### `0.2.5` — Worldbuilding and Design Production Pack

Goal:
- Support pre-production and creative direction as first-class workflow surfaces.

New capability:
- output:
  - moodboards
  - expanded GDD structure
  - story outline
  - character sheets
  - map chunk specs
  - weekly implementation plans

Expected outcome:
- creators can use RCS earlier in the lifecycle, before gameplay implementation starts

Success criteria:
- outputs are structured enough to hand to builders, not just inspirational prose

### `0.3.0` — Unified Creator Planning Suite

Goal:
- Merge the strongest planning surfaces into one coherent creator-planning layer.

New capability:
- one connected planning suite covering:
  - worldbuilding
  - monetization
  - retention
  - live ops
  - patch/release planning

Expected outcome:
- creators stop bouncing between unrelated prompts and get one higher-order planning workflow

Success criteria:
- shared vocabulary across planning surfaces
- reusable output templates
- clear handoff into implementation workflows like `$forge` and `$crew`

### `0.4.0` — Studio-Connected Build Loop

Goal:
- Make real Studio-state truth easier to use safely during implementation.

New capability:
- stronger official Roblox MCP / upstream `robloxstudio-mcp` integration guidance
- smoother inspector-first workflows
- clearer live-truth vs repo-source split
- better local diagnostics for Studio connection problems

Expected outcome:
- creators can inspect live Studio state with less friction and less confusion

Success criteria:
- safer read-first path
- better onboarding for local Studio connection
- reduced ambiguity between RCS MCP, GitMCP, official Studio MCP, and upstream `robloxstudio-mcp`

### `0.5.0` — Gameplay Systems Scaffold Pack

Goal:
- Ship reusable output lanes for high-value Roblox gameplay systems.

New capability:
- system scaffolds and planning outputs for:
  - combat slices
  - loadout/kit systems
  - inventory/progression systems
  - economy and reward loops
  - HUD / match-state slices

Expected outcome:
- creators can start from verified Roblox-native structures instead of generic codegen

Success criteria:
- scaffold outputs are modular
- respect server authority
- are compatible with repo/workspace standards

### `0.6.0` — Team and Verification Maturity

Goal:
- Turn RCS into a more dependable multi-agent delivery and proof system.

New capability:
- better team-runtime ergonomics
- stronger verification orchestration
- clearer preflight and release proof flows
- more reliable team/worker evidence capture

Expected outcome:
- large creator projects become easier to coordinate without losing trust in outcomes

Success criteria:
- better delivery evidence
- less coordination friction
- fewer red-CI surprises landing late

### `0.7.0` — Plugin and Tool Authoring Suite

Goal:
- Make RCS stronger for Roblox tool/plugin builders, not just experience authors.

New capability:
- richer Studio plugin authoring workflows
- widget/toolbar/state scaffolds
- tool-specific planning and verification outputs
- stronger plugin/runtime patterns

Expected outcome:
- plugin authors can use RCS as a serious Studio-tooling workflow layer

Success criteria:
- plugin outputs are architecturally cleaner
- local/plugin/live-Studio boundaries stay explicit

### `0.8.0` — Cross-Platform Delivery and Adapters

Goal:
- Move from “reference support” to more concrete multi-platform delivery.

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

Success criteria:
- clear source-of-truth boundaries
- platform outputs are emitted or adapted, not forked manually

### `0.9.0` — Release Candidate Hardening

Goal:
- Prepare the platform for a stable `1.0.0`.

New capability:
- stronger compatibility guarantees
- cleaner onboarding guarantees
- firmer documentation and migration rules
- more stable workflow semantics

Expected outcome:
- the project feels predictable enough to call stable

Success criteria:
- CI and release paths are boring
- support matrix is explicit
- docs, workflows, and runtime contracts stop shifting rapidly

### `1.0.0` — Stable Roblox Creator Operating Layer

Goal:
- Reach a stable, trustworthy foundation for AI-assisted Roblox creation.

Definition of done:
- one clear Roblox-native workflow model
- stable setup/runtime/release behavior
- mature planning + implementation + verification surfaces
- strong security/reference posture
- explicit cross-platform compatibility model
- dependable local and remote release proof

Expected outcome:
- RCS is no longer just impressive infrastructure
- it becomes a dependable creator operating layer for serious Roblox builders

## Post-1.0 roadmap

### `1.1.0` — Creator Workflow Depth

Goal:
- Deepen the quality of the core creator workflows without breaking `1.0.0` stability.

New capability:
- stronger output quality for:
  - patch assistant
  - monetization planning
  - retention planning
  - live ops planning
- better cross-linking between planning artifacts and implementation handoff

Expected outcome:
- creators get more consistent end-to-end value from the built-in workflows, not just isolated tools

Success criteria:
- outputs are more reusable across repeated projects
- handoff from planning to implementation is more structured

### `1.2.0` — Studio and Workspace Maturity

Goal:
- Make real Roblox workspace usage smoother and less fragile.

New capability:
- stronger workspace templates
- better Rojo/Wally/Aftman guidance
- clearer project bootstrapping for actual game repos
- safer live Studio inspection/update patterns

Expected outcome:
- creators can use RCS in real Roblox workspaces with less manual setup translation

Success criteria:
- reduced friction in starting a new project
- clearer boundaries between repo truth and live Studio truth

### `1.3.0` — Team Delivery Reliability

Goal:
- Make multi-agent/team execution dependable enough for routine use on larger creator projects.

New capability:
- stronger worker/task decomposition
- better evidence capture
- clearer integration of verification/fix loops
- lower coordination overhead in team mode

Expected outcome:
- teams can trust `crew`/team-style execution more often without excessive babysitting

Success criteria:
- fewer delivery stalls
- clearer completion evidence
- better recovery when one worker lane goes bad

### `1.4.0` — Security and Trust Boundary Maturity

Goal:
- Raise the trust level of RCS in real creator environments.

New capability:
- stronger exploit-pattern guidance
- more explicit trust-boundary docs
- stricter handling of unsafe corpora and external references
- better detection of security-sensitive Roblox patterns

Expected outcome:
- creators are less likely to accept unsafe generated output or confuse raw corpora with production guidance

Success criteria:
- better anti-pattern detection
- stronger safe defaults
- clearer operator warnings for risky integrations

### `1.5.0` — Production Project Readiness

Goal:
- Make RCS more obviously suitable for serious, long-lived Roblox projects.

New capability:
- stronger project templates
- cleaner migration and upgrade guidance
- more stable release and compatibility semantics
- improved observability of runtime/workflow state

Expected outcome:
- real project maintainers can adopt RCS with more confidence over time, not just for experiments

Success criteria:
- release churn is lower
- upgrade path is clearer
- fewer “works in demo, fails in real repo” gaps

### `2.0.0` — Stable Platform

Goal:
- Reach a stable platform state beyond the initial creator-operating-layer baseline.

Definition of done:
- RCS is stable enough that serious creators can rely on it across repeated projects
- workflow semantics are predictable
- core planning/implementation/verification surfaces are mature
- ecosystem compatibility is explicit and maintained
- local and CI/release behavior are consistently dependable

Expected outcome:
- `2.0.0` means RCS is not just stable in principle, but stable in repeated day-to-day use

## Toward broad production adoption

### `2.1.0` — Real Workspace Adoption

Goal:
- Make adoption easier across existing Roblox game repos and team workspaces.

New capability:
- better migration guidance for established repos
- workspace normalization helpers
- stronger compatibility with mixed legacy/current project structures

Expected outcome:
- teams can adopt RCS into an existing project without needing a full reset

Success criteria:
- less friction onboarding established codebases
- better migration confidence

### `2.2.0` — Environment Integration Layer

Goal:
- Make RCS behave more predictably across real local environments.

New capability:
- stronger support docs and tooling for:
  - Windows
  - WSL2
  - macOS
  - Linux
  - containers/devcontainers
  - mixed editor/terminal workflows

Expected outcome:
- fewer environment-specific surprises
- clearer local setup and support expectations

Success criteria:
- better environment diagnosis
- more predictable host/workspace behavior

### `2.3.0` — Organizational Workflow Adoption

Goal:
- Make RCS easier to use as a team standard, not just a solo power-user system.

New capability:
- stronger contributor workflow defaults
- better documentation for repo conventions
- clearer team rollout and policy patterns

Expected outcome:
- teams can standardize around RCS more easily

Success criteria:
- easier contributor onboarding
- clearer org/team-level operating guidance

### `2.4.0` — Creator Operations Suite

Goal:
- Expand from implementation support into a fuller creator operations layer.

New capability:
- tighter integration across:
  - planning
  - shipping
  - patch communication
  - retention
  - live ops
  - monetization

Expected outcome:
- creators can run more of the experience lifecycle through one system

Success criteria:
- strong workflow continuity from concept to release to ongoing operations

### `2.5.0` — Workspace and Runtime Durability

Goal:
- Reduce the remaining “advanced but fragile” parts of the runtime/tooling model.

New capability:
- stronger state durability
- safer recovery flows
- fewer runtime edge-case failures
- cleaner diagnosis when orchestration goes wrong

Expected outcome:
- less operational sharpness in real projects

Success criteria:
- lower recovery friction
- more dependable runtime behavior

### `3.0.0` — Production-Level Creator Platform

Goal:
- Reach a state where RCS can be confidently used as a production-grade creator platform across real environments, real workspaces, and real teams.

Definition of done:
- strong adoption in existing Roblox workspaces, not just greenfield repos
- dependable local/runtime/editor/environment integration
- stable CI/release/process maturity
- mature cross-platform delivery and adapter model
- production-trustworthy planning, implementation, verification, and operational workflows
- clear security posture and low ambiguity around trust boundaries

Expected outcome:
- `3.0.0` means RCS is confidently usable at production level, with existing environment and workspace adoption being a normal path rather than a special case

## Out of scope for the roadmap

These are not roadmap-defining milestones by themselves:

- random internal cleanup only
- docs wording-only releases
- CI refactors with no user-facing outcome
- maintenance-only compatibility shims

They can and should ship, but they are not the identity of a milestone.
