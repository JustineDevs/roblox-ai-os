# Roblox creator mission contracts

This folder now holds Roblox-first mission bundles used to pressure-test creator workflows, design review, and implementation guidance against actual Studio concepts.

Each mission directory contains:
- `mission.md` — creator objective, target gameplay/system, and required deliverable
- `sandbox.md` — bounded touchpoints, validation contract, and constraints

Semantic schema source:
- `docs/reference/semantic-design-system.md`
- `docs/reference/canonical-vocabulary.md`

Current mission families:
- `remote-contract-hardening/`
- `profile-datastore-recovery/`
- `gui-onboarding-clarity/`
- `cross-server-party-flow/`
- `liveops-reward-loop-balance/`

These missions are intended to keep RCS grounded in:
- Luau and ModuleScript structure
- server/client ownership
- remotes and replication
- DataStore safety
- GUI state flow
- retention and live-ops creator decisions

Mission semantic contract:
- `mission.md` should express:
  - frontmatter taxonomy (`surface-class`, `domain`, `audience`, `artifact-type`)
  - Creator Outcome
  - Player Outcome
  - Deliverable
  - Roblox Touchpoints
  - Required Services
  - Acceptance Signals
  - Server-Authority Risks
  - Anti-Patterns
  - Forbidden Language
  - Reference Layers
  - Validation
- `sandbox.md` should express:
  - frontmatter taxonomy (`surface-class`, `domain`, `audience`, `artifact-type`)
  - evaluation
  - scope
  - tightly scoped lab/playground path
  - out-of-scope
  - required services
  - acceptance signals
  - anti-patterns
  - forbidden language
  - reference layers
  - vocabulary guardrail

Reference layer:
- `templates/roblox-scripts/` is a raw Lua-script corpus that can be used as a separate inspiration and anti-pattern layer.
- Treat it as untrusted reference material, not drop-in production code.
- Any borrowed idea must be rewritten into repo-native Roblox architecture before it counts as a valid mission solution.

Run a focused evaluator directly:

```bash
node dist/scripts/eval/eval-remote-contract-hardening.js
node dist/scripts/eval/eval-profile-datastore-recovery.js
node dist/scripts/eval/eval-gui-onboarding-clarity.js
node dist/scripts/eval/eval-cross-server-party-flow.js
node dist/scripts/eval/eval-liveops-reward-loop-balance.js
```

These bundles are not generic research-showcase artifacts anymore. They are repository-native Roblox creator mission contracts.
