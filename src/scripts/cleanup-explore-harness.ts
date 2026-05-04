#!/usr/bin/env node
import { rm } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..', '..');

for (const path of [
  join(root, 'bin', 'rcs-explore-harness'),
  join(root, 'bin', 'rcs-explore-harness.exe'),
  join(root, 'bin', 'rcs-explore-harness.meta.json'),
  join(root, 'bin', 'native'),
]) {
  await rm(path, { recursive: true, force: true });
}
