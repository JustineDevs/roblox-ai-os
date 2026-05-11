#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const requiredFile = "playground/liveops_reward_lab/EventRewardSpec.md";
if (!existsSync(requiredFile)) {
	throw new Error(`missing_required_lab_file:${requiredFile}`);
}

const source = readFileSync(requiredFile, "utf-8");
if (!source.includes("Premium upsell")) {
	throw new Error("liveops_reward_lab_missing_monetization_guardrail");
}

console.log("liveops_reward_loop_balance_ok");
