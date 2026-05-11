# Roblox Unsafe Script Corpus

Status: quarantined security-only corpus for exploit-awareness, anti-pattern detection, and defensive review.

## Purpose

This repo keeps a quarantined Roblox script corpus under:

- `corpora/security/roblox-unsafe-script-corpus/`

It is **not** a normal implementation template library.

It exists to help:

- recognize exploit idioms
- detect remote-code-execution patterns
- identify unsafe client-trust and FE abuse patterns
- teach agents what **not** to treat as production-safe precedent

## What it contains

The corpus includes raw third-party scripts that may contain patterns such as:

- `loadstring(...)`
- `game:HttpGet(...)`
- executor-specific assumptions
- client-side admin abuse
- opaque or intentionally unsafe legacy Roblox scripting styles

Some files are exploit-style or cheat-style scripts. Others are simply low-trust raw corpus material. Treat the entire directory as unsafe by default.

## Rules

- Do **not** copy from this corpus into shipped code.
- Do **not** treat it as architecture guidance.
- Do **not** treat it as style guidance.
- Use it only for:
  - threat modeling
  - exploit-pattern recognition
  - anti-pattern detection
  - security review training

## Relationship to RCS references

- Official Roblox docs remain the source of correctness.
- Roblox skill repos remain implementation guidance.
- This corpus is a **security-only anti-pattern lane**.

If a workflow or doc still treats this corpus like a normal template/reference set, that is a bug and should be corrected.
