# Roblox Creator Skills v0.1.8

## Summary

`v0.1.8` is the MCP/reference-layer activation release after the `0.1.7` docs and localization hardening line. It makes the GitMCP Roblox reference sources part of the default managed Codex setup, documents the activation split more clearly, and adds the tests needed to keep that default layer stable.

## What changed

- Default managed Codex config now includes:
  - `creator_docs`
  - `roblox_skills`
  - `devprod_docs`
  - `roblox_scripts_corpus`
- Added canonical docs for the Roblox MCP reference layer
- Added a shipped reference-source template inventory
- Clarified in README and localized READMEs that:
  - `rcs mcp-serve` is for first-party local RCS MCP servers
  - GitMCP Roblox references should stay enabled by default
  - `robloxstudio-mcp` remains a manual live Studio bridge

## Verification

- `npm run build`
- `node --test dist/config/__tests__/roblox-reference-mcp.test.js dist/config/__tests__/generator-idempotent.test.js dist/verification/__tests__/roblox-mcp-reference-layer.test.js dist/verification/__tests__/robloxstudio-mcp-compatibility.test.js`
