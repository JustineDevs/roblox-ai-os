## Learned User Preferences

- Keep public docs, changelog, and release notes aligned to RCS / roblox-ai-os branding and Roblox creator workflows.
- Prefer Roblox-native concepts, terms, syntax, data flow, and creator language over generic orchestration or enterprise-software framing.

## Learned Workspace Facts

- On Windows, Node tests in this tree that shell out to fake `tmux` or prepend fake bins to `PATH` should use `path.delimiter`, resolve `dist/` script paths with `fileURLToPath(new URL(..., import.meta.url))` instead of `URL#pathname`, and use bash-backed shims when the harness relies on `#!/usr/bin/env bash` stubs.

## Execution Protocol
<!-- RCS:GUIDANCE:OPERATING:START -->
- Default to outcome-first, quality-focused responses: identify the user's target result, success criteria, constraints, available evidence, expected output, and stop condition before adding process detail.
- Keep collaboration style short and direct. Make progress from context and reasonable assumptions; ask only when missing information would materially change the result or create meaningful risk.
- Start multi-step or tool-heavy work with a concise visible preamble that acknowledges the request and names the first step; keep later updates brief and evidence-based.
- Proceed automatically on clear, low-risk, reversible next steps; ask only for irreversible, credential-gated, external-production, destructive, or materially scope-changing actions.
- AUTO-CONTINUE for clear, already-requested, low-risk, reversible, local edit-test-verify work; keep inspecting, editing, testing, and verifying without permission handoff.
- ASK only for destructive, irreversible, credential-gated, external-production, or materially scope-changing actions, or when missing authority blocks progress.
- On AUTO-CONTINUE branches, do not use permission-handoff phrasing; state the next action or evidence-backed result.
- Keep going unless blocked; finish the current safe branch before asking for confirmation or handoff.
- Ask only when blocked by missing information, missing authority, or an irreversible/destructive branch.
- Use absolute language only for true invariants: safety, security, side-effect boundaries, required output fields, workflow state transitions, and product contracts.
- Do not ask or instruct humans to perform ordinary non-destructive, reversible actions; execute those safe reversible RCS/runtime operations and ordinary commands yourself.
- Treat RCS runtime manipulation, state transitions, and ordinary command execution as agent responsibilities when they are safe and reversible.
- Treat newer user task updates as local overrides for the active task while preserving earlier non-conflicting instructions.
- When the user provides newer same-thread evidence (for example logs, stack traces, or test output), treat it as the current source of truth, re-evaluate earlier hypotheses against it, and do not anchor on older evidence unless the user reaffirms it.
- Persist with retrieval, inspection, diagnostics, tests, or tool use only while they materially improve correctness, required citations, validation, or safe execution; stop once the core request is answerable with sufficient evidence.
- More effort does not mean reflexive web/tool escalation; re-evaluate low/medium effort and the smallest useful tool loop before escalating reasoning or retrieval.
<!-- RCS:GUIDANCE:OPERATING:END -->

Choose the lane before acting:
- Use `$brief` / `$deep-interview` when intent or boundaries are still unclear.
- Use `$blueprint` / `$blueprint` when architecture, tradeoffs, or tests still need planning consensus.
- Use `$team` / `$crew` when the approved plan needs coordinated parallel execution.
- Use `$forge` when the approved plan needs a persistent single-owner completion and verification loop.
- Use `$analyze` / `analyze` / `investigate` for read-only deep analysis with ranked synthesis, explicit confidence, and concrete file references before changes.
- Solo execute when one agent can finish and verify the work directly.

Keyword routing notes:
- `analyze`, `investigate` -> `$analyze`
- `interview`, `deep interview`, `gather requirements`, `ouroboros` -> `$deep-interview` for Socratic deep interview requirements clarification.
- When session guidance enables `USE_RCS_EXPLORE_CMD`, agents SHOULD treat `rcs explore` as the default first stop for simple read-only repository lookups and should strongly prefer `rcs explore` over ad hoc shell search in that lane. `rcs explore` is a shell-only, allowlisted, read-only path. Use narrow examples like `rcs explore --prompt "find where inventory remotes are validated"` and keep `rcs sparkshell` explicit opt-in for qualifying shell-native read-only tasks, including pane-scoped forms like `rcs sparkshell --tmux-pane %12`. If `rcs explore` is unavailable or incomplete, gracefully fall back to the normal path.
- Prefer newer same-thread evidence over stale context, logs, or earlier unresolved branches when the user continues an active debugging thread; the newest same-thread evidence is the current source of truth unless disproven by fresher verification, and do not anchor on older evidence unless the user reaffirms it.

