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

## Contributor-facing outputs

- release notes
- changelog entry
- package version bump
- tagged release
- attached native assets when applicable
