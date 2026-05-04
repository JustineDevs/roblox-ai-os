import { existsSync, readFileSync } from "node:fs";
import { access, constants, open } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, isAbsolute, join, resolve } from "node:path";
import {
  type AdaptBootstrapMetadata,
  type AdaptCapabilityReport,
  type AdaptEnvelope,
  type AdaptProbeReport,
  type AdaptRuntimeObservation,
  type AdaptStatusReport,
} from "./contracts.js";

const HERMES_HOME_ENV = "HERMES_HOME";
const HERMES_ROOT_ENV = "RCS_ADAPT_HERMES_ROOT";
const HERMES_BOOTSTRAP_ENV = "RCS_ADAPT_HERMES_BOOTSTRAP";
const HERMES_DEFAULT_HOME = join(homedir(), ".hermes");
const ACP_COMMANDS = ["hermes acp", "hermes-acp", "python -m acp_adapter"];
const STATUS_COMMANDS = [
  "hermes gateway status",
  "hermes sessions list --source acp",
];
const ACP_ENTRYPOINTS = [
  "acp_adapter/server.py",
  "acp_adapter/session.py",
  "acp_adapter/events.py",
  "acp_adapter/entry.py",
];
const GATEWAY_ENTRYPOINTS = [
  "gateway/status.py",
  "gateway/hooks.py",
];
const DOC_ENTRYPOINTS = [
  "docs/acp-setup.md",
];

interface HermesGatewayRuntimeFile {
  gateway_state?: string;
  exit_reason?: string | null;
  restart_requested?: boolean;
  active_agents?: number;
  updated_at?: string;
  platforms?: Record<string, {
    state?: string;
    error_code?: string | null;
    error_message?: string | null;
    updated_at?: string;
  }>;
  [key: string]: unknown;
}

interface HermesPidRecord {
  pid?: number;
  kind?: string;
  argv?: string[];
  start_time?: number;
  [key: string]: unknown;
}

interface HermesEvidence {
  hermesRoot: string;
  hermesHome: string;
  sources: {
    root: "override" | "sibling-default";
    home: "env" | "default";
  };
  sourceRuntime: {
    present: boolean;
    acp: {
      present: boolean;
      files: string[];
      missing: string[];
    };
    gateway: {
      present: boolean;
      files: string[];
      missing: string[];
    };
    docs: {
      present: boolean;
      files: string[];
      missing: string[];
    };
    stateStore: {
      present: boolean;
      path: string;
    };
    acpRegistry: {
      present: boolean;
      path: string;
    };
  };
  installed: boolean;
  runtimeFiles: {
    gatewayPidPath: string;
    gatewayStatePath: string;
    stateDbPath: string;
    gatewayPidReadable: boolean;
    gatewayStateReadable: boolean;
    stateDbReadable: boolean;
    stateDbExists: boolean;
  };
  gateway: {
    pidRecord: HermesPidRecord | null;
    runtimeRecord: HermesGatewayRuntimeFile | null;
    live: boolean;
    connectedPlatforms: string[];
    stale: boolean;
  };
  resumable: boolean;
}

function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function resolveRelativeToCwd(cwd: string, pathValue: string): string {
  return isAbsolute(pathValue) ? pathValue : resolve(cwd, pathValue);
}

function resolveDefaultHermesSiblingRoot(cwd: string): string {
  return resolve(
    cwd,
    "..",
    "hermes-codex-skill-rcs-aware-prd",
    "external",
    "hermes-agent",
  );
}

function resolveHermesRoot(cwd: string): { path: string; source: "override" | "sibling-default" } {
  const override = process.env[HERMES_ROOT_ENV]?.trim();
  if (override) {
    return {
      path: resolveRelativeToCwd(cwd, override),
      source: "override",
    };
  }

  return {
    path: resolveDefaultHermesSiblingRoot(cwd),
    source: "sibling-default",
  };
}

function resolveHermesHome(cwd: string): { path: string; source: "env" | "default" } {
  const envValue = process.env[HERMES_HOME_ENV]?.trim();
  if (envValue) {
    return {
      path: resolveRelativeToCwd(cwd, envValue),
      source: "env",
    };
  }

  return {
    path: HERMES_DEFAULT_HOME,
    source: "default",
  };
}

