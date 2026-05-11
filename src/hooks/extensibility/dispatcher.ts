import { spawn } from "child_process";
import { existsSync } from "fs";
import { appendFile, mkdir } from "fs/promises";
import { basename, join } from "path";
import { pathToFileURL } from "url";
import { getPackageRoot } from "../../utils/package.js";
import {
	createLifecycleBroadcastFingerprint,
	recordLifecycleHookBroadcastSent,
	shouldSendLifecycleHookBroadcast,
} from "../../notifications/lifecycle-dedupe.js";
import {
	discoverHookPlugins,
	isHookPluginsEnabled,
	resolveHookPluginTimeoutMs,
} from "./loader.js";
import { createHookPluginSdk } from "./sdk.js";
import type {
	HookDispatchOptions,
	HookDispatchResult,
	HookEventEnvelope,
	HookPluginDispatchResult,
	HookPluginModule,
} from "./types.js";

interface RunnerResult {
	ok: boolean;
	plugin: string;
	reason: string;
	error?: string;
}

const RESULT_PREFIX = "__RCS_PLUGIN_RESULT__ ";
const RUNNER_SIGKILL_GRACE_MS = 250;

async function runPluginInProcessFallback(
	plugin: { id: string; path: string; file: string },
	event: HookEventEnvelope,
	options: Required<Pick<HookDispatchOptions, "cwd">> & HookDispatchOptions,
	sideEffectsEnabled: boolean,
	started: number,
	reason: string,
): Promise<HookPluginDispatchResult> {
	try {
		const moduleUrl = `${pathToFileURL(plugin.path).href}?t=${Date.now()}`;
		const loaded = await import(moduleUrl) as HookPluginModule;
		if (typeof loaded.onHookEvent !== "function") {
			const duration = Date.now() - started;
			return {
				plugin: plugin.id,
				path: plugin.path,
				file: plugin.file,
				plugin_id: plugin.id,
				ok: false,
				status: "invalid_export",
				reason: "invalid_export",
				durationMs: duration,
				duration_ms: duration,
			};
		}

		const sdk = createHookPluginSdk({
			cwd: options.cwd,
			pluginName: plugin.id || basename(plugin.path),
			event,
			sideEffectsEnabled,
		});
		const originalStdoutWrite = process.stdout.write.bind(process.stdout);
		const originalStderrWrite = process.stderr.write.bind(process.stderr);
		const previousCwd = process.cwd();
		// Match isolated-runner behavior: plugin console noise must not leak into caller stdout/stderr.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(process.stdout as any).write = (() => true) as typeof process.stdout.write;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(process.stderr as any).write = (() => true) as typeof process.stderr.write;
		try {
			if (options.cwd !== previousCwd) process.chdir(options.cwd);
			await Promise.resolve(loaded.onHookEvent(event, sdk));
		} finally {
			if (process.cwd() !== previousCwd) process.chdir(previousCwd);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(process.stdout as any).write = originalStdoutWrite;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(process.stderr as any).write = originalStderrWrite;
		}
		const duration = Date.now() - started;
		return {
			plugin: plugin.id,
			path: plugin.path,
			file: plugin.file,
			plugin_id: plugin.id,
			ok: true,
			status: "ok",
			reason,
			durationMs: duration,
			duration_ms: duration,
		};
	} catch (error) {
		const duration = Date.now() - started;
		return {
			plugin: plugin.id,
			path: plugin.path,
			file: plugin.file,
			plugin_id: plugin.id,
			ok: false,
			status: "error",
			reason: "plugin_error",
			error: error instanceof Error ? error.message : String(error),
			durationMs: duration,
			duration_ms: duration,
		};
	}
}

function hooksLogPath(cwd: string): string {
	const day = new Date().toISOString().slice(0, 10);
	return join(cwd, ".rcs", "logs", `hooks-${day}.jsonl`);
}

async function appendHooksLog(
	cwd: string,
	payload: Record<string, unknown>,
): Promise<void> {
	await mkdir(join(cwd, ".rcs", "logs"), { recursive: true });
	await appendFile(
		hooksLogPath(cwd),
		`${JSON.stringify({ timestamp: new Date().toISOString(), ...payload })}\n`,
	).catch((error: unknown) => {
		console.warn("[rcs] warning: failed to append hook dispatch log entry", {
			cwd,
			error: error instanceof Error ? error.message : String(error),
		});
	});
}

