import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPackageRoot } from '../utils/package.js';
import {
  type PlatformTargetManifest,
  validatePlatformTargetManifest,
} from './schema.js';

const MANIFEST_CANDIDATE_PATHS = [
  ['src', 'platform-targets', 'manifest.json'],
  ['dist', 'platform-targets', 'manifest.json'],
] as const;

let cachedManifest: PlatformTargetManifest | null = null;
let cachedPath: string | null = null;

function resolveManifestPath(packageRoot: string): string | null {
  for (const segments of MANIFEST_CANDIDATE_PATHS) {
    const fullPath = join(packageRoot, ...segments);
    if (existsSync(fullPath)) return fullPath;
  }
  return null;
}

export function readPlatformTargetManifest(
  packageRoot: string = getPackageRoot(),
): PlatformTargetManifest {
  const path = resolveManifestPath(packageRoot);
  if (!path) throw new Error('platform_target_manifest_missing');
  if (cachedManifest && cachedPath === path) return cachedManifest;

  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  const manifest = validatePlatformTargetManifest(raw);
  cachedManifest = manifest;
  cachedPath = path;
  return manifest;
}
