# Contributing to Roblox Creator Skills

Thanks for contributing.

## Development setup

- Node.js >= 20
- npm

```bash
npm install
npm run lint
npm run build
npm test
```

Before commit/push, the strict local mirror of the main CI gate is:

```bash
npm run ci:preflight
```

For a faster local iteration loop that still catches the most common failures:

```bash
npm run ci:preflight:quick
```

For local CLI testing:

```bash
npm link
rcs setup
rcs doctor
```

Contributor planning surfaces:

- [Contributor wiki](./docs/wiki/Home.md)
- [Good first issues and labels](./docs/wiki/Good-First-Issues.md)
- [Roadmap](./docs/wiki/Roadmap.md)

### Team/state coverage gate (issue #454)

CI enforces minimum coverage for critical team orchestration modules:

```bash
npm run coverage:team-critical
```

This command checks coverage for `dist/team/**` and `dist/state/**` and writes reports to `coverage/team/`.

### Release-readiness local verification

When validating team/state changes, run this sequence locally:

```bash
npm run build
node --test dist/team/__tests__/state.test.js dist/hooks/__tests__/notify-hook-cross-worktree-heartbeat.test.js
npm test
```

If you were recently in a team worker session, clear team env vars first so tests do not inherit worker-specific state roots:

```bash
unset RCS_TEAM_WORKER RCS_TEAM_STATE_ROOT RCS_TEAM_LEADER_CWD RCS_TEAM_WORKER_CLI RCS_TEAM_WORKER_CLI_MAP RCS_TEAM_WORKER_LAUNCH_ARGS
```

## Project structure

- `src/` -- TypeScript source (CLI, config, agents, MCP servers, hooks, modes, team, verification)
- `prompts/` -- 30 agent prompt markdown files (installed to `~/.codex/prompts/`)
- `skills/` -- 39 skill directories with `SKILL.md` (installed to `~/.codex/skills/`)
- `templates/` -- `AGENTS.md` orchestration brain template

### Adding a new agent prompt

1. Create `prompts/my-agent.md` with the agent's system prompt
2. Run `rcs setup --force` to install it to `~/.codex/prompts/`
3. Use `/prompts:my-agent` in Codex CLI

### Prompt guidance contract

Before changing `AGENTS.md`, `templates/AGENTS.md`, `prompts/*.md`, or the generated `developer_instructions` text in `src/config/generator.ts`, read [`docs/contracts/prompt-guidance-contract.md`](./docs/contracts/prompt-guidance-contract.md).

That document defines the GPT-5.4 behavior contract contributors should preserve across prompt surfaces and explains how it differs from posture-aware routing metadata.

### Adding a new skill

1. Create `skills/my-skill/SKILL.md` with the skill workflow
2. Run `rcs setup --force` to install it to `~/.codex/skills/`
3. Use `$my-skill` in Codex CLI


### Document refresh warnings

RCS has an agent-only document-refresh warning MVP for spec-driven changes. It
warns Codex/RCS agents when mapped product or test-contract code changes appear
without a rule-scoped planning-spec or product-doc refresh. This is warning-only:
it does not add a generic CI failure, does not install a pre-commit framework,
and must not hard-block `git commit` for document-refresh reasons.

Current mapped refresh examples:

- Native hook behavior (`src/scripts/codex-native-hook.ts`,
  `src/scripts/codex-native-pre-post.ts`, `src/config/codex-hooks.ts`, and
  related native-hook tests) should refresh `docs/guides/codex-native-hooks.md` or a
  native-hook-scoped planning/spec file.
- Document-refresh enforcer behavior (`src/document-refresh/**`) should refresh
  `docs/guides/codex-native-hooks.md` or a document-refresh-scoped planning/spec file.
- CLI/operator behavior (`src/cli/**`) should refresh `README.md`,
  `docs/site/getting-started.html`, or a relevant planning/spec file.
- Prompt-guidance behavior (`src/hooks/**` rule-owned guidance surfaces) should
  refresh `docs/contracts/prompt-guidance-contract.md` or a relevant planning/spec file.

Commit-path warnings are Bash `git commit` scoped and read only the staged diff.
Because `.rcs/` is gitignored, `.rcs/plans/**` and `.rcs/specs/**` count for
commit-path suppression only when tracked or force-staged and rule-owned.
Final-handoff warnings run only on terminal-looking handoff attempts, read staged
plus unstaged changes, and can count fresh local rule-owned `.rcs` planning/spec
files. That mtime-based local freshness is heuristic evidence, not proof of a
semantic refresh.

If no document refresh is needed, include an explicit acknowledgement with a
reason in the commit message or final handoff:

```text
Document-refresh: not-needed | <reason>
```

## Workflow

1. Create a branch from `dev` for normal contributions.
2. Make focused changes.
3. Run lint, build, and tests locally.
4. If you change public docs, onboarding, workflow language, or `README.md`, review locale domino effects before opening the PR.
5. If you are scoping work for newcomers, prefer `good first issue` or `help wanted` labels and keep the task granular.
6. Open a pull request targeting `dev` using the provided template. Use `main` only for maintainer-directed exceptions.

## Commit style

Use concise, intent-first commit messages. Existing history uses prefixes like:

- `feat:`
- `fix:`
- `docs:`
- `chore:`

Example:

```text
docs: clarify setup steps for Codex CLI users
```

## Pull request expectations

- [ ] Scope is focused and clearly described
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] Documentation updated when behavior changed
- [ ] No unrelated formatting/refactor churn
- [ ] README root changes considered locale domino effects
- [ ] Active Roblox-facing surfaces avoid generic web/enterprise framing
- [ ] GitHub issue / PR templates were used rather than free-form reports when applicable

## Community expectations

- Be responsive when contributors ask for clarification on scoped work.
- Accept non-code contributions such as docs, localization, issue triage, QA, and release-note cleanup.
- Keep newcomer tasks small enough to finish without hidden maintainership knowledge.
- Use the contributor wiki and roadmap pages when redirecting contributors, instead of making them infer priorities from commit history.
- Acknowledge contributors when their work lands, including docs and localization work.
- Keep an All Contributors-style mindset: documentation, design, localization, QA, and triage contributions count as real project value.

## Reporting issues

Use the GitHub issue templates for bug reports and feature requests, including reproduction steps and expected behavior.
For contribution discovery, start with the contributor wiki and the labeled issue queue.