function isTeamWorker(env: NodeJS.ProcessEnv): boolean {
	return (
		typeof env.RCS_TEAM_WORKER === "string" && env.RCS_TEAM_WORKER.trim() !== ""
	);
}

async function runPluginRunner(
	plugin: { id: string; path: string; file: string },
	event: HookEventEnvelope,
	options: Required<Pick<HookDispatchOptions, "cwd">> & HookDispatchOptions,
	sideEffectsEnabled: boolean,
): Promise<HookPluginDispatchResult> {
	const started = Date.now();
	const runnerPath = join(
		getPackageRoot(),
		"dist",
		"hooks",
		"extensibility",
		"plugin-runner.js",
	);
	const timeoutMs =
		options.timeoutMs ?? resolveHookPluginTimeoutMs(options.env);

	if (!existsSync(runnerPath)) {
		const duration = Date.now() - started;
		return {
			plugin: plugin.id,
			path: plugin.path,
			file: plugin.file,
			plugin_id: plugin.id,
			ok: false,
			status: "runner_error",
			skipped: true,
			reason: "runner_missing",
			durationMs: duration,
			duration_ms: duration,
		};
	}

	return await new Promise<HookPluginDispatchResult>((resolve) => {
		const child = spawn(process.execPath, [runnerPath], {
			cwd: options.cwd,
			stdio: ["pipe", "pipe", "pipe"],
			env: {
				...process.env,
				...(options.env || {}),
			},
		});

		let stdout = "";
		let stderr = "";
		let done = false;
		let timedOut = false;
		let sigkillTimer: NodeJS.Timeout | undefined;

		const settle = (
			result: HookPluginDispatchResult,
			clearSigkillTimer = true,
		) => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			if (clearSigkillTimer && sigkillTimer) {
				clearTimeout(sigkillTimer);
				sigkillTimer = undefined;
			}
			resolve(result);
		};

		const timer = setTimeout(() => {
			timedOut = true;
			try {
				child.kill("SIGTERM");
			} catch {
				// Ignore if process already exited.
			}
			sigkillTimer = setTimeout(() => {
				sigkillTimer = undefined;
				try {
					child.kill("SIGKILL");
				} catch {
					// Ignore if process already exited.
				}
			}, RUNNER_SIGKILL_GRACE_MS);

			const duration = Date.now() - started;
			settle(
				{
					plugin: plugin.id,
					path: plugin.path,
					file: plugin.file,
					plugin_id: plugin.id,
					ok: false,
					status: "timeout",
					reason: "timeout",
					durationMs: duration,
					duration_ms: duration,
				},
				false,
			);
		}, timeoutMs);

		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString();
		});

		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString();
		});

		child.on("error", () => {
			void runPluginInProcessFallback(
				plugin,
				event,
				options,
				sideEffectsEnabled,
				started,
				"spawn_failed_fallback",
			).then((result) => settle(result));
		});

		child.on("close", () => {
			if (done) return;
			const duration = Date.now() - started;

			if (timedOut) {
				settle({
					plugin: plugin.id,
					path: plugin.path,
					file: plugin.file,
					plugin_id: plugin.id,
					ok: false,
					status: "timeout",
					reason: "timeout",
					durationMs: duration,
					duration_ms: duration,
				});
				return;
			}

			const lines = stdout
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean);
			const rawResult = [...lines]
				.reverse()
				.find((line) => line.startsWith(RESULT_PREFIX));
			let parsed: RunnerResult | null = null;
			if (rawResult) {
				try {
					parsed = JSON.parse(
						rawResult.slice(RESULT_PREFIX.length),
					) as RunnerResult;
				} catch {
					parsed = null;
				}
			}

			if (parsed?.ok) {
				settle({
					plugin: plugin.id,
					path: plugin.path,
					file: plugin.file,
					plugin_id: plugin.id,
					ok: true,
					status: "ok",
					reason: parsed.reason || "ok",
					durationMs: duration,
					duration_ms: duration,
				});
				return;
			}

			if (!parsed || (!stdout.trim() && !stderr.trim())) {
				void runPluginInProcessFallback(
					plugin,
					event,
					options,
					sideEffectsEnabled,
					started,
					"runner_empty_output_fallback",
				).then((result) => settle(result));
				return;
			}

			const reason = parsed?.reason || "plugin_error";
			settle({
				plugin: plugin.id,
				path: plugin.path,
				file: plugin.file,
				plugin_id: plugin.id,
				ok: false,
				status: reason === "invalid_export" ? "invalid_export" : "error",
				reason,
				error: parsed?.error || stderr.trim() || undefined,
				durationMs: duration,
				duration_ms: duration,
			});
		});

		child.stdin.write(
			JSON.stringify({
				cwd: options.cwd,
				pluginId: plugin.id,
				pluginPath: plugin.path,
				event,
				sideEffectsEnabled,
			}),
		);
		child.stdin.end();
	});
}

