#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const requiredFile = "playground/party_queue_lab/PartyQueueNotes.md";
if (!existsSync(requiredFile)) {
	throw new Error(`missing_required_lab_file:${requiredFile}`);
}

const source = readFileSync(requiredFile, "utf-8");
if (!source.includes("Teleport")) {
	throw new Error("party_queue_lab_missing_teleport_handoff_note");
}

console.log("cross_server_party_flow_ok");
