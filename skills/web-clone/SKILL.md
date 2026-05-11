---
name: web-clone
description: "DEPRECATED: URL-driven website cloning has moved into $visual-forge; use $visual-forge for live-URL visual implementation workflows."
surface-class: "historical"
domain: "archive"
audience: "archive"
artifact-type: "skill"
---

# Web Clone Skill (Hard Deprecated)

`$web-clone` is hard-deprecated. Do not start new work through this skill.

## Migration

Use `$visual-forge` for the migrated live-URL use case. Visual Forge now owns URL-driven visual implementation loops alongside generated-image and static-reference workflows:

- live URL or website cloning request -> `$visual-forge`
- generated mockup/reference request -> `$visual-forge` with `$imagegen`
- static screenshot/reference comparison -> `$forge` with `$visual-verdict`

## Behavior

If this skill is selected by older routing, stop the standalone web-clone pipeline and reroute the task to `$visual-forge` instead. Preserve the user's target URL, fidelity requirements, viewport constraints, and functional parity notes in the Visual Forge handoff.

## Rationale

The URL extraction, visual iteration, and implementation verification responsibilities are now part of Visual Forge's broader visual-delivery workflow. Keeping a second standalone cloning skill would split guidance and make verification behavior drift.