export function isHookPluginFeatureEnabled(
	env: NodeJS.ProcessEnv = process.env,
): boolean {
	return isHookPluginsEnabled(env);
}

function shouldForceEnableRuntimeHookDispatch(
	event: HookEventEnvelope,
): boolean {
	return event.source === "native" || event.source === "derived";
}

function shouldDedupeHookEvent(event: HookEventEnvelope): boolean {
	if (event.source !== "native") return false;
	return event.event === "session-start"
		|| event.event === "stop"
		|| event.event === "session-end"
		|| event.event === "keyword-detector";
}

function buildHookEventFingerprint(event: HookEventEnvelope): string {
	return createLifecycleBroadcastFingerprint({
		event: event.event,
		source: event.source,
		session_id: event.session_id || "",
		thread_id: event.thread_id || "",
		turn_id: event.turn_id || "",
		mode: event.mode || "",
		context: event.context,
	});
}

export async function dispatchHookEvent(
	event: HookEventEnvelope,
	options: HookDispatchOptions = {},
): Promise<HookDispatchResult> {
	const cwd = options.cwd || process.cwd();
	const env = options.env || process.env;
	const runtimeHookDispatchEnabled =
		shouldForceEnableRuntimeHookDispatch(event) || isHookPluginsEnabled(env);
	const enabled = options.enabled ?? runtimeHookDispatchEnabled;

	const summary: HookDispatchResult = {
		enabled,
		reason: enabled ? "ok" : "disabled",
		event: event.event,
		source: event.source,
		plugin_count: 0,
		results: [],
	};

	if (!enabled) {
		await appendHooksLog(cwd, {
			type: "hook_dispatch",
			event: event.event,
			source: event.source,
			enabled: false,
			reason: "plugins_disabled",
		});
		return summary;
	}

	const dedupeFingerprint = shouldDedupeHookEvent(event)
		? buildHookEventFingerprint(event)
		: "";
	if (
		dedupeFingerprint
		&& !shouldSendLifecycleHookBroadcast(
			join(cwd, ".rcs", "state"),
			event.session_id,
			event.event,
			dedupeFingerprint,
		)
	) {
		summary.reason = "deduped";
		await appendHooksLog(cwd, {
			type: "hook_dispatch",
			event: event.event,
			source: event.source,
			enabled: true,
			reason: "deduped",
			session_id: event.session_id || null,
			thread_id: event.thread_id || null,
			turn_id: event.turn_id || null,
		});
		return summary;
	}

	const plugins = await discoverHookPlugins(cwd);
	summary.plugin_count = plugins.length;

	const inTeamWorker = isTeamWorker(env);
	const allowTeamSideEffects =
		options.allowTeamWorkerSideEffects ?? options.allowInTeamWorker ?? false;
	const sideEffectsEnabled =
		options.sideEffectsEnabled ?? (!inTeamWorker || allowTeamSideEffects);

	for (const plugin of plugins) {
		const result = await runPluginRunner(
			plugin,
			event,
			{ ...options, cwd, env },
			sideEffectsEnabled,
		);
		summary.results.push(result);

		await appendHooksLog(cwd, {
			type: "hook_plugin_dispatch",
			event: event.event,
			source: event.source,
			plugin: plugin.id,
			file: plugin.file,
			ok: result.ok,
			status: result.status,
			reason: result.reason,
			error: result.error,
			duration_ms: result.duration_ms,
		});
	}

	if (dedupeFingerprint && summary.results.some((result) => result.ok)) {
		recordLifecycleHookBroadcastSent(
			join(cwd, ".rcs", "state"),
			event.session_id,
			event.event,
			dedupeFingerprint,
		);
	}

	return summary;
}
