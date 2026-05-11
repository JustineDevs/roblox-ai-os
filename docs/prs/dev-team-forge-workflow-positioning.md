> Archive context: retained release and migration collateral from the pre-v0.1.0 fork-to-RCS transition. Links are normalized to the canonical JustineDevs repository, but historical chronology and contributor references may still describe pre-fork development.

# PR Draft: Document the `blueprint -> team -> forge` workflow

## Target branch
`dev`

## Summary
This PR documents one of RCS's strongest high-control workflows: `blueprint -> team -> forge`. The goal is to make the README explain not only that team mode exists, but why it matters even when `$ultrawork` already provides parallel execution.

The key point is that team mode is not just fanout. It is coordinated, inspectable, runtime-aware execution. Workers can share blocker awareness, execution stays visible through tmux panes plus durable state, and the leader retains stronger control over recovery and lifecycle commands. Pairing that with `blueprint` up front and `forge` at the back creates a workflow that is both fast and operationally disciplined.

## Changes
- clarify the positioning difference between `$team` and `$ultrawork`
- add README guidance for the recommended high-control workflow: `blueprint -> team -> forge`
- add an issue draft proposing stronger `blueprint` support for team follow-up planning, such as `--followup team`

## Why this is good
- Explains a real product strength more clearly to contributors and users.
- Helps advanced users understand when to choose team mode over simpler parallel fanout.
- Frames a credible design direction: planning output that already anticipates team staffing and follow-up execution.
- Makes `autopilot` easier to explain too, because it can be described as an automatic chaining layer over the same underlying workflow.

## Design direction
The docs position `blueprint` as the place where team follow-up should become more explicit. In future work, `blueprint` can emit lane recommendations, role placement hints, and launch guidance for a direct `team` handoff, while `forge` remains the persistence and verification layer.

## Expected outcomes
- Better onboarding for users evaluating RCS's orchestration model
- Easier explanation of why team mode is distinct from ultrawork
- Clearer path from planning to execution for future feature work
- Better support for mixed-CLI teams and runtime-heavy edge-case work

## Validation
- [ ] `npm run build` *(TypeScript build)*
- [ ] `npm test`

## Related
- Proposed issue: `docs/issues/team-forge-followup-team.md`
