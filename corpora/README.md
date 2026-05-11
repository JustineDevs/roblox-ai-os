# Corpora (`corpora/`)

This folder holds **offline, read-mostly datasets** that live in the **git** repository for **verification, regression tests, security review training, and threat-pattern awareness**. It is **not** a creator-facing template library, **not** a dependency you import at runtime from published npm artifacts, and **not** a substitute for official Roblox documentation.

If you expected “starter Roblox scripts” or “copy-paste gameplay code,” **stop**—that content lives under `templates/`, `src/roblox/`, and skills; corpora are a different contract entirely.

---

## What “corpus” means here

| Term | Meaning in this repo |
|------|----------------------|
| **Corpus** | A bounded directory of sample files (often third-party or synthetic) used to **test detectors**, **freeze contracts**, or **teach “bad examples”** without claiming the samples are safe, licensed for reuse, or representative of Roblox best practice. |
| **Quarantine** | The material is isolated under explicit paths (today: `security/roblox-unsafe-script-corpus/`) and labeled so tooling and humans do not treat it like normal source. |
| **Anti-pattern lane** | Inputs for “recognize this class of hazard” workflows—**not** precedent for how to build features. |

---

## What lives here today

| Path | Role | Trust model |
|------|------|-------------|
| [`security/roblox-unsafe-script-corpus/`](./security/roblox-unsafe-script-corpus/) | Large collection of **raw third-party Luau** (exploit-adjacent, cheat-adjacent, or otherwise **low-trust**) scripts for **pattern libraries**, **static checks**, and **agent/security skill** context. | **Unsafe by default.** Assume hostile, obsolete, non-compliant with your game’s policies, and **not** reviewed for correctness. |

Authoritative policy and allowed use cases for that subtree: **[`docs/security/roblox-unsafe-script-corpus.md`](../docs/security/roblox-unsafe-script-corpus.md)**.

---

## Packaging and distribution flags

> [!CAUTION]
> **Never execute** corpus scripts inside a real Roblox experience or on accounts you care about. Some content is written to bypass sandbox expectations, abuse remotes, or mirror historical exploit tooling. Treat disk content as **untrusted code**.

### npm publish (`@jstn-sdk/rcs`)

- The package manifest uses a **`files`** whitelist in [`package.json`](../package.json).
- **`corpora/` is not part of that whitelist**, so a normal `npm pack` / registry publish **does not ship** this directory to consumers who only install from npm.
- There is still an explicit negated pattern: `!corpora/security/roblox-unsafe-script-corpus/**` — that is a **belt-and-suspenders guard** so this subtree cannot accidentally enter the tarball if future packaging edits broaden `files` in a way that might include `corpora/`.

**Implication:** `git clone` contributors see corpora; **`npm install @jstn-sdk/rcs` alone does not give you these files** from the registry package layout described above.

### Git clone / CI

- CI and local clones **do** contain `corpora/` when present in the repo.
- Tests may assert that certain corpora paths **exist** or that docs **do not** misrepresent them as normal templates (see verification around “unsafe corpus contract”).

---

## Confusion boundaries (read this if you are unsure)

| Mistake | Reality |
|---------|---------|
| “This is example gameplay I can paste into my game.” | **No.** It is security / anti-pattern material or test fixtures, not product templates. |
| “Roblox approved these scripts.” | **No.** Third-party and historical samples; **official docs** remain the source of truth for APIs and policy. |
| “RCS endorses these techniques.” | **No.** Inclusion in-repo is for **defense and detection**, not endorsement. |
| “I will import corpus files from `node_modules` after install.” | **You cannot** rely on that path for the unsafe subtree from the published package (see packaging section). |
| “Subfolder `README.md` files under the corpus are vetted.” | Treat **only** [`docs/security/roblox-unsafe-script-corpus.md`](../docs/security/roblox-unsafe-script-corpus.md) plus **this file** as policy. Legacy one-line readmes inside deep folders may be historical noise. |

---

## Allowed uses (narrow)

Use corpora only when your task explicitly matches one of these:

- **Security review** or **threat modeling** with clear scope (what pattern are we hunting?).
- **Detector / linter / test fixtures** that need realistic hostile strings **without** executing them.
- **Documentation and skills** that describe **what not to do**, pointing readers at the policy doc—not at “favorite snippets” from the corpus.

Everything else (feature work, UI polish, economy design) should use **normal** repo sources: `skills/`, `templates/`, `docs/reference/`, Roblox Creator documentation.

---

## Disallowed uses (hard)

- **Shipping** corpus source (verbatim or lightly renamed) into a live experience or public template repo.
- **Running** unknown Luau from the corpus in Studio or in privileged environments.
- **Training** a general coding model on this subtree **without** a security/legal pipeline appropriate to your organization (out of scope for this README—escalate to your own policy owners).
- **Storing secrets** or PII inside corpora paths (keep corpora non-sensitive; rotate anything that was ever pasted here by mistake).

---

## Adding new corpora (conventions)

1. **Pick a top-level bucket** under `corpora/<domain>/` (`security`, future `eval`, etc.)—never mix unrelated trust levels in one leaf directory.
2. **Update this README** with a new table row: path, role, trust model.
3. **Add or extend a doc under `docs/`** when material is sensitive (quarantine rules, allowed consumers, retention).
4. **Keep filenames honest** (avoid `example-safe-*.lua` for hostile content).
5. **If npm packaging should ever include** a new corpus (unusual), you must deliberately change `package.json` `files` **and** security review—default is **do not publish** raw hostile corpora to npm.

---

## Quick links

- Unsafe Luau corpus policy: [`docs/security/roblox-unsafe-script-corpus.md`](../docs/security/roblox-unsafe-script-corpus.md)
- Roblox reference tiering (where corpora sit vs official docs): [`docs/reference/roblox-pre-action-protocol.md`](../docs/reference/roblox-pre-action-protocol.md) (search for “security-only anti-pattern corpora”)