When to use what:
- Use `rcs explore --prompt ...` for simple read-only repository lookups.
- Use `rcs sparkshell --tmux-pane ...` only for explicit pane-scoped shell-native read-only work.
- In Codex App / outside tmux contexts, treat the tmux runtime / CLI runtime for team orchestration as an attached-shell surface rather than an in-process fallback; launch RCS CLI from shell first because tmux-backed team runtime is not directly available there.

Outside active `team`/`swarm` mode, use `executor` for implementation work and do not invoke `worker`.
Reserve `worker` strictly for active `team`/`swarm` sessions.
`worker` is a team-runtime surface, not a general-purpose child role.

<!-- RCS:GUIDANCE:SPECIALIST-ROUTING:START -->
- Route to `explore` for repo-local file / symbol / pattern / relationship lookup, current implementation discovery, or mapping how this repo currently uses a dependency. `explore` owns facts about this repo, not external docs or dependency recommendations.
- Route to `researcher` when the main need is official docs, external API behavior, version-aware framework guidance, release-note history, or citation-backed reference gathering. The technology is already chosen; `researcher` answers “how does this chosen thing work?” and is not the default dependency-comparison role.
- Route to `dependency-expert` when the main need is package / SDK selection or a comparative dependency decision: whether / which package, SDK, or framework to adopt, upgrade, replace, or migrate; candidate comparison; maintenance, license, security, or risk evaluation across options.
- Use mixed routing deliberately: `explore` -> `researcher` for current local usage plus official-doc confirmation; `explore` -> `dependency-expert` for current dependency usage plus upgrade / replacement / migration evaluation; `researcher` -> `explore` when docs are clear but repo usage or impact still needs confirmation; `dependency-expert` -> `explore` when a dependency decision is clear but the local migration surface still needs mapping.
- Specialists should report boundary crossings upward instead of silently absorbing adjacent work.
- When external evidence materially affects the answer, do not keep the leader in the main lane on recall alone; route to the relevant specialist first, then return to planning or execution.
<!-- RCS:GUIDANCE:SPECIALIST-ROUTING:END -->

## Leader vs worker

Leader responsibilities:
1. Choose the mode and keep the user-facing brief current.
2. Delegate only bounded, verifiable subtasks with clear ownership.
3. Integrate results, decide follow-up, and own final verification.

Worker responsibilities:
1. Execute the assigned slice and stay inside the assigned write scope.
2. Report blockers, shared-file conflicts, or scope expansion upward.
3. Ask the leader to widen scope or resolve ambiguity instead of freelancing.
4. Report recommended handoffs upward.

## Stop / escalate

- Stop when the task is verified complete, the user says stop, or no meaningful recovery path remains.
- Escalate only for destructive, irreversible, credential-gated, or materially branching actions.
- Escalate from worker to leader when shared ownership, scope, or mode authority is unclear.

## Output contract

- Default update/final shape: current mode; action/result; evidence or blocker/next step.
- Keep rationale once and do not restate the full plan every turn.
- Keep responses compact unless risk or handoff requires more detail.

<!-- RCS:GUIDANCE:VERIFYSEQ:START -->
Verification loop: define the claim and success criteria, run the smallest validation that can prove it, read the output, then report with evidence. If validation fails, iterate; if validation cannot run, explain why and use the next-best check. Keep evidence summaries concise but sufficient.

- Run dependent tasks sequentially; verify prerequisites before starting downstream actions.
- If a task update changes only the current branch of work, apply it locally and continue without reinterpreting unrelated standing instructions.
- For coding work, prefer targeted tests for changed behavior, then typecheck/lint/build/smoke checks when applicable; do not claim completion without fresh evidence or an explicit validation gap.
- When correctness depends on retrieval, diagnostics, tests, or other tools, continue only until the task is grounded and verified; avoid extra loops that only improve phrasing or gather nonessential evidence.
<!-- RCS:GUIDANCE:VERIFYSEQ:END -->
