---
name: autoforge
description: Canonical end-to-end creator workflow surface for Roblox Creator Skills
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "skill"
---

# Autoforge

Use `$autoforge` to run the creator workflow from brief to blueprint to forge with minimal supervision, while still grounding outputs in Roblox fit, fairness, and creator-usable artifacts.

For Roblox implementation tasks, `$autoforge` must still obey the mandatory gate:

1. classify the task
2. gather Roblox references through the internal RCS knowledge layer
3. standardize official terminology
4. design the modular architecture and file tree
5. only then begin execution

`PRE_ACTION_COMPLETE` must become `true` before any Roblox code generation.
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
