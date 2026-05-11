# Issue Draft: Make `blueprint` first-class for `team` follow-up planning

## Title
[Feature] Make `blueprint` emit explicit `team` follow-up guidance (for example `--followup team`)

## Problem
RCS already has the ingredients for a strong high-control workflow: `blueprint` for scoped planning and `team` for durable multi-worker execution with its own verification lanes. What is still under-explained and under-productized is the handoff between planning and team execution.

Today, experienced users can manually infer the pattern: run `blueprint`, then launch `team`, and let team own delivery plus verification unless a later single-owner follow-up is genuinely needed. The workflow's biggest advantage is not just parallelism. It is coordinated execution: teammates can surface blockers early, redistribute work, and stay inspectable through panes plus runtime state. That benefit should be reflected directly in planning output.

## Proposed solution
Teach `blueprint` to support an explicit team-oriented follow-up mode, such as `--followup team`, that produces:

1. a normal implementation plan and acceptance criteria
2. recommended worker lanes / role allocation
3. suggested reasoning levels by lane
4. explicit follow-up commands or launch hints for `rcs team` / `$team`
5. verification expectations that fit a standalone `team` execution path, plus optional later Forge follow-up guidance only when needed

This would make the intended workflow clearer:

```text
blueprint -> team
```

## Why this is good
- Clarifies why `team` exists alongside `ultrawork`: team mode is about coordination and runtime control, not only fanout.
- Reduces the gap between planning output and actual coordination flow.
- Makes one of RCS's strongest workflows more discoverable for advanced users.
- Improves execution quality on runtime-edge-case and workflow-edge-case work, where durable coordination matters more than raw task splitting.
- Fits RCS's architecture well because the runtime already supports worker roles, mixed CLIs, runtime state, and inspectable team lifecycle commands.

## Alternatives considered
- Keep the pattern implicit in docs only. This helps discovery, but still leaves users to translate plans into worker lanes manually.
- Fold everything into `autopilot`. Useful for default automation, but weaker for users who want direct control over planning, staffing, and verification.

## Additional context
Expected user outcome: a user runs `blueprint`, sees a plan that is already shaped for team execution, launches `team` with less guesswork, and only escalates to `forge` later if a persistent single-owner follow-up is still needed after team execution.
