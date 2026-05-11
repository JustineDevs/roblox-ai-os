---
name: blueprint
description: Canonical Roblox Studio consensus-planning workflow for creator architecture, scope, and implementation guidance
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "skill"
---

# Blueprint

Blueprint is the canonical creator planning workflow in RCS.

Use `$blueprint` to turn a creator brief into an execution-ready Roblox Studio plan with the right vocabulary, service boundaries, data flow, and verification path.
Treat creator-docs as canonical when gameplay, UX, monetization, psychology, or Roblox-specific structure already exists in this repo.

Blueprint is the canonical creator-facing equivalent of consensus planning. It drives iterative planning with Planner, Architect, and Critic agents until the plan is explicit, testable, and ready for either `$forge` or `$team`.

## Usage

```text
$blueprint "task description"
$blueprint --interactive "task description"
```

## Flags

- `--interactive`: Enables user prompts at key decision points using the structured question UI.
- `--deliberate`: Forces deliberate mode for high-risk work, including pre-mortem scenarios and expanded test planning.

## Purpose

Blueprint exists to stop planning drift before implementation:
- convert vague feature ideas into Roblox-native architecture
- name the real engine concepts and services involved
- define server/client ownership before a single script changes
- keep the repo from defaulting to generic enterprise abstractions that do not fit a Roblox experience

## What Blueprint Must Produce

- the concrete creator outcome
- the gameplay/system scope
- the exact Roblox services and object model touchpoints
- server/client/shared ownership boundaries
- module/script placement guidance
- data shape guidance using Luau/Roblox terms
- verification steps tied to the changed gameplay or tool flow

## Roblox-Native Planning Rules

- Prefer engine truth over generic software jargon.
- Talk in terms of:
  - Instances
  - services
  - remotes
  - attributes
  - tags
  - replicated state
  - server authority
  - player lifecycle
  - UI trees
  - ModuleScripts
  - typed Luau
- If a plan introduces patterns that feel imported from enterprise backend work, justify them explicitly.
- If a system can be expressed more directly through normal Roblox structures, choose that simpler path.

## GPT-5.5 Guidance Alignment

Use the shared workflow guidance pattern: outcome-first framing, concise visible updates for multi-step planning, local overrides for the active workflow branch, evidence-backed planning and validation expectations, explicit stop rules, right-sized implementation/PRD shape, and automatic continuation for safe reversible steps. Ask only for material, destructive, credentialed, external-production, or preference-dependent branches.

## Consensus Workflow

Blueprint invokes the consensus-planning lane:

```text
$plan --consensus <arguments>
$plan --consensus --interactive <arguments>
```

The consensus workflow:
1. **Planner** creates an adaptive plan and a compact **BLUEPRINT-DR** summary before review. Do not default to exactly five steps; right-size the plan to the real scope:
   - Principles (3-5)
   - Decision Drivers (top 3)
   - Viable Options (>=2) with bounded pros/cons
   - If only one viable option remains, explicit invalidation rationale for alternatives
   - Deliberate mode only: pre-mortem (3 scenarios) + expanded test plan (unit/integration/e2e/observability)
2. **User feedback** `(--interactive only)`: Present the draft plan plus the Principles / Drivers / Options summary before review.
3. **Architect** reviews for architectural soundness and must provide the strongest steelman antithesis, at least one real tradeoff tension, and, when possible, synthesis.
4. **Critic** evaluates against quality criteria. Run only after Architect completes.
5. **Re-review loop** (max 5 iterations): Any non-`APPROVE` Critic verdict must run the full closed loop of revise -> Architect -> Critic until approval or iteration cap.
6. On Critic approval `(--interactive only)`: Present the final plan with approval options:
   - Approve and execute via canonical `$forge`
   - Approve and implement via `$team`
   - Request changes
   - Reject
7. Final plan output **MUST** include:
   - ADR (Decision, Drivers, Alternatives considered, Why chosen, Consequences, Follow-ups)
   - available-agent-types roster
   - follow-up staffing guidance for both `$forge` and `$team`
   - suggested reasoning levels by lane
   - explicit `rcs team` / `$team` launch hints
   - a concrete team verification path
8. On approval: **MUST** hand off to `$forge` or `$team`. Do not implement directly from the planning agent.

> Important: Steps 3 and 4 MUST run sequentially. Await completion before step 4. Do NOT run Architect and Critic in parallel.

## Pre-context Intake

Before consensus planning or execution handoff, ensure a grounded context snapshot exists:

