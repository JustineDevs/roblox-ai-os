> Release context: patch release for default Roblox reference MCP activation and clearer MCP activation guidance.

# Roblox Creator Skills — `@jstn-sdk/rcs` v0.1.8

## Summary

`v0.1.8` enables the GitMCP Roblox reference servers by default in the managed Codex config path, clarifies the MCP activation split for users, and adds the config/reference verification needed to keep that layer stable.

## Highlights

- **Default GitMCP Roblox references** — the managed config now includes `creator_docs`, `roblox_skills`, `devprod_docs`, and `roblox_scripts_corpus` through `npx mcp-remote https://gitmcp.io/...`.
- **Clear activation model** — docs now explicitly recommend keeping first-party `rcs mcp-serve` and GitMCP Roblox references active by default, while leaving `robloxstudio-mcp` as the explicit manual live Studio bridge.
- **Reference-layer enforcement** — config and verification tests now lock the Roblox external MCP reference layer into the repo’s setup and policy surface.

## Verification

- `npm run build`
- `node --test dist/config/__tests__/roblox-reference-mcp.test.js dist/config/__tests__/generator-idempotent.test.js dist/verification/__tests__/roblox-mcp-reference-layer.test.js dist/verification/__tests__/robloxstudio-mcp-compatibility.test.js`

## Full notes

See **[CHANGELOG.md](./CHANGELOG.md)** for the canonical **`[0.1.8]`** entry and release summary.
