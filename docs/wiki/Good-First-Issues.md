# Good First Issues and Labels

This page defines the maintainer standard for contributor-friendly task shaping.

## Required labels

- `good first issue` — small, safe, self-contained task with explicit acceptance criteria
- `help wanted` — useful task that is open to outside contribution, but may require more repo context
- `docs` — documentation surface
- `localization` — translation or locale-sync work
- `wiki` — contributor wiki or runtime wiki documentation surface
- `contributor experience` — onboarding, templates, setup, or workflow ergonomics

## What qualifies as a good first issue

- one surface or subsystem
- no hidden cross-repo dependency
- clear reproduction or acceptance criteria
- easy local verification path
- no risky release, auth, or multi-runtime migration work

## Good first issue examples in this repo

- clarify a Roblox-first prompt or skill example
- improve docs or setup wording
- sync README locale drift after a root README change
- add a missing focused test for a small contract
- fix a small CLI/help text mismatch
- tighten release notes or contributor guidance

## What should not be labeled good first issue

- large runtime refactors
- release workflow surgery without a focused scope
- tmux/team-state concurrency work with unclear blast radius
- broad prompt taxonomy rewrites
- changes that require maintainer-only credentials or environment access

## Maintainer checklist before applying the label

- task is broken down enough to fit in one PR
- expected files are named
- verification path is stated
- hidden blockers are removed or called out
