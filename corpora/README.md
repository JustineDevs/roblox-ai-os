# Corpora

This directory holds **offline datasets** used by RCS for testing, verification, and security-aware workflows. It is **not** part of the normal creator template path and is **not** shipped as a product feature inside the npm package (see `package.json` `files` / ignore rules for `corpora/security/`).

## What lives here today

| Path | Role |
|------|------|
| `security/roblox-unsafe-script-corpus/` | Quarantined **third-party Luau** samples for exploit-pattern recognition, anti-pattern detection, and defensive review. Treat as **unsafe by default**. |

## How to use it

- **Do not** run or paste corpus scripts into Roblox Studio or production games.
- **Do not** copy corpus code into shipped experiences or treat it as style or architecture guidance.
- For purpose, rules, and relationship to RCS skills, read **[Roblox unsafe script corpus](../docs/security/roblox-unsafe-script-corpus.md)**.

## Adding new corpora

Prefer a short subfolder name (`security/`, `eval/`, etc.), a one-line purpose in this README table, and—when the material is sensitive— a dedicated doc under `docs/` that states quarantine rules and allowed use cases.