1. Derive a task slug from the request.
2. Reuse the latest relevant snapshot in `.rcs/context/{slug}-*.md` when available.
3. If none exists, create `.rcs/context/{slug}-{timestamp}.md` (UTC `YYYYMMDDTHHMMSSZ`) with:
   - task statement
   - desired outcome
   - known facts/evidence
   - constraints
   - unknowns/open questions
   - likely codebase touchpoints
4. If ambiguity remains high, gather brownfield facts first. When session guidance enables `USE_RCS_EXPLORE_CMD`, prefer `rcs explore` for simple read-only repository lookups with narrow, concrete prompts; otherwise use the richer normal explore path. Then run `$deep-interview --quick <task>` before continuing.
5. If the plan depends on official docs, version-aware framework guidance, best practices, or external dependency behavior, auto-delegate `researcher` before finalizing the planning handoff.

Do not hand off to execution modes until this intake is complete. If urgency forces progress, explicitly document the risk tradeoffs.

## Pre-Execution Gate

### Why the Gate Exists

Execution modes (`$forge`, `autopilot`, `team`, `ultrawork`) are too expensive to launch against a vague request. Blueprint intercepts underspecified execution asks and redirects them into explicit planning first, so code execution starts from a bounded plan instead of a guess.

This ensures:
- explicit scope
- test specification
- planner/architect/critic consensus
- no wasted execution cycles

### Good vs Bad Prompts

**Passes the gate**:
- `forge fix the null check in src/hooks/bridge.ts:326`
- `autopilot implement issue #42`
- `team add validation to function processKeywordDetector`
- `forge do:\n1. Add input validation\n2. Write tests\n3. Update README`

**Gated and redirected to blueprint**:
- `forge fix this`
- `autopilot build the app`
- `team improve performance`
- `forge add player trading`
- `ultrawork make it better`

**Bypass the gate**:
- `force: forge refactor the combat RemoteEvent handlers`
- `! autopilot optimize everything`

### When the Gate Does Not Trigger

The gate auto-passes when it detects any concrete signal such as:
- file path
- issue or PR number
- function/class/symbol name
- explicit test runner target
- numbered steps
- acceptance criteria
- error reference
- provided code block
- escape prefix

### End-to-End Flow Example

1. User types `forge add ranked matchmaking`.
2. Gate detects an execution keyword plus an underspecified prompt.
3. Gate redirects to **blueprint** with a message explaining the redirect.
4. Blueprint consensus runs:
   - Planner creates the initial plan
   - Architect reviews the design
   - Critic validates quality and testability
5. On approval, the user chooses either:
   - `$forge` for sequential execution with verification
   - `$team` for parallel coordinated agents
6. Execution begins with a clear, bounded plan.

## Planning Checklist

1. Identify the player-facing behavior and the creator outcome.
2. Identify the Roblox runtime surfaces involved.
3. Define who owns each mutation:
   - server
   - client
   - shared module
4. Define the canonical data shape using Luau-friendly structures.
5. Define remote/event contracts only where they are truly needed.
6. Define failure cases:
   - stale replication
   - duplicate grant
   - invalid payload
   - out-of-order UI updates
   - partial save/load
7. Define proof:
   - which test
   - which runtime path
   - which state transition proves success

## Anti-Slop Rules

- Do not emit architecture that reads like an enterprise CRUD app unless the repo actually contains that system shape.
- Do not use “DTO”, “controller”, “repository”, “microservice”, “middleware chain”, or similar language by default for Roblox gameplay code.
- Do not hand off to implementation until naming, ownership, and verification are concrete.
- Do not implement directly from blueprint. Approval hands off to `$forge` or `$team`.

## Follow-On Design Lanes

After the core blueprint, expand creator design depth when useful:
- `$blueprint:psych`
- `$blueprint:loop`
- `$blueprint:retention`
- `$blueprint:social`

## Scenario Examples

**Good:** The user says `continue` after the workflow already has a clear next step. Continue the current planning branch instead of restarting discovery or re-asking the same question.

**Good:** The user changes only the downstream delivery shape, such as `make a PR after approval`. Preserve earlier non-conflicting planning constraints and update only the current handoff branch.

**Bad:** The user says `continue`, and the workflow restarts broad discovery or drifts into implementation before the plan and verification path are grounded.

## Example

```text
$blueprint "Plan a cross-server party queue for a Roblox combat experience.
Need:
- TeleportService handoff boundaries
- party ownership and invite data shape
- client/server split for queue UI
- anti-duplication rules for queue join/leave
- verification path for queue sync and teleport readiness"
```
