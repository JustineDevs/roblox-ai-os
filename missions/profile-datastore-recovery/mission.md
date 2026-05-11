---
surface-class: "canonical"
domain: "roblox-studio"
audience: "creator"
artifact-type: "mission"
---

# Profile DataStore Recovery

Design and verify a Roblox profile persistence flow that survives save failures, duplicate joins, and partial recovery without corrupting player state.

## Creator Outcome

Give the creator a persistence recovery shape they can reason about in Roblox terms.

## Player Outcome

Players should keep coherent progress and profile state across reconnects, save retries, and recovery flows.

## Deliverable
- profile schema notes
- load / save / retry / backoff rules
- shutdown and reconnect handling
- idempotency concerns
- bounded recovery behavior for stale or missing records

## Roblox Touchpoints
- `DataStoreService`
- profile tables
- save queues
- reconciliation logic

## Required Services
- `DataStoreService`
- profile/session lock module
- retry/backoff queue or scheduler

## Acceptance Signals
- duplicate join or reconnect paths do not overwrite newer profile state
- recovery logic is bounded and idempotent rather than open-ended
- the creator can explain when progress is retried, deferred, or rejected

## Server-Authority Risks

- duplicate joins racing a live save
- stale profile writes overwriting newer state
- reconnect recovery applying partially trusted client assumptions

## Anti-Patterns
- writing profile snapshots from stale client mirrors
- mixing save ownership across multiple unsynchronized scripts
- retry loops with no cap, backoff, or stale-session guard

## Forbidden Language
- generic database failover jargon
- SQL-first persistence framing
- backend service abstractions that hide Roblox session ownership

## Reference Layers
- `playground/profile_datastore_lab/`
- `templates/roblox-scripts/` for recovery anti-pattern review only

## Validation

- verify idempotent save/recovery rules
- verify bounded stale-record handling
