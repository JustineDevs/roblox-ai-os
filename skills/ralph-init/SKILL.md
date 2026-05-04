---
name: ralph-init
description: Initialize a PRD (Product Requirements Document) for structured ralph-loop execution
---

# Ralph Init

Initialize a PRD (Product Requirements Document) for structured ralph-loop execution. Creates a structured requirements document that Ralph can use for goal-driven iteration.

## Usage

```
/ralph-init "project or feature description"
```

## Behavior

1. **Gather requirements** via interactive interview or from the provided description
2. **Create PRD** at `.rcs/plans/prd-{slug}.md` with:
   - Problem statement
   - Goals and non-goals
   - Acceptance criteria (testable)
   - Technical constraints
   - Implementation phases
3. **Link to Ralph** so that `/ralph` can use the PRD as its completion criteria
4. **Initialize/ensure canonical progress ledger** at `.rcs/state/{scope}/ralph-progress.json` (session scope if active session exists)

### Canonical source contract

- Canonical PRD source of truth is `.rcs/plans/prd-{slug}.md`.
- Ralph progress source of truth is `.rcs/state/{scope}/ralph-progress.json` (session scope when available).
- During the current compatibility window, Ralph `--prd` startup still validates machine-readable story state from `.rcs/prd.json`.
- Legacy `.rcs/prd.json` / `.rcs/progress.txt` inputs migrate one-way into canonical artifacts, but canonical PRD markdown is not yet the startup validation source for `rcs ralph --prd ...`.

## Output

A structured PRD file saved to `.rcs/plans/` that serves as the definition of done for Ralph execution.

## Next Steps

After creating the PRD, start execution with:
```
/ralph "implement the PRD"
```

Ralph will iterate until all acceptance criteria in the PRD are met and architect-verified.
