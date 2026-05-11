---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "mission"
---

# Remote Contract Hardening

Harden a Roblox feature's remote boundary so client requests cannot mutate economy, inventory, or match state without strict server validation.

## Creator Outcome

Give the creator a remote contract they can implement and review without drifting into generic API language.

## Player Outcome

Players should experience fair, exploit-resistant remote behavior with no client-trusted economy or inventory mutation.

## Deliverable
- a concrete remote contract review
- expected payload shapes
- server-side validation rules
- replay / spam / duplicate-request concerns
- verification notes for exploit-resistant behavior

## Roblox Touchpoints
- `RemoteEvent`
- `RemoteFunction`
- `ReplicatedStorage`
- `ServerScriptService`
- shared `ModuleScript` payload validators

## Required Services
- remote payload validator modules
- authoritative economy or inventory state modules
- server-side rate-limit or duplicate-request protection

## Acceptance Signals
- every client request path reaches server-side schema and authority validation before any mutation
- duplicate or replayed requests resolve safely without double grants
- the creator can point to one authoritative server mutation path for each protected action

## Server-Authority Risks

- client-forged payloads
- replay or duplicate submission
- economy or inventory mutation without server validation

## Anti-Patterns
- trusting client-sent currency totals, inventory ids, or match outcomes
- sharing one remote for unrelated actions without explicit payload discrimination
- validating shape only while skipping authority, cooldown, or ownership checks

## Forbidden Language
- generic REST endpoint framing
- controller/repository jargon
- client-trusted economy shortcuts

## Reference Layers
- `playground/remote_contract_lab/`
- `templates/roblox-scripts/` for anti-pattern spotting only

## Validation

- prove server-side payload validation
- prove no client-trusted state mutation path remains
