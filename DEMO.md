> Active demo surface: this guide now demonstrates the Roblox-first creator workflow and workspace/runtime layers. Generic enterprise-style demo examples were intentionally removed from the primary path.

# Roblox Creator Skills Demo Guide

This guide shows the **intended product path** for RCS.

Use it to demonstrate Roblox Studio creator workflows, not generic web or enterprise coding patterns.

## Prerequisites

- Node.js >= 20
- [Codex CLI](https://github.com/openai/codex) installed
- Codex auth configured
- `tmux` on macOS/Linux if you want the recommended durable team runtime

## Setup

```bash
git clone https://github.com/JustineDevs/roblox-ai-os.git
cd roblox-ai-os
npm install
npm run build
npm link
rcs setup
rcs doctor
codex login status
rcs exec --skip-git-repo-check -C . "Reply with exactly RCS-EXEC-OK"
```

Success means:
- RCS files and hooks are installed
- the active Codex profile is authenticated
- the current shell/profile can complete a real model call

## Demo 1: Creator Workflow

Launch the recommended runtime:

```bash
rcs --madmax --high
```

Then use the canonical creator path:

```text
$brief "clarify the creator workflow change"
$blueprint "approve the implementation path for a new trading RemoteEvent flow"
$forge "carry the approved remote hardening plan to completion"
$crew "execute the approved creator plan in parallel"
```

Expected:
- `$brief` clarifies creator intent and scope
- `$blueprint` produces a Roblox-shaped plan
- `$forge` drives one-owner completion and verification
- `$crew` coordinates parallel creator execution when the work is large enough

## Demo 2: Roblox-Native Specialist Prompts

Use prompts in Roblox-first language:

```text
$architect "review server authority for the new trading RemoteEvent surface"
$security-reviewer "review RemoteEvent validation and inventory mutation safety"
$debugger "trace why the trade server script accepts a stale inventory item payload"
$writer "document the trade remote contract and server-side validation rules"
```

Expected:
- architecture language is grounded in ModuleScripts, remotes, client/server ownership, and creator outcomes
- security language is grounded in exploit resistance, remote spoofing, and DataStore/economy safety
- debugging language traces Roblox runtime/state bugs instead of generic backend guesswork

## Demo 3: Roblox Creator Labs

The main lab hub is:

```text
playground/README.md
```

Focused evaluators:

```bash
node dist/scripts/eval/eval-remote-contract-hardening.js
node dist/scripts/eval/eval-profile-datastore-recovery.js
node dist/scripts/eval/eval-gui-onboarding-clarity.js
node dist/scripts/eval/eval-cross-server-party-flow.js
node dist/scripts/eval/eval-liveops-reward-loop-balance.js
```

These labs cover:
- remote validation
- DataStore recovery
- onboarding/HUD clarity
- cross-server party flow
- live-ops reward-loop balance

This is the **primary demo path** for product identity.

## Demo 4: Roblox Workspace Standard

RCS now ships a real Roblox Studio workspace baseline:

```text
default.project.json
wally.toml
aftman.toml
stylua.toml
selene.toml
src/roblox/
src/studio-plugin/
```

Expected:
- Rojo mapping exists
- Luau workspace folders are source-controlled
- plugin source layout is standardized
- workspace rules are documented in:
  - `docs/reference/roblox-workspace-standard.md`

## Demo 5: Optional Live Studio Connection

When you want real-time Studio inspection or writes against an open Studio session, use the optional upstream compatibility lane:

```bash
codex mcp add robloxstudio -- npx -y robloxstudio-mcp@latest
codex mcp add robloxstudio-inspector -- npx -y robloxstudio-mcp-inspector@latest
```

Reference:

```text
docs/reference/robloxstudio-mcp-compatibility.md
```

Expected:
- RCS remains the workflow/runtime layer
- `robloxstudio-mcp` becomes the optional live Studio transport layer

## Demo 6: Advanced Team Runtime

This is an operator demo, not the primary onboarding path.

Use when you want durable multi-worker execution:

```bash
rcs team 5:executor "parallel creator runtime smoke"
rcs team status <team-name>
rcs team resume <team-name>
rcs team shutdown <team-name>
```

Expected:
- tmux-backed workers launch
- mailbox/state lifecycle stays inspectable
- team runtime behaves like a coordinated execution surface, not an ad-hoc prompt fanout

## What This Demo Guide No Longer Teaches

This file no longer treats these as first-class product demos:
- generic REST API builds
- generic task-management apps
- generic database-query demos
- generic “fix all TypeScript errors” demos

Those patterns do not represent the intended public identity of RCS.

## Reference Map

- Main README: [README.md](./README.md)
- Getting Started: [docs/getting-started.html](./docs/getting-started.html)
- Playground hub: [playground/README.md](./playground/README.md)
- Workspace standard: [docs/reference/roblox-workspace-standard.md](./docs/reference/roblox-workspace-standard.md)
- Live Studio compatibility: [docs/reference/robloxstudio-mcp-compatibility.md](./docs/reference/robloxstudio-mcp-compatibility.md)
