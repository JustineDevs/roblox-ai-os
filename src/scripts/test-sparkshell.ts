import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');
const manifestPath = process.env.RCS_SPARKSHELL_MANIFEST ?? join(projectRoot, 'crates', 'rcs-sparkshell', 'Cargo.toml');
const extraArgs = process.argv.slice(2);
const args = ['test', '--manifest-path', manifestPath, ...extraArgs];

if (!existsSync(manifestPath)) {
  console.error(`rcs sparkshell test: missing Rust manifest at ${manifestPath}`);
  process.exit(1);
}

const result = spawnSync('cargo', args, {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(`rcs sparkshell test: failed to launch cargo: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
