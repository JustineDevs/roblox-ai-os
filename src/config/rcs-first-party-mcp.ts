import { join } from "path";
import type { UnifiedMcpRegistryServer } from "./mcp-registry.js";

export const RCS_PLUGIN_MCP_COMMAND = "rcs";
export const RCS_PLUGIN_MCP_SERVE_SUBCOMMAND = "mcp-serve";

type RcsFirstPartyMcpSpec = {
  name: string;
  title: string;
  entrypoint: string;
  pluginTarget: string;
  startupTimeoutSec: number;
};

const RCS_FIRST_PARTY_MCP_SPECS: readonly RcsFirstPartyMcpSpec[] = [
  {
    name: "rcs_state",
    title: "# RCS State Management MCP Server",
    entrypoint: "state-server.js",
    pluginTarget: "state",
    startupTimeoutSec: 5,
  },
  {
    name: "rcs_memory",
    title: "# RCS Project Memory MCP Server",
    entrypoint: "memory-server.js",
    pluginTarget: "memory",
    startupTimeoutSec: 5,
  },
  {
    name: "rcs_code_intel",
    title: "# RCS Code Intelligence MCP Server (LSP diagnostics, AST search)",
    entrypoint: "code-intel-server.js",
    pluginTarget: "code-intel",
    startupTimeoutSec: 10,
  },
  {
    name: "rcs_trace",
    title: "# RCS Trace MCP Server (agent flow timeline & statistics)",
    entrypoint: "trace-server.js",
    pluginTarget: "trace",
    startupTimeoutSec: 5,
  },
  {
    name: "rcs_wiki",
    title: "# RCS Wiki MCP Server (persistent project knowledge base)",
    entrypoint: "wiki-server.js",
    pluginTarget: "wiki",
    startupTimeoutSec: 5,
  },
] as const;

export const RCS_FIRST_PARTY_MCP_SERVER_NAMES = RCS_FIRST_PARTY_MCP_SPECS.map(
  (spec) => spec.name,
);

export const RCS_FIRST_PARTY_MCP_ENTRYPOINTS = RCS_FIRST_PARTY_MCP_SPECS.map(
  (spec) => spec.entrypoint,
);

export const RCS_FIRST_PARTY_MCP_PLUGIN_TARGETS = RCS_FIRST_PARTY_MCP_SPECS.map(
  (spec) => spec.pluginTarget,
);

export function resolveRcsFirstPartyMcpEntrypointForPluginTarget(
  target: string | undefined,
): string | null {
  if (typeof target !== "string") return null;
  const normalized = target.trim().toLowerCase();
  if (!normalized) return null;
  const spec = RCS_FIRST_PARTY_MCP_SPECS.find(
    (candidate) =>
      candidate.pluginTarget === normalized ||
      candidate.entrypoint === normalized,
  );
  return spec?.entrypoint ?? null;
}

export function getRcsFirstPartySetupMcpServers(
  pkgRoot: string,
): Array<UnifiedMcpRegistryServer & { title: string }> {
  return RCS_FIRST_PARTY_MCP_SPECS.map((spec) => ({
    name: spec.name,
    title: spec.title,
    command: "node",
    args: [join(pkgRoot, "dist", "mcp", spec.entrypoint)],
    enabled: true,
    startupTimeoutSec: spec.startupTimeoutSec,
  }));
}

export function buildRcsPluginMcpManifest(): {
  mcpServers: Record<
    string,
    {
      command: string;
      args: string[];
      enabled: boolean;
    }
  >;
} {
  return {
    mcpServers: Object.fromEntries(
      RCS_FIRST_PARTY_MCP_SPECS.map((spec) => [
        spec.name,
        {
          command: RCS_PLUGIN_MCP_COMMAND,
          args: [RCS_PLUGIN_MCP_SERVE_SUBCOMMAND, spec.pluginTarget],
          enabled: true,
        },
      ]),
    ),
  };
}
