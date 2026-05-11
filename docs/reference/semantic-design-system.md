# Semantic Design System

Status: canonical structure contract for prompts, skills, missions, and guidance.

## Purpose

This file defines the semantic system that active repo surfaces must follow so the project reads
as one coherent Roblox-native product rather than a collection of unrelated role/workflow texts.

The semantic system has three pillars:
- canonical vocabulary
- surface taxonomy
- per-surface schema requirements

Canonical vocabulary is defined in:
- [`docs/reference/canonical-vocabulary.md`](./canonical-vocabulary.md)

## Surface Taxonomy

| Surface | Purpose | Required posture |
|---|---|---|
| prompts | internal specialist execution surfaces | narrow, grounded, non-product-primary |
| skills | canonical or operator workflows | explicit workflow boundaries |
| missions | semantic creator design/evaluation contracts | Roblox-first problem framing |
| AGENTS/runtime guidance | orchestration brain | canonical routing + vocabulary enforcement |

## Metadata Contract

Active prompts, skills, missions, and sandboxes must expose machine-readable frontmatter with:
- `surface-class`
- `domain`
- `audience`
- `artifact-type`

Allowed values:
- `surface-class`: `canonical`, `operator`, `internal`, `historical`
- `domain`: `roblox-studio`, `creator-runtime`, `archive`
- `audience`: `creator`, `operator`, `internal`, `archive`
- `artifact-type`: `prompt`, `skill`, `mission`, `sandbox`

## Prompt Contract

Prompts must:
- use the canonical vocabulary by default
- stay role-scoped, not product-onboarding scoped
- prefer Roblox/creator examples when examples are needed
- avoid teaching removed compatibility roles as the normal mental model
- be classified as `internal` prompt surfaces unless they are intentionally archived

## Skill Contract

Skills must be classified as one of:
- canonical
- operator
- internal
- historical

Canonical skills must:
- be Roblox Studio / creator native in name, examples, and remit
- point to real creator outcomes
- avoid generic web-enterprise framing by default

## Mission Contract

Every mission bundle should communicate the same semantic shape.

### `mission.md` required sections

1. Title
2. Creator Outcome
3. Player Outcome
4. Deliverable
5. Roblox Touchpoints
6. Required Services
7. Acceptance Signals
8. Server-Authority Risks
9. Anti-Patterns
10. Forbidden Language
11. Reference Layers
12. Validation

### `sandbox.md` required sections

1. evaluation command
2. scope statement
3. tightly scoped lab/playground path
4. out-of-scope statement
5. required services
6. acceptance signals
7. anti-patterns
8. forbidden language
9. reference layers
10. vocabulary guardrail

## Enforcement

The repo should keep lightweight tests that verify:
- canonical vocabulary doc exists
- AGENTS/skills reference the canonical vocabulary
- active prompts/skills/missions expose valid taxonomy metadata
- mission files follow the semantic mission schema
- generated surface-map output stays synced to taxonomy metadata
- active public/generated surfaces do not re-expose removed compatibility labels
