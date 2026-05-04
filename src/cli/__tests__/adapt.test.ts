import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { adaptCommand } from "../adapt.js";

describe("adaptCommand", () => {
	it("prints help when called without args", async () => {
		const out: string[] = [];
		await adaptCommand([], {
			stdout: (line) => out.push(line),
		});
		assert.match(out.join("\n"), /Usage: rcs adapt <target>/i);
	});

	it("fails clearly for unknown targets", async () => {
		await assert.rejects(
			adaptCommand(["unknown", "probe"], {
				stdout: () => undefined,
			}),
			/Supported targets: openclaw, hermes/i,
		);
	});

	it("emits compact JSON envelopes when --json is set", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "rcs-adapt-cli-"));
		const out: string[] = [];
		try {
			await adaptCommand(["openclaw", "probe", "--json"], {
				cwd,
				stdout: (line) => out.push(line),
			});
			assert.equal(out.length, 1);
			assert.match(out[0] ?? "", /^\{"schemaVersion":"1\.0","timestamp":/);
			assert.match(out[0] ?? "", /"target":"openclaw"/);
		} finally {
			await rm(cwd, { recursive: true, force: true });
		}
	});

	it("rejects --write outside init", async () => {
		await assert.rejects(
			adaptCommand(["hermes", "status", "--write"], {
				stdout: () => undefined,
			}),
			/only supported with rcs adapt <target> init/i,
		);
	});

	it("reports OpenClaw local observation details in JSON status output", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "rcs-adapt-cli-openclaw-"));
		const out: string[] = [];
		try {
			process.env.CODEX_HOME = join(cwd, ".codex-home");
			process.env.RCS_OPENCLAW = "1";
			await adaptCommand(["openclaw", "status", "--json"], {
				cwd,
				stdout: (line) => out.push(line),
			});
			const parsed = JSON.parse(out[0] ?? "") as {
				target: string;
				openclaw?: { observedState: string };
			};
			assert.equal(parsed.target, "openclaw");
			assert.equal(parsed.openclaw?.observedState, "missing-config");
		} finally {
			delete process.env.CODEX_HOME;
			delete process.env.RCS_OPENCLAW;
			await rm(cwd, { recursive: true, force: true });
		}
	});
});
