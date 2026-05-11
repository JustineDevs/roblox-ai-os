# Release Playbook

This page explains the public release surfaces for RCS.

## Three separate release surfaces

### 1. npm package

Public package:

- `@jstn-sdk/rcs`

Registry:

- `https://registry.npmjs.org`

Purpose:

- what end users install with `npm install -g @jstn-sdk/rcs`

### 2. GitHub Packages

Registry:

- `https://npm.pkg.github.com`

Purpose:

- populates the repository Packages tab
- keeps GitHub-native package visibility aligned with the repo

### 3. GitHub Releases

Purpose:

- creates the Releases page entry
- attaches release notes and binary assets to a tag

Important:

- a git tag alone is not a GitHub Release object
- a successful npm publish alone does not populate GitHub Releases or GitHub Packages

## Maintainer release expectations

- verify Actions pre-flight before sign-off
- keep changelog and release notes aligned
- create or update the GitHub Release object from the tag workflow
- publish npm and GitHub Packages from the workflow lanes, not by assumption

## Release-note sync commands

Use the managed template flow so versioned release-note files stay aligned with `package.json`:

```bash
npm run sync:release-notes
npm run sync:release-notes:check
```

Notes:

- `sync:release-notes` creates or refreshes the managed version/date block for the current versioned file such as `docs/release-notes-v0.1.9.md`
- `sync:release-notes:check` fails when that managed block is missing or stale

## Backfilling GitHub Releases for existing tags

If tags already exist but the Releases page is empty, use:

```bash
npm run release:backfill:github -- --repo JustineDevs/roblox-ai-os --all
```

Useful variants:

```bash
npm run release:backfill:github -- --repo JustineDevs/roblox-ai-os --tag v0.1.8
npm run release:backfill:github -- --repo JustineDevs/roblox-ai-os --all --check-only
```

## Contributor-facing outputs

- release notes
- changelog entry
- package version bump
- tagged release
- attached native assets when applicable
