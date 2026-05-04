import {
	ADAPT_SUBCOMMANDS,
	type AdaptSubcommand,
	type AdaptTarget,
} from "../adapt/contracts.js";
import {
	buildAdaptDoctorReportForTarget,
	buildAdaptEnvelopeForTarget,
	buildAdaptProbeReportForTarget,
	buildAdaptStatusReportForTarget,
	initAdaptFoundationForTarget,
	supportedAdaptTargets,
} from "../adapt/index.js";
import { getAdaptTargetDescriptor } from "../adapt/registry.js";

const HELP = [
	"Usage: rcs adapt <target> <probe|status|init|envelope|doctor> [--json] [--write]",
	"",
	"Targets:",
	"  openclaw  Foundation seam for RCS-owned OpenClaw adapter artifacts and reporting",
	"  hermes    Foundation seam for RCS-owned Hermes adapter artifacts and reporting",
	"",
	"Subcommands:",
	"  probe     Report shared foundation probe metadata (target-specific runtime probing is deferred)",
	"  status    Report RCS-owned adapter initialization status plus deferred target-runtime status",
	"  init      Preview or write RCS-owned adapter artifacts under .rcs/adapters/<target>/...",
	"  envelope  Print the normalized RCS-owned adapter envelope for the target",
	"  doctor    Explain blocked foundation steps and follow-on integration gaps",
	"",
	"Options:",
	"  --json    Emit compact machine-readable JSON",
	"  --write   Only valid with init; write adapter artifacts under .rcs/adapters/<target>/...",
	"",
	"Examples:",
	"  rcs adapt openclaw probe",
	"  rcs adapt hermes status --json",
	"  rcs adapt openclaw init --write",
	"  rcs adapt hermes envelope --json",
].join("\n");

function targetHelp(target: AdaptTarget): string {
	const descriptor = getAdaptTargetDescriptor(target);
	if (!descriptor) return HELP;
	return [
		`Usage: rcs adapt ${target} <${ADAPT_SUBCOMMANDS.join("|")}> [--json] [--write]`,
		"",
		descriptor.summary,
		"",
		"Notes:",
		target === "openclaw"
			? "  OpenClaw exposes local config/env/gateway observation and lifecycle bridge metadata."
			: target === "hermes"
				? "  Hermes exposes a narrow probe/status/bootstrap integration over external ACP, gateway, and session-store evidence."
				: "  This PR exposes the shared foundation only.",
		target === "openclaw"
			? "  Status remains local-only and does not claim downstream OpenClaw runtime acknowledgement."
			: target === "hermes"
				? "  RCS remains authoritative for RCS state; Hermes internals are observed, not controlled."
				: "  Target-specific runtime probing and integration logic are intentionally deferred.",
		`  ${descriptor.followupHint}`,
		"",
		HELP,
	].join("\n");
}

function parseArgs(args: string[]): {
	target: string | undefined;
	subcommand: string | undefined;
	json: boolean;
	write: boolean;
	wantsHelp: boolean;
} {
	let target: string | undefined;
	let subcommand: string | undefined;
	let json = false;
	let write = false;
	let wantsHelp = false;

	for (const arg of args) {
		if (arg === "--json") {
			json = true;
			continue;
		}
		if (arg === "--write") {
			write = true;
			continue;
		}
		if (arg === "--help" || arg === "-h" || arg === "help") {
			wantsHelp = true;
			continue;
		}
		if (!target) {
			target = arg;
			continue;
		}
		if (!subcommand) {
			subcommand = arg;
			continue;
		}
		throw new Error(`Unknown adapt argument: ${arg}`);
	}

	return { target, subcommand, json, write, wantsHelp };
}

function render(
	value: unknown,
	json: boolean,
	stdout: (line: string) => void,
): void {
	stdout(JSON.stringify(value, null, json ? 0 : 2));
}

export interface AdaptCommandDependencies {
	cwd?: string;
	stdout?: (line: string) => void;
}

export async function adaptCommand(
	args: string[],
	deps: AdaptCommandDependencies = {},
): Promise<void> {
	const cwd = deps.cwd ?? process.cwd();
	const stdout = deps.stdout ?? ((line: string) => console.log(line));
	const { target, subcommand, json, write, wantsHelp } = parseArgs(args);

	if (!target || wantsHelp) {
		if (!target) {
			stdout(HELP);
			return;
		}

		const descriptor = getAdaptTargetDescriptor(target);
		if (!descriptor) {
			throw new Error(
				`Unknown adapt target: ${target}. Supported targets: ${supportedAdaptTargets().join(", ")}`,
			);
		}
		stdout(targetHelp(descriptor.target));
		return;
	}

	const descriptor = getAdaptTargetDescriptor(target);
	if (!descriptor) {
		throw new Error(
			`Unknown adapt target: ${target}. Supported targets: ${supportedAdaptTargets().join(", ")}`,
		);
	}

	if (!subcommand) {
		stdout(targetHelp(descriptor.target));
		return;
	}

	if (!ADAPT_SUBCOMMANDS.includes(subcommand as AdaptSubcommand)) {
		throw new Error(
			`Unknown adapt subcommand: ${subcommand}. Supported subcommands: ${ADAPT_SUBCOMMANDS.join(", ")}`,
		);
	}

	if (write && subcommand !== "init") {
		throw new Error("--write is only supported with rcs adapt <target> init");
	}

	switch (subcommand as AdaptSubcommand) {
		case "probe":
			render(
				await buildAdaptProbeReportForTarget(cwd, descriptor.target),
				json,
				stdout,
			);
			return;
		case "status":
			render(
				await buildAdaptStatusReportForTarget(cwd, descriptor.target),
				json,
				stdout,
			);
			return;
		case "init":
			render(
				await initAdaptFoundationForTarget(cwd, descriptor.target, write),
				json,
				stdout,
			);
			return;
		case "envelope":
			render(
				await buildAdaptEnvelopeForTarget(cwd, descriptor.target),
				json,
				stdout,
			);
			return;
		case "doctor":
			render(
				await buildAdaptDoctorReportForTarget(cwd, descriptor.target),
				json,
				stdout,
			);
			return;
	}
}
