> Archive context: this canonical release note consolidates pre-v0.1.0 retained release-note collateral into one RCS-owned historical surface for the v0.1.0 ship line.

# Roblox Creator Skills v0.1.0

## Summary

`v0.1.0` is the first strict RCS-owned ship candidate after the fork-to-RCS transition. This release consolidates the retained pre-v0.1.0 release-note train into one canonical archival note and defines the current shipped product surface as **Roblox Creator Skills for Codex**.

## Canonical product surface

- Package: `@jstn-sdk/rcs`
- Owner: `JustineDevs`
- Repository: `https://github.com/JustineDevs/roblox-ai-os`
- Product: `Roblox Creator Skills`
- Short identity: `RCS`

## Shipped product direction

- Creator-first workflow family:
  - `$brief`
  - `$blueprint`
  - `$forge`
  - `$crew`
  - `$autoforge`
- Psychology design layer for Roblox experience design:
  - audience, motivation, loop, retention, social, progression, status, mastery, community, reward-loop, daily-loop, event-loop, and FOMO surfaces
- Roblox pre-action gate:
  - resource grounding
  - official-term normalization
  - architecture-first modular planning
  - explicit `PRE_ACTION_COMPLETE` before implementation
- First-party Codex plugin bundle:
  - mirrored skills
  - plugin metadata
  - bundled psychology and Roblox planning assets

## Consolidation note

The old retained release-note files from the pre-v0.1.0 migration train were preserved only as transitional collateral. They are now consolidated into this single archival surface to avoid version drift, duplicated wording, and mixed ownership language across release/readiness docs.

## Historical scope covered by the consolidation

Per-version `docs/release-notes-0.*.md` files from earlier trains have been **removed from the tree**; their substance is represented here at a high level and remains recoverable from **git history** if a line-by-line comparison is needed.

## Verification and release-collateral expectations

- **`CHANGELOG.md`** is the canonical changelog surface (currently the consolidated **`[0.1.0]`** entry plus `[Unreleased]`).
- **`RELEASE_BODY.md`** is the release-body / GitHub summary template aligned with that ship line.
- **`docs/qa/release-readiness-*.md`** are retained readiness snapshots; update or archive them if they still point at removed per-version release-note paths.

## Archival boundary

This file is archival collateral, not a claim that every retained pre-v0.1.0 development snapshot is independently ship-ready. It exists to keep one coherent historical release-note surface while the canonical shipped identity remains RCS-owned and Roblox-focused.
