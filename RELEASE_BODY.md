> Archive context: retained release and migration collateral from the pre-v0.1.0 transition to the canonical RCS package layout. Links are normalized to the canonical JustineDevs repository where applicable.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.0

## Summary

First npm release of **Roblox Creator Skills** as **`@jstn-sdk/rcs@0.1.0`**: the `rcs` CLI, **`.rcs/`** runtime layout, Creator Skills plugin bundle, native explore/sparkshell artifacts, and the merged capability set documented in **`CHANGELOG.md`**.

## Highlights

- **RCS-first surfaces** — `rcs` commands for setup, doctor, team, Ralph, explore, question, hooks, and MCP parity paths aligned with `RCS_*` configuration.
- **Consolidated changelog** — Prior per-release notes are folded into the **`[0.1.0]`** entry in **`CHANGELOG.md`**; line-level history remains in git.
- **Layout** — Runtime state, logs, and adapters use **`.rcs/`**.

## Verification

- `npm run build`, `npm test`, and prepack checks as defined in `package.json` for the `v0.1.0` tag.

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.0]`** entry and provenance summary.
