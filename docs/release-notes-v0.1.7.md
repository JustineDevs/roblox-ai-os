# Roblox Creator Skills v0.1.7

## Summary

`v0.1.7` is the doc/prompt hardening release after the `0.1.6` automation update. It removes the last archive lane, rewrites the demo surface around Roblox-first creator workflows, strengthens Roblox-native framing inside the prompt system, and replaces the placeholder localized README stubs with real translated bodies.

## What changed

- Removed `docs/archive/` from the project surface
- Reduced active `docs/qa/` to the live gate docs only
- Rewrote `DEMO.md` into a Roblox-first demo guide
- Tightened prompt identities/goals for Roblox-native framing across key internal prompts
- Replaced localized README placeholder stubs with actual localized content

## Verification

- `npm run build`
- prompt-guidance and taxonomy contract tests
- semantic/workspace/robloxstudio-mcp verification tests
- `node dist/scripts/surface-taxonomy.js`
