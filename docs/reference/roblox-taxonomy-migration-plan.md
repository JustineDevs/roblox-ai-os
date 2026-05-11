# Roblox Taxonomy Migration Plan

This cleanup pass is a repository taxonomy migration, not a wording-only edit.

## Goal

Move the repository away from generic orchestration / research / enterprise framing and toward a Roblox-first structure:
- Roblox scripting
- Luau data shapes
- server authority
- remotes
- DataStore flows
- GUI state
- gameplay architecture
- creator psychology
- feature design
- live-ops / retention / roadmap language

## Scope For This Pass

1. Replace off-domain showcase content under `missions/`, `playground/`, and related `src/scripts/eval/` surfaces.
2. Remove obvious off-domain names such as ML/Kaggle/Bayes-opt/sorting demos.
3. Replace them with Roblox-focused labs and mission contracts.
4. Rewrite top-level docs that advertise those old showcases.
5. Keep the runtime/build intact while reducing unrelated repository noise.

## Smells Being Removed

- Off-domain benchmark naming
- Non-Roblox demo content
- Mission contracts that teach the wrong product identity
- Playground examples that imply data-science tooling is a core RCS concern
- Demo docs that advertise generic research showcases instead of Roblox creator workflows

## Safety Rules

- Do not change core CLI/runtime behavior in this pass unless required to remove dead references.
- Prefer deleting irrelevant showcase surfaces over preserving them behind compatibility wrappers.
- Keep new examples grounded in Roblox Studio concepts and Luau syntax.
- Re-run build, lint, and targeted contract checks after the refactor.

## Follow-Up Passes

- Rename deeper runtime identifiers still using lower-level legacy names.
- Refactor remaining prompts/skills that still read like generic enterprise/software guidance.
- Replace or remove internal/team-only surfaces that no longer fit the desired Roblox-only product narrative.
