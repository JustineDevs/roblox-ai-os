---
name: forge
description: Persistent Roblox Studio execution loop that carries an approved creator plan to verified completion
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "skill"
---

# Forge

Forge is the canonical creator execution workflow in RCS.

Use `$forge` when an approved Roblox creator plan needs one owner who keeps pushing until the work is actually complete, verified, and internally consistent.

## Purpose

Forge exists to finish Roblox Studio work without drifting back into generic web-enterprise habits:
- keep the implementation grounded in Roblox services, Instance hierarchies, Luau constraints, and client/server trust boundaries
- keep naming aligned with Roblox concepts such as `RemoteEvent`, `RemoteFunction`, `ModuleScript`, `Attribute`, `DataStore`, `CollectionService`, and `Humanoid`
- keep verification real: play the exact changed flow, run the relevant tests/tools, and confirm the experience behavior rather than stopping at prose confidence

## Use When

- A `$blueprint` plan is approved and now needs implementation.
- The task crosses multiple Roblox scripts/services and should not stop at partial completion.
- The work needs repeated fix/verify loops: remotes, persistence, replication, economy, combat, UI state, or gameplay systems.
- The user is effectively saying “ship this fully” or “keep going until it’s actually done.”

## Do Not Use When

- The task is still ambiguous. Use `$brief` or `$blueprint` first.
- The user only wants design artifacts, loop specs, or monetization frameworks rather than code changes.
- The task needs coordinated parallel staffing. Use `$crew`, then return to `$forge` only if a persistent single-owner closeout loop is still useful.

## Roblox-Native Guardrails

- Default to Luau/Studio concepts before generic backend/web abstractions.
- Name systems by gameplay or engine behavior, not enterprise platform jargon.
- Respect server authority:
  - clients request
  - servers validate
  - servers mutate canonical state
- Prefer concrete Roblox touchpoints in reasoning:
  - `ServerScriptService`
  - `ReplicatedStorage`
  - `StarterPlayer`
  - `StarterGui`
  - `Workspace`
  - `CollectionService`
  - `MarketplaceService`
  - `TeleportService`
  - `DataStoreService`
- Do not invent fake type systems or DTO-heavy ceremony when normal Luau tables, typed Luau annotations, and ModuleScripts are enough.
- Do not import enterprise “service/repository/controller” structure by reflex when the codebase or experience model does not need it.

## Execution Loop

### Pre-context intake

Before execution begins, create or load a context snapshot at `.rcs/context/{task-slug}-{timestamp}.md`.

Minimum snapshot fields:
- task statement
- desired outcome
- known facts/evidence
- constraints
- unknowns/open questions
- likely codebase touchpoints

If the request is still ambiguous, run `$deep-interview --quick <task>` before the implementation loop and reuse the resulting context instead of improvising from memory.
Do not begin Forge execution work until that grounding context exists.

1. Re-read the approved blueprint and extract the exact Roblox services, scripts, remotes, data tables, UI objects, and replication edges involved.
2. Confirm the ownership split:
   - server scripts
   - client scripts
   - shared ModuleScripts
   - assets/instances/config data
3. Implement the smallest complete vertical slice first.
4. Re-run the most relevant proof immediately:
   - targeted unit/test harness
   - build/lint/typecheck where present
   - exact gameplay/runtime path affected
5. Continue iterating until the changed flow is green and consistent across touched files.
6. End only after verification evidence is fresh and the touched surfaces use one coherent Roblox-native vocabulary.

### MCP/state fallback guidance

If an MCP state call fails, do **not** retry the same MCP call blindly. Use the CLI parity path instead:

`rcs state write --input '<json>' --json`

When falling back, do so while preserving `workingDirectory` and `session_id` so state stays scoped to the current Forge run.

## Verification Standard

At minimum, capture the smallest evidence that proves the change:
- remote validation path works
- replicated state updates correctly
- DataStore/economy logic preserves server authority
- UI logic reflects authoritative state rather than stale client guesses
- changed scripts/modules still pass repo checks where applicable

Do not claim completion from static inspection alone when the behavior depends on runtime replication, remotes, or Studio-side state.

## Lua Script Reference Layer

This repo also carries a raw Lua-script corpus under `templates/roblox-scripts/`.

Treat that corpus as a **reference layer only**:
- mine it for naming patterns, UI ideas, anti-pattern detection, and legacy idioms worth translating
- never assume the scripts are production-safe or architecture-safe
- never paste raw scripts into shipped code without rewriting them into Roblox-native, server-authoritative, repo-consistent structures
- prefer first-party repo patterns, typed Luau, ModuleScripts, and approved creator architecture over raw script dumps

## Visual iteration gate

When screenshot or reference-image work is in scope:
- run `$visual-verdict` before every next edit
- require structured JSON with `score`, `verdict`, `category_match`, `differences[]`, `suggestions[]`, and `reasoning`
- persist numeric + qualitative feedback to `.rcs/state/{scope}/forge-progress.json`
- default pass threshold: `score >= 90`

Forge accepts repeatable image inputs:
- `-i <image-path>`
- `--images-dir <directory>`

## Pre-Action Dependency

For creator-domain work, Forge expects the pre-action groundwork to exist:
- clear creator goal
- normalized Roblox terminology
- agreed file/module layout
- explicit risk notes for unsafe assumptions

If that groundwork is missing, produce it first through the creator planning lane instead of improvising a code pass from memory.
Do not generate implementation code until that creator planning groundwork is present.

## PRD mode

When Forge is launched in PRD mode, run deep-interview in quick mode before creating PRD artifacts.

- Run deep-interview in quick mode before creating PRD artifacts
- Invoke `$deep-interview --quick <task>`
- Persist the interview to `.rcs/interviews/{slug}-{timestamp}.md`
- `--no-deslop` is supported; when present, skip the deslop pass for that Forge run

`skills/forge-init` remains aligned with the current startup compatibility contract while `.rcs/prd.json` is still the machine-readable validation source.

## Final deslop contract

Step 7.5: Mandatory Deslop Pass
- run `roblox-ai-os-creator-skills:ai-slop-cleaner`
- changed files only
- standard mode
- not `--review`

Step 7.6: Regression Re-verification
- re-run all tests/build/lint
- roll back cleaner changes or fix and retry if regression fails

## Forge completion checklist

- [ ] ai-slop-cleaner pass completed on changed files (or --no-deslop specified)
- [ ] Post-deslop regression tests pass

## Follow-On Creator Design Lanes

Forge can hand off or cross-check with the creator design skills when the implementation depends on product logic clarity:

Follow with:
- `$forge:reward-loop`
- `$forge:daily-loop`
- `$forge:event-loop`
- `$forge:progression`
- `$forge:status`
- `$forge:fomo`
- `$forge:mastery`
- `$forge:community`

## Example

```text
$forge "Implement the approved trading system:
- server validates every trade offer and acceptance
- inventory replication stays authoritative
- StarterGui trade UI only mirrors server-confirmed state
- verify duplicate acceptance cannot double-grant items"
```