function collectPathEvidence(root: string, relativePaths: readonly string[]) {
  const present: string[] = [];
  const missing: string[] = [];

  for (const relativePath of relativePaths) {
    const candidate = join(root, relativePath);
    if (existsSync(candidate)) {
      present.push(candidate);
    } else {
      missing.push(candidate);
    }
  }

  return {
    present: present.length > 0,
    files: present,
    missing,
  };
}

async function isReadable(path: string): Promise<boolean> {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(path: string): Promise<T | null> {
  try {
    const raw = await access(path, constants.R_OK).then(() => readFileSync(path, "utf-8"));
    return safeJsonParse<T>(raw);
  } catch {
    return null;
  }
}

async function sqliteHasTable(path: string, table: string): Promise<boolean> {
  if (!existsSync(path)) return false;
  let handle;
  try {
    handle = await open(path, "r");
    const buffer = Buffer.alloc(256);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const text = buffer.subarray(0, bytesRead).toString("utf-8");
    return text.includes(table);
  } catch {
    return false;
  } finally {
    await handle?.close();
  }
}

function extractConnectedPlatforms(runtime: HermesGatewayRuntimeFile | null): string[] {
  if (!runtime?.platforms || typeof runtime.platforms !== "object") {
    return [];
  }

  return Object.entries(runtime.platforms)
    .filter(([, platform]) => platform?.state === "connected")
    .map(([name]) => name)
    .sort((left, right) => left.localeCompare(right));
}

function inferGatewayLive(
  pidRecord: HermesPidRecord | null,
  runtimeRecord: HermesGatewayRuntimeFile | null,
): { live: boolean; stale: boolean } {
  const gatewayState = typeof runtimeRecord?.gateway_state === "string"
    ? runtimeRecord.gateway_state
    : null;
  const runningState = gatewayState === "starting" || gatewayState === "running" || gatewayState === "draining";
  const pidPresent = Number.isFinite(pidRecord?.pid);
  const live = Boolean(pidPresent && runningState);
  const stale = Boolean(pidPresent && gatewayState && !runningState);
  return { live, stale };
}

export async function collectHermesEvidence(cwd = process.cwd()): Promise<HermesEvidence> {
  const hermesRoot = resolveHermesRoot(cwd);
  const hermesHome = resolveHermesHome(cwd);
  const sourceAcp = collectPathEvidence(hermesRoot.path, ACP_ENTRYPOINTS);
  const sourceGateway = collectPathEvidence(hermesRoot.path, GATEWAY_ENTRYPOINTS);
  const sourceDocs = collectPathEvidence(hermesRoot.path, DOC_ENTRYPOINTS);
  const stateStorePath = join(hermesRoot.path, "hermes_state.py");
  const acpRegistryPath = join(hermesRoot.path, "acp_registry");
  const gatewayPidPath = join(hermesHome.path, "gateway.pid");
  const gatewayStatePath = join(hermesHome.path, "gateway_state.json");
  const stateDbPath = join(hermesHome.path, "state.db");

  const [
    gatewayPidReadable,
    gatewayStateReadable,
    stateDbReadable,
    pidRecord,
    runtimeRecord,
    sessionsTablePresent,
  ] = await Promise.all([
    isReadable(gatewayPidPath),
    isReadable(gatewayStatePath),
    isReadable(stateDbPath),
    readJsonFile<HermesPidRecord>(gatewayPidPath),
    readJsonFile<HermesGatewayRuntimeFile>(gatewayStatePath),
    sqliteHasTable(stateDbPath, "sessions"),
  ]);

  const connectedPlatforms = extractConnectedPlatforms(runtimeRecord);
  const gatewayLiveness = inferGatewayLive(pidRecord, runtimeRecord);
  const installed = sourceAcp.present || sourceGateway.present || existsSync(stateStorePath);
  const resumable = stateDbReadable && sessionsTablePresent;

  return {
    hermesRoot: hermesRoot.path,
    hermesHome: hermesHome.path,
    sources: {
      root: hermesRoot.source,
      home: hermesHome.source,
    },
    sourceRuntime: {
      present: installed,
      acp: sourceAcp,
      gateway: sourceGateway,
      docs: sourceDocs,
      stateStore: {
        present: existsSync(stateStorePath),
        path: stateStorePath,
      },
      acpRegistry: {
        present: existsSync(acpRegistryPath),
        path: acpRegistryPath,
      },
    },
    installed,
    runtimeFiles: {
      gatewayPidPath,
      gatewayStatePath,
      stateDbPath,
      gatewayPidReadable,
      gatewayStateReadable,
      stateDbReadable,
      stateDbExists: existsSync(stateDbPath),
    },
    gateway: {
      pidRecord,
      runtimeRecord,
      live: gatewayLiveness.live,
      connectedPlatforms,
      stale: gatewayLiveness.stale,
    },
    resumable,
  };
}

export function buildHermesCapabilityOverrides(
  capabilities: AdaptCapabilityReport[],
  evidence: HermesEvidence,
): AdaptCapabilityReport[] {
  return capabilities.map((capability) => {
    if (capability.id === "persistent-session-observation") {
      return {
        ...capability,
        status: evidence.runtimeFiles.stateDbReadable ? "ready" : evidence.installed ? "stub" : "unsupported",
        summary: evidence.runtimeFiles.stateDbReadable
          ? `Hermes session-store evidence is readable at ${evidence.runtimeFiles.stateDbPath}.`
          : evidence.installed
            ? "Hermes source/runtime surfaces are present, but no readable session store was detected yet."
            : "Hermes external runtime was not detected from the configured root/home paths.",
      };
    }

    if (capability.id === "acp-envelope-bridge") {
      return {
        ...capability,
        status: evidence.sourceRuntime.acp.present ? "ready" : evidence.installed ? "stub" : "unsupported",
        summary: evidence.sourceRuntime.acp.present
          ? "Envelope/bootstrap metadata now includes Hermes ACP entrypoints, commands, and bridge guidance."
          : evidence.installed
            ? "Hermes root is partially present, but ACP entrypoints were not fully detected."
            : "No Hermes ACP entrypoints were detected from the configured root.",
      };
    }

    return capability;
  });
}

export function buildHermesBootstrapMetadata(evidence: HermesEvidence): AdaptBootstrapMetadata {
  const commands = [
    ...ACP_COMMANDS,
    ...STATUS_COMMANDS,
  ];

  const nextSteps = [
    `Set ${HERMES_HOME_ENV} to the Hermes profile home you want RCS to observe.`,
    `Run ${ACP_COMMANDS[0]} from ${evidence.hermesRoot} when validating ACP availability.`,
    `Use ${STATUS_COMMANDS[0]} to confirm gateway status outside RCS if the runtime evidence looks stale.`,
  ];

  if (process.env[HERMES_BOOTSTRAP_ENV]?.trim()) {
    nextSteps.unshift(`Bootstrap override detected via ${HERMES_BOOTSTRAP_ENV}; keep Hermes-side reads pointed at RCS-owned adapter artifacts only.`);
  }

  return {
    summary: "Hermes bootstrap metadata maps RCS lifecycle intent into ACP and gateway guidance without claiming direct control over Hermes internals.",
    eventBridge: [
      "session-start -> session:start",
      "session-end -> session:end",
      "session-idle -> agent:end",
      "ask-user-question -> agent:step",
      "stop -> session:end",
      "gateway-startup -> gateway:startup",
    ],
    commands,
    nextSteps,
  };
}

export function buildHermesRuntimeObservation(evidence: HermesEvidence): AdaptRuntimeObservation {
  if (!evidence.installed) {
    return {
      state: "unavailable",
      detail: `Hermes external runtime was not detected under ${evidence.hermesRoot}.`,
      evidence: {
        hermesRoot: evidence.hermesRoot,
        expectedAcpEntry: join(evidence.hermesRoot, ACP_ENTRYPOINTS[0]),
        expectedGatewayEntry: join(evidence.hermesRoot, GATEWAY_ENTRYPOINTS[0]),
        hermesHome: evidence.hermesHome,
      },
    };
  }

  if (evidence.gateway.live) {
    return {
      state: "running",
      detail: evidence.gateway.connectedPlatforms.length > 0
        ? `Hermes gateway appears live with connected platforms: ${evidence.gateway.connectedPlatforms.join(", ")}.`
        : "Hermes gateway appears live from PID/status evidence, but no connected platforms were reported.",
      evidence: {
        hermesRoot: evidence.hermesRoot,
        hermesHome: evidence.hermesHome,
        gatewayState: evidence.gateway.runtimeRecord?.gateway_state ?? null,
        connectedPlatforms: evidence.gateway.connectedPlatforms,
        gatewayStatePath: evidence.runtimeFiles.gatewayStatePath,
        gatewayPidPath: evidence.runtimeFiles.gatewayPidPath,
        stateDbPath: evidence.runtimeFiles.stateDbPath,
        resumable: evidence.resumable,
      },
    };
  }

  if (evidence.runtimeFiles.gatewayStateReadable || evidence.runtimeFiles.gatewayPidReadable || evidence.runtimeFiles.stateDbReadable) {
    const reasons: string[] = [];
    if (evidence.runtimeFiles.gatewayStateReadable) {
      reasons.push(`gateway status readable (${basename(evidence.runtimeFiles.gatewayStatePath)})`);
    }
    if (evidence.runtimeFiles.gatewayPidReadable) {
      reasons.push(`gateway pid readable (${basename(evidence.runtimeFiles.gatewayPidPath)})`);
    }
    if (evidence.runtimeFiles.stateDbReadable) {
      reasons.push(`session store readable (${basename(evidence.runtimeFiles.stateDbPath)})`);
    }
    if (evidence.gateway.stale) {
      reasons.push("gateway state appears stale/non-running");
    }

    return {
      state: "degraded",
      detail: `Hermes runtime evidence is present but not currently live: ${reasons.join("; ")}.`,
      evidence: {
        hermesRoot: evidence.hermesRoot,
        hermesHome: evidence.hermesHome,
        gatewayState: evidence.gateway.runtimeRecord?.gateway_state ?? null,
        exitReason: evidence.gateway.runtimeRecord?.exit_reason ?? null,
        connectedPlatforms: evidence.gateway.connectedPlatforms,
        stateDbPath: evidence.runtimeFiles.stateDbPath,
        resumable: evidence.resumable,
      },
    };
  }

  return {
    state: "installed",
    detail: "Hermes source surfaces were detected, but no readable runtime state files were found yet.",
    evidence: {
      hermesRoot: evidence.hermesRoot,
      hermesHome: evidence.hermesHome,
      acpFiles: evidence.sourceRuntime.acp.files,
      gatewayFiles: evidence.sourceRuntime.gateway.files,
      docs: evidence.sourceRuntime.docs.files,
      stateStoreSource: evidence.sourceRuntime.stateStore.present,
      acpRegistry: evidence.sourceRuntime.acpRegistry.present,
    },
  };
}

export function applyHermesEnvelope(
  envelope: AdaptEnvelope,
  evidence: HermesEvidence,
): AdaptEnvelope {
  return {
    ...envelope,
    capabilities: buildHermesCapabilityOverrides(envelope.capabilities, evidence),
    targetRuntime: buildHermesRuntimeObservation(evidence),
    bootstrap: buildHermesBootstrapMetadata(evidence),
  };
}

export function applyHermesProbe(
  report: AdaptProbeReport,
  evidence: HermesEvidence,
): AdaptProbeReport {
  const nextSteps = [
    ...report.nextSteps.filter((step) => !/follow-on PR/i.test(step)),
    `Inspect Hermes root at ${evidence.hermesRoot}.`,
    `Inspect Hermes home at ${evidence.hermesHome}.`,
  ];

  if (!evidence.installed) {
    nextSteps.push(`If Hermes lives elsewhere, set ${HERMES_ROOT_ENV} and rerun the probe.`);
  } else if (!evidence.runtimeFiles.stateDbReadable) {
    nextSteps.push(`Ensure ${HERMES_HOME_ENV} points at the Hermes profile whose state.db RCS should inspect.`);
  }

  return {
    ...report,
    summary: "Hermes probe inspected ACP, gateway, and session-store evidence from the external runtime.",
    capabilities: buildHermesCapabilityOverrides(report.capabilities, evidence),
    targetRuntime: buildHermesRuntimeObservation(evidence),
    nextSteps,
  };
}

export function applyHermesStatus(
  report: AdaptStatusReport,
  evidence: HermesEvidence,
): AdaptStatusReport {
  const targetRuntime = buildHermesRuntimeObservation(evidence);
  const summary = report.adapter.state === "initialized"
    ? `Hermes adapter is initialized and ${targetRuntime.state === "running" ? "runtime evidence looks live." : "runtime evidence is available for inspection."}`
    : `Hermes adapter is not initialized yet; runtime evidence is still ${targetRuntime.state}.`;

  return {
    ...report,
    summary,
    capabilities: buildHermesCapabilityOverrides(report.capabilities, evidence),
    targetRuntime,
  };
}
