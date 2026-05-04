import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("state-server schema validation", () => {
	it("exposes only state_* tool schemas after team MCP hard-deprecation", async () => {
		process.env.RCS_STATE_SERVER_DISABLE_AUTO_START = "1";
		const { buildStateServerTools } = await import("../state-server.js");

		const tools = buildStateServerTools();
		const names = tools.map((tool: { name: string }) => tool.name).sort();

		assert.deepEqual(names, [
			"state_clear",
			"state_get_status",
			"state_list_active",
			"state_read",
			"state_write",
		]);

		assert.equal(
			tools.some((tool: { name: string }) => tool.name.startsWith("team_")),
			false,
		);
	});

	it("includes deep-interview anywhere mode enums are exposed", async () => {
		process.env.RCS_STATE_SERVER_DISABLE_AUTO_START = "1";
		const { buildStateServerTools } = await import("../state-server.js");

		const tools = buildStateServerTools();
		const toolsWithModeEnum = tools.filter(
			(tool: {
				inputSchema?: { properties?: { mode?: { enum?: string[] } } };
			}) => Array.isArray(tool.inputSchema?.properties?.mode?.enum),
		);

		assert.ok(toolsWithModeEnum.length > 0);
		for (const tool of toolsWithModeEnum) {
			assert.ok(
				tool.inputSchema?.properties?.mode?.enum?.includes("deep-interview"),
			);
		}
	});
});
