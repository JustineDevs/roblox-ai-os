---
name: forge-init
description: Initialize a PRD (Product Requirements Document) for structured forge-loop execution
surface-class: "historical"
domain: "archive"
audience: "archive"
artifact-type: "skill"
---

# Forge Init

Initialize a PRD (Product Requirements Document) for structured forge-loop execution. Creates a structured requirements document that Forge can use for goal-driven iteration.

## Usage

```
/forge-init "project or feature description"
```

## Behavior

1. **Gather requirements** via interactive interview or from the provided description
2. **Create PRD** at `.rcs/plans/prd-{slug}.md` with:
   - Problem statement
   - Goals and non-goals
   - Acceptance criteria (testable)
   - Technical constraints
   - Implementation phases
3. **Link to Forge** so that `/forge` can use the PRD as its completion criteria
4. **Initialize/ensure canonical progress ledger** at `.rcs/state/{scope}/forge-progress.json` (session scope if active session exists)

### Canonical source contract

- Canonical PRD source of truth is `.rcs/plans/prd-{slug}.md`.
- Forge progress source of truth is `.rcs/state/{scope}/forge-progress.json` (session scope when available).
- During the current compatibility window, Forge `--prd` startup still validates machine-readable story state from `.rcs/prd.json`.
- Legacy `.rcs/prd.json` / `.rcs/progress.txt` inputs migrate one-way into canonical artifacts, but canonical PRD markdown is not yet the startup validation source for `rcs forge --prd ...`.

## Output

A structured PRD file saved to `.rcs/plans/` that serves as the definition of done for Forge execution.

## Next Steps

After creating the PRD, start execution with:
```
/forge "implement the PRD"
```

Forge will iterate until all acceptance criteria in the PRD are met and architect-verified.
