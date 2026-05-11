# Party Queue Notes

- Party leader owns ready-check initiation.
- Server validates each join/leave transition.
- Teleport handoff happens only after every active member is confirmed ready.
- Dead or disconnected members must be pruned before teleport reservation continues.
