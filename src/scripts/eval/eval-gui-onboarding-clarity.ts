#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
	"playground/gui_onboarding_lab/OnboardingHud.client.luau",
	"playground/gui_onboarding_lab/OnboardingState.luau",
];

for (const file of requiredFiles) {
	if (!existsSync(file)) {
		throw new Error(`missing_required_lab_file:${file}`);
	}
}

const source = readFileSync(requiredFiles[0], "utf-8");
if (!source.includes("PlayerGui")) {
	throw new Error("gui_onboarding_lab_missing_PlayerGui");
}

console.log("gui_onboarding_clarity_ok");
