#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
	"playground/profile_datastore_lab/ProfileTemplate.luau",
	"playground/profile_datastore_lab/ProfileStore.server.luau",
];

for (const file of requiredFiles) {
	if (!existsSync(file)) {
		throw new Error(`missing_required_lab_file:${file}`);
	}
}

const source = readFileSync(requiredFiles[1], "utf-8");
if (!source.includes("DataStoreService")) {
	throw new Error("profile_datastore_lab_missing_DataStoreService");
}

console.log("profile_datastore_recovery_ok");
