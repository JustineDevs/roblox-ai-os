export interface RobloxReferenceMcpSpec {
  name: string;
  title: string;
  url: string;
  startupTimeoutSec: number;
}

export const ROBLOX_REFERENCE_MCP_SPECS: readonly RobloxReferenceMcpSpec[] = [
  {
    name: "creator_docs",
    title: "# Roblox Creator Docs MCP (official platform truth)",
    url: "https://gitmcp.io/Roblox/creator-docs",
    startupTimeoutSec: 15,
  },
  {
    name: "roblox_skills",
    title: "# Roblox Skills MCP (high-signal implementation guidance)",
    url: "https://gitmcp.io/sentinelcore/roblox-skills",
    startupTimeoutSec: 15,
  },
  {
    name: "devprod_docs",
    title: "# Devprod MCP (developer product tooling reference)",
    url: "https://gitmcp.io/Corecii/Devprod",
    startupTimeoutSec: 15,
  },
  {
    name: "roblox_scripts_corpus",
    title: "# Roblox Scripts MCP (raw script corpus, non-canonical)",
    url: "https://gitmcp.io/retpirato/Roblox-Scripts",
    startupTimeoutSec: 15,
  },
] as const;

export function getRobloxReferenceMcpServers(): Array<{
  name: string;
  title: string;
  command: string;
  args: string[];
  enabled: boolean;
  startupTimeoutSec: number;
}> {
  return ROBLOX_REFERENCE_MCP_SPECS.map((spec) => ({
    name: spec.name,
    title: spec.title,
    command: "npx",
    args: ["mcp-remote", spec.url],
    enabled: true,
    startupTimeoutSec: spec.startupTimeoutSec,
  }));
}
