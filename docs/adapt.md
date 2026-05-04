# `rcs adapt`

`rcs adapt <target>` is the RCS-owned surface for persistent external-agent adaptation.

Shared foundation behavior:

- CLI scaffold for `probe`, `status`, `init`, `envelope`, and `doctor`
- shared capability reporting with explicit ownership (`rcs-owned`, `shared-contract`, `target-observed`)
- adapter-owned paths under `.rcs/adapters/<target>/...`
- shared envelope/status/doctor/init behavior that does not touch `.rcs/state/...`

OpenClaw follow-on behavior:

- `rcs adapt openclaw probe` observes existing local OpenClaw config/env/gateway evidence
- `rcs adapt openclaw status` synthesizes local adapter status from env gates, config source, hook mappings, and command-gateway opt-in
- `rcs adapt openclaw envelope` includes lifecycle bridge metadata for the existing RCS to OpenClaw event mapping
- `rcs adapt openclaw init --write` still writes only under `.rcs/adapters/openclaw/...`

Current targets:

- `openclaw`
- `hermes`

Hermes follow-on behavior in this worktree:

- `probe` inspects external Hermes ACP, gateway, and session-store evidence
- `status` synthesizes `unavailable` / `installed` / `degraded` / `running` from observable Hermes files only
- `envelope` includes Hermes bootstrap metadata for ACP commands, lifecycle bridge guidance, and status commands
- `init --write` still writes only under `.rcs/adapters/hermes/...`; Hermes runtime files remain read-only inputs

Examples:

```bash
rcs adapt openclaw probe
rcs adapt hermes status --json
rcs adapt openclaw init --write
rcs adapt hermes envelope --json
```

Foundation constraints:

- thin adapter surface only, not a bidirectional control plane
- no direct writes to `.rcs/state/...`
- no direct writes to external runtime internals
- target capability reporting stays asymmetric; RCS reports what it owns, what is shared, and what is only target-observed
- OpenClaw status is local evidence only; it does not claim downstream runtime acknowledgement or execution
- command-gateway readiness still requires `RCS_OPENCLAW_COMMAND=1`

Hermes-specific evidence discovery uses `HERMES_HOME` plus an overrideable Hermes source root (`RCS_ADAPT_HERMES_ROOT`) so RCS can inspect an external runtime without vendoring or mutating it.
