export type PlatformTargetId =
  | 'codex-native'
  | 'codex-plugin'
  | 'claude-like'
  | 'cursor'
  | 'marketplace-bundle'
  | 'mcp-capable-ide'
  | 'adapter-openclaw'
  | 'adapter-hermes';

export type PlatformTargetLane = 'delivery' | 'adapter';
export type PlatformTargetStatus = 'active' | 'planned';
export type RuntimeOwnership =
  | 'setup-owned'
  | 'plugin-scoped'
  | 'adapter-owned'
  | 'platform-owned';

export interface PlatformTargetEntry {
  id: PlatformTargetId;
  displayName: string;
  lane: PlatformTargetLane;
  status: PlatformTargetStatus;
  runtimeOwnership: RuntimeOwnership;
  purpose: string;
  canonicalSources: string[];
  deliveryArtifacts: string[];
  notes: string[];
}

export interface PlatformTargetManifest {
  schemaVersion: number;
  manifestVersion: string;
  targets: PlatformTargetEntry[];
}

const TARGET_IDS = new Set<PlatformTargetId>([
  'codex-native',
  'codex-plugin',
  'claude-like',
  'cursor',
  'marketplace-bundle',
  'mcp-capable-ide',
  'adapter-openclaw',
  'adapter-hermes',
]);
const LANES = new Set<PlatformTargetLane>(['delivery', 'adapter']);
const STATUSES = new Set<PlatformTargetStatus>(['active', 'planned']);
const OWNERSHIPS = new Set<RuntimeOwnership>([
  'setup-owned',
  'plugin-scoped',
  'adapter-owned',
  'platform-owned',
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`platform_target_manifest_invalid:${field}`);
  }
}

function assertStringArray(value: unknown, field: string): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new Error(`platform_target_manifest_invalid:${field}`);
  }
}

export function validatePlatformTargetManifest(input: unknown): PlatformTargetManifest {
  if (!isObject(input)) throw new Error('platform_target_manifest_invalid:root');
  if (typeof input.schemaVersion !== 'number' || !Number.isInteger(input.schemaVersion)) {
    throw new Error('platform_target_manifest_invalid:schemaVersion');
  }
  assertNonEmptyString(input.manifestVersion, 'manifestVersion');
  if (!Array.isArray(input.targets)) throw new Error('platform_target_manifest_invalid:targets');

  const seen = new Set<string>();
  const targets = input.targets.map((entry, index) => {
    if (!isObject(entry)) throw new Error(`platform_target_manifest_invalid:targets[${index}]`);
    assertNonEmptyString(entry.id, `targets[${index}].id`);
    assertNonEmptyString(entry.displayName, `targets[${index}].displayName`);
    assertNonEmptyString(entry.lane, `targets[${index}].lane`);
    assertNonEmptyString(entry.status, `targets[${index}].status`);
    assertNonEmptyString(entry.runtimeOwnership, `targets[${index}].runtimeOwnership`);
    assertNonEmptyString(entry.purpose, `targets[${index}].purpose`);
    assertStringArray(entry.canonicalSources, `targets[${index}].canonicalSources`);
    assertStringArray(entry.deliveryArtifacts, `targets[${index}].deliveryArtifacts`);
    assertStringArray(entry.notes, `targets[${index}].notes`);

    const id = entry.id.trim() as PlatformTargetId;
    if (!TARGET_IDS.has(id)) throw new Error(`platform_target_manifest_invalid:targets[${index}].id`);
    if (seen.has(id)) throw new Error(`platform_target_manifest_invalid:duplicate_target:${id}`);
    seen.add(id);

    if (!LANES.has(entry.lane as PlatformTargetLane)) {
      throw new Error(`platform_target_manifest_invalid:targets[${index}].lane`);
    }
    if (!STATUSES.has(entry.status as PlatformTargetStatus)) {
      throw new Error(`platform_target_manifest_invalid:targets[${index}].status`);
    }
    if (!OWNERSHIPS.has(entry.runtimeOwnership as RuntimeOwnership)) {
      throw new Error(`platform_target_manifest_invalid:targets[${index}].runtimeOwnership`);
    }

    return {
      id,
      displayName: entry.displayName.trim(),
      lane: entry.lane as PlatformTargetLane,
      status: entry.status as PlatformTargetStatus,
      runtimeOwnership: entry.runtimeOwnership as RuntimeOwnership,
      purpose: entry.purpose.trim(),
      canonicalSources: entry.canonicalSources.map((item) => item.trim()),
      deliveryArtifacts: entry.deliveryArtifacts.map((item) => item.trim()),
      notes: entry.notes.map((item) => item.trim()),
    } satisfies PlatformTargetEntry;
  });

  if (targets.length !== TARGET_IDS.size) {
    throw new Error('platform_target_manifest_invalid:missing_targets');
  }

  return {
    schemaVersion: input.schemaVersion,
    manifestVersion: input.manifestVersion.trim(),
    targets,
  };
}
