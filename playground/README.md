# Roblox creator labs

This folder now holds lightweight Roblox-first labs used to keep RCS examples aligned with Studio concepts instead of generic optimization demos.

## Layout

- `playground/remote_contract_lab/` — RemoteEvent / RemoteFunction request-shape and server-validation examples
- `playground/profile_datastore_lab/` — DataStore profile schema, save/retry, and recovery flow examples
- `playground/gui_onboarding_lab/` — onboarding HUD state, prompt flow, and player-first UI examples
- `playground/party_queue_lab/` — party formation and cross-server flow notes
- `playground/liveops_reward_lab/` — retention, reward cadence, and seasonal offer examples
- `missions/*` — matching creator mission contracts
- `src/scripts/eval/*` — focused evaluators that sanity-check the lab structure and language

## Intent

These labs should teach or reinforce:
- Luau syntax and table shapes
- server authority over client guesses
- remotes, attributes, and replication boundaries
- ModuleScript organization
- DataStore recovery and idempotency
- GUI state and onboarding clarity
- retention, marketing hooks, and game-design feedback loops

## Current lab index

| Lab | Mission | Focus |
|---|---|---|
| `remote_contract_lab/` | `missions/remote-contract-hardening/` | remote payload validation and exploit resistance |
| `profile_datastore_lab/` | `missions/profile-datastore-recovery/` | profile state, retry safety, and recovery rules |
| `gui_onboarding_lab/` | `missions/gui-onboarding-clarity/` | first-session clarity, HUD state, and player guidance |
| `party_queue_lab/` | `missions/cross-server-party-flow/` | party lifecycle and cross-server handoff |
| `liveops_reward_lab/` | `missions/liveops-reward-loop-balance/` | retention cadence, event rewards, and monetization guardrails |

## Evaluators

```bash
node dist/scripts/eval/eval-remote-contract-hardening.js
node dist/scripts/eval/eval-profile-datastore-recovery.js
node dist/scripts/eval/eval-gui-onboarding-clarity.js
node dist/scripts/eval/eval-cross-server-party-flow.js
node dist/scripts/eval/eval-liveops-reward-loop-balance.js
```

## Repository hygiene

This folder should stay Roblox-specific:
- no ML demos
- no generic black-box optimization showcases
- no unrelated research benchmark language
- no domain examples that teach the wrong product identity
