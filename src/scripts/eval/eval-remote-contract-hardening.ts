#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
	"playground/remote_contract_lab/TradeRequest.client.luau",
	"playground/remote_contract_lab/TradeRequest.server.luau",
];

for (const file of requiredFiles) {
	if (!existsSync(file)) {
		throw new Error(`missing_required_lab_file:${file}`);
	}
}

const serverSource = readFileSync(requiredFiles[1], "utf-8");
if (!serverSource.includes("OnServerEvent")) {
	throw new Error("remote_contract_lab_missing_OnServerEvent");
}

console.log("remote_contract_hardening_ok");
