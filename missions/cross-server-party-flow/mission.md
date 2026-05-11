---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "mission"
---

# Cross-Server Party Flow

Define a Roblox party queue flow that keeps party membership, teleport readiness, and join/leave state coherent across server boundaries.

## Creator Outcome

Give the creator a cross-server party/queue model they can implement with Roblox services and clear authority boundaries.

## Player Outcome

Players should experience stable party membership, queue transitions, and teleport readiness across servers.

## Deliverable
- party lifecycle map
- queue state ownership
- teleport handoff rules
- dead-party / stale-member recovery notes
- verification notes for multi-player transitions

## Roblox Touchpoints
- `TeleportService`
- shared party state modules
- queue remotes
- lobby / destination place handoff

## Required Services
- `TeleportService`
- party membership state modules
- queue or matchmaking remotes
- destination-place readiness handoff logic

## Acceptance Signals
- party membership stays coherent through join, leave, ready, queue, and teleport transitions
- stale members or abandoned parties are cleaned up without stranding active players
- the creator can describe one authoritative owner for queue state at each phase

## Server-Authority Risks

- stale party membership across server handoff
- duplicate queue joins
- teleport readiness inferred from client-only state

## Anti-Patterns
- keeping queue truth only in client UI state
- teleporting parties without re-checking member readiness and ownership
- treating cross-server flow as generic distributed-systems design instead of player lifecycle design

## Forbidden Language
- generic distributed-systems buzzwords without player-state mapping
- service-mesh/event-bus framing
- client-trusted ready-state shortcuts

## Reference Layers
- `playground/party_queue_lab/`
- `templates/roblox-scripts/` for handoff anti-pattern review only

## Validation

- verify party lifecycle transitions
- verify stale-member cleanup and teleport handoff behavior
