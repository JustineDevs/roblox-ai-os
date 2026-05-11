import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AgentDefinition } from "../../agents/definitions.js";
import {
  getInstallableNativeAgentNames,
  isNativeAgentInstallableStatus,
} from "../../agents/policy.js";
import type { CatalogAgentEntry, CatalogManifest } from "../../catalog/schema.js";
import { verifyNativeAgents } from "../verify-native-agents.js";

const definition: AgentDefinition = {
  name: "executor",
  description: "Code implementation",
  reasoningEffort: "medium",
  posture: "deep-worker",
  modelClass: "frontier",
  routingRole: "executor",
  tools: "execution",
  category: "build",
};

function manifest(agents: CatalogAgentEntry[]): CatalogManifest {
  return {
    schemaVersion: 1,
    catalogVersion: "test",
    skills: [],
    agents,
  };
}

async function rejectsWithCode(
  code: string,
  action: () => Promise<unknown>,
): Promise<void> {
  await assert.rejects(action, (error) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, new RegExp(`^${code}`));
    return true;
  });
}

describe("verify-native-agents", () => {
  it("passes for an installable agent and explicit non-native prompt assets", async () => {
    const result = await verifyNativeAgents({
      manifest: manifest([
        { name: "executor", category: "build", status: "active" },
        {
          name: "legacy-reviewer",
          category: "review",
          status: "merged",
          canonical: "executor",
        },
      ]),
      definitions: { executor: definition, "legacy-reviewer": { ...definition, name: "legacy-reviewer" } },
      promptNames: new Set(["executor", "legacy-reviewer", "explore-harness"]),
      pluginManifest: { skills: "./skills/" },
    });

    assert.deepEqual(result.installableAgentNames, ["executor"]);
  });

  it("fails when an installable catalog agent lacks a definition", async () => {
    await rejectsWithCode("native_agent_definition_missing", () =>
      verifyNativeAgents({
        manifest: manifest([{ name: "executor", category: "build", status: "active" }]),
        definitions: {},
        promptNames: new Set(["executor"]),
        pluginManifest: {},
      }),
    );
  });

  it("fails when an installable catalog agent lacks a prompt", async () => {
    await rejectsWithCode("native_agent_prompt_missing", () =>
      verifyNativeAgents({
        manifest: manifest([{ name: "executor", category: "build", status: "internal" }]),
        definitions: { executor: definition },
        promptNames: new Set(),
        pluginManifest: {},
      }),
    );
  });

  it("fails when a definition is missing from catalog agents", async () => {
    await rejectsWithCode("native_agent_catalog_out_of_sync", () =>
      verifyNativeAgents({
        manifest: manifest([]),
        definitions: { executor: definition },
        promptNames: new Set(),
        pluginManifest: {},
      }),
    );
  });

  it("fails when a merged canonical target is missing or non-installable", async () => {
    await rejectsWithCode("native_agent_canonical_invalid", () =>
      verifyNativeAgents({
        manifest: manifest([
          {
            name: "legacy-reviewer",
            category: "review",
            status: "merged",
            canonical: "code-reviewer",
          },
        ]),
        definitions: { "legacy-reviewer": { ...definition, name: "legacy-reviewer" } },
        promptNames: new Set(["legacy-reviewer"]),
        pluginManifest: {},
      }),
    );

    await rejectsWithCode("native_agent_canonical_invalid", () =>
      verifyNativeAgents({
        manifest: manifest([
          {
            name: "legacy-reviewer",
            category: "review",
            status: "merged",
            canonical: "code-reviewer",
          },
          {
            name: "code-reviewer",
            category: "review",
            status: "deprecated",
          },
        ]),
        definitions: {
          "legacy-reviewer": { ...definition, name: "legacy-reviewer" },
          "code-reviewer": { ...definition, name: "code-reviewer" },
        },
        promptNames: new Set(["legacy-reviewer", "code-reviewer"]),
        pluginManifest: {},
      }),
    );
  });

  it("validates alias canonical targets through the same direct-installable policy", async () => {
    await rejectsWithCode("native_agent_canonical_invalid", () =>
      verifyNativeAgents({
        manifest: manifest([
          {
            name: "legacy-reviewer",
            category: "review",
            status: "alias",
            canonical: "legacy-quality",
          },
          {
            name: "legacy-quality",
            category: "review",
            status: "merged",
            canonical: "executor",
          },
          { name: "executor", category: "build", status: "active" },
        ]),
        definitions: {
          executor: definition,
          "legacy-reviewer": { ...definition, name: "legacy-reviewer" },
          "legacy-quality": { ...definition, name: "legacy-quality" },
        },
        promptNames: new Set(["executor", "legacy-reviewer", "legacy-quality"]),
        pluginManifest: {},
      }),
    );
  });

  it("fails for unclassified prompt assets", async () => {
    await rejectsWithCode("native_agent_prompt_unclassified", () =>
      verifyNativeAgents({
        manifest: manifest([{ name: "executor", category: "build", status: "active" }]),
        definitions: { executor: definition },
        promptNames: new Set(["executor", "mystery"]),
        pluginManifest: {},
      }),
    );
  });

  it("fails if the plugin manifest declares setup-owned native-agent fields", async () => {
    await rejectsWithCode("native_agent_plugin_boundary_violation", () =>
      verifyNativeAgents({
        manifest: manifest([{ name: "executor", category: "build", status: "active" }]),
        definitions: { executor: definition },
        promptNames: new Set(["executor"]),
        pluginManifest: { agents: "./agents/" },
      }),
    );
  });

  it("keeps merged prompt-backed agents out of the installable set", () => {
    const nativeManifest = manifest([
      { name: "executor", category: "build", status: "active" },
      {
        name: "legacy-reviewer",
        category: "review",
        status: "merged",
        canonical: "executor",
      },
    ]);

    assert.equal(isNativeAgentInstallableStatus("active"), true);
    assert.equal(isNativeAgentInstallableStatus("internal"), true);
    assert.equal(isNativeAgentInstallableStatus("merged"), false);
    assert.deepEqual([...getInstallableNativeAgentNames(nativeManifest)], ["executor"]);
  });
});
