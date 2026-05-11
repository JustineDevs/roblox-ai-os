#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SURFACE_CLASSES = ['canonical', 'operator', 'internal', 'historical'] as const;
export const SURFACE_DOMAINS = ['roblox-studio', 'creator-runtime', 'archive'] as const;
export const SURFACE_AUDIENCES = ['creator', 'operator', 'internal', 'archive'] as const;
export const ARTIFACT_TYPES = ['prompt', 'skill', 'mission', 'sandbox'] as const;

export type SurfaceClass = (typeof SURFACE_CLASSES)[number];
export type SurfaceDomain = (typeof SURFACE_DOMAINS)[number];
export type SurfaceAudience = (typeof SURFACE_AUDIENCES)[number];
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

export interface SurfaceTaxonomyRecord {
  path: string;
  title: string;
  description: string;
  surfaceClass: SurfaceClass;
  domain: SurfaceDomain;
  audience: SurfaceAudience;
  artifactType: ArtifactType;
}

const SURFACE_MAP_PATH = 'docs/reference/surface-map.md';

const REMOVED_GENERIC_LABEL_PATTERNS: RegExp[] = [
  /\bfrontend-ui-ux\b/i,
  /\bproduct-manager\b/i,
  /\bproduct-analyst\b/i,
  /\bux-researcher\b/i,
  /\binformation-architect\b/i,
  /\bqa-tester\b/i,
  /\bquality-strategist\b/i,
  /\bquality-reviewer\b/i,
  /\bapi-reviewer\b/i,
  /\bperformance-reviewer\b/i,
];

const GUARDED_ENTERPRISE_PATTERNS: RegExp[] = [
  /\bDTO\b/i,
  /\bmicroservice\b/i,
  /\btenant\b/i,
  /\bSaaS user\b/i,
  /\bCRUD app\b/i,
  /\bweb-app\b/i,
  /\bdashboard\b/i,
];

const ENTERPRISE_GUARD_ALLOWLIST = new Set([
  'skills/blueprint/SKILL.md',
  'skills/forge/SKILL.md',
]);

function listSurfacePaths(root: string): string[] {
  const promptPaths = readdirSync(join(root, 'prompts'))
    .filter((file) => file.endsWith('.md'))
    .map((file) => join('prompts', file));

  const skillPaths = readdirSync(join(root, 'skills'))
    .map((dir) => join('skills', dir, 'SKILL.md'))
    .filter((path) => existsSync(join(root, path)));

  const missionPaths = readdirSync(join(root, 'missions'))
    .flatMap((dir) => [join('missions', dir, 'mission.md'), join('missions', dir, 'sandbox.md')])
    .filter((path) => existsSync(join(root, path)));

  return [...promptPaths, ...skillPaths, ...missionPaths].sort();
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; content: string } | null {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;
  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) frontmatter[key] = value;
  }
  return { frontmatter, content: match[2] };
}

function deriveExpectedArtifactType(path: string): ArtifactType {
  if (path.startsWith('prompts/')) return 'prompt';
  if (path.startsWith('skills/')) return 'skill';
  if (path.endsWith('/mission.md')) return 'mission';
  return 'sandbox';
}

function deriveFallbackTitle(path: string, content: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  if (path.endsWith('/SKILL.md')) return path.split('/').slice(-2, -1)[0];
  if (path.endsWith('/sandbox.md')) return `${path.split('/').slice(-2, -1)[0]} sandbox`;
  const leaf = path.split('/').pop() ?? path;
  return leaf.replace(/\.md$/i, '');
}

export function collectSurfaceTaxonomy(root = process.cwd()): SurfaceTaxonomyRecord[] {
  return listSurfacePaths(root).map((path) => {
    const raw = readFileSync(join(root, path), 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      throw new Error(`surface_taxonomy_missing_frontmatter:${path}`);
    }

    const surfaceClass = parsed.frontmatter['surface-class'] as SurfaceClass;
    const domain = parsed.frontmatter.domain as SurfaceDomain;
    const audience = parsed.frontmatter.audience as SurfaceAudience;
    const artifactType = parsed.frontmatter['artifact-type'] as ArtifactType;

    return {
      path,
      title: parsed.frontmatter.name || deriveFallbackTitle(path, parsed.content),
      description: parsed.frontmatter.description || '',
      surfaceClass,
      domain,
      audience,
      artifactType,
    };
  });
}

export function validateSurfaceTaxonomy(records: SurfaceTaxonomyRecord[]): string[] {
  const errors: string[] = [];

  for (const record of records) {
    if (!SURFACE_CLASSES.includes(record.surfaceClass)) {
      errors.push(`invalid_surface_class:${record.path}:${record.surfaceClass}`);
    }
    if (!SURFACE_DOMAINS.includes(record.domain)) {
      errors.push(`invalid_domain:${record.path}:${record.domain}`);
    }
    if (!SURFACE_AUDIENCES.includes(record.audience)) {
      errors.push(`invalid_audience:${record.path}:${record.audience}`);
    }
    if (!ARTIFACT_TYPES.includes(record.artifactType)) {
      errors.push(`invalid_artifact_type:${record.path}:${record.artifactType}`);
    }

    const expectedArtifactType = deriveExpectedArtifactType(record.path);
    if (record.artifactType !== expectedArtifactType) {
      errors.push(`artifact_type_path_mismatch:${record.path}:${record.artifactType}:${expectedArtifactType}`);
    }

    if (record.surfaceClass === 'canonical') {
      if (record.domain !== 'roblox-studio') {
        errors.push(`canonical_domain_mismatch:${record.path}:${record.domain}`);
      }
      if (record.audience !== 'creator') {
        errors.push(`canonical_audience_mismatch:${record.path}:${record.audience}`);
      }
    }

    if (record.surfaceClass === 'historical') {
      if (record.domain !== 'archive') {
        errors.push(`historical_domain_mismatch:${record.path}:${record.domain}`);
      }
      if (record.audience !== 'archive') {
        errors.push(`historical_audience_mismatch:${record.path}:${record.audience}`);
      }
    }

    if (record.path.startsWith('prompts/') && record.surfaceClass !== 'internal') {
      errors.push(`prompt_surface_class_mismatch:${record.path}:${record.surfaceClass}`);
    }

    if (record.path.startsWith('prompts/') && record.domain !== 'creator-runtime') {
      errors.push(`prompt_domain_mismatch:${record.path}:${record.domain}`);
    }

    if (record.path.startsWith('prompts/') && record.audience !== 'internal') {
      errors.push(`prompt_audience_mismatch:${record.path}:${record.audience}`);
    }
  }

  return errors;
}

export function validateVocabularyDiscipline(records: SurfaceTaxonomyRecord[], root = process.cwd()): string[] {
  const errors: string[] = [];

  for (const record of records) {
    if (record.surfaceClass === 'historical') continue;
    const content = readFileSync(join(root, record.path), 'utf8');

    for (const pattern of REMOVED_GENERIC_LABEL_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(`removed_generic_label:${record.path}:${pattern}`);
      }
    }

    if (ENTERPRISE_GUARD_ALLOWLIST.has(record.path)) continue;
    for (const pattern of GUARDED_ENTERPRISE_PATTERNS) {
      if (pattern.test(content)) {
        errors.push(`unguarded_enterprise_term:${record.path}:${pattern}`);
      }
    }
  }

  return errors;
}

function groupRecords(records: SurfaceTaxonomyRecord[], surfaceClass: SurfaceClass): SurfaceTaxonomyRecord[] {
  return records
    .filter((record) => record.surfaceClass === surfaceClass)
    .sort((left, right) => left.path.localeCompare(right.path));
}

function renderTable(records: SurfaceTaxonomyRecord[]): string[] {
  if (records.length === 0) return ['_None._'];
  return [
    '| Path | Type | Domain | Audience | Surface |',
    '| --- | --- | --- | --- | --- |',
    ...records.map(
      (record) =>
        `| \`${record.path}\` | \`${record.artifactType}\` | \`${record.domain}\` | \`${record.audience}\` | ${record.title} |`,
    ),
  ];
}

export function buildSurfaceMapMarkdown(records: SurfaceTaxonomyRecord[]): string {
  const canonical = groupRecords(records, 'canonical');
  const operator = groupRecords(records, 'operator');
  const internal = groupRecords(records, 'internal');
  const historical = groupRecords(records, 'historical');

  return [
    '# Surface Map',
    '',
    'Status: generated map of active taxonomy-classified prompt, skill, and mission surfaces.',
    '',
    'Sources:',
    '- [`docs/reference/canonical-vocabulary.md`](./canonical-vocabulary.md)',
    '- [`docs/reference/semantic-design-system.md`](./semantic-design-system.md)',
    '',
    '## Counts',
    '',
    `- canonical: ${canonical.length}`,
    `- operator: ${operator.length}`,
    `- internal: ${internal.length}`,
    `- historical: ${historical.length}`,
    `- total tracked surfaces: ${records.length}`,
    '',
    '## Canonical Surfaces',
    '',
    ...renderTable(canonical),
    '',
    '## Operator Surfaces',
    '',
    ...renderTable(operator),
    '',
    '## Internal Surfaces',
    '',
    ...renderTable(internal),
    '',
    '## Historical Surfaces',
    '',
    ...renderTable(historical),
    '',
    '## Additional Repo Lanes',
    '',
    '- `AGENTS.md` and `templates/AGENTS.md` remain the orchestration brain and guidance authority.',
    '- `docs/archive/` is the historical lane; archive content may describe removed surfaces but must not act as active onboarding.',
    '- `src/catalog/manifest.json`, `templates/catalog-manifest.json`, and `src/catalog/generated/public-catalog.json` are the catalog source/generated contract lane.',
    '- `dist/` is generated runtime output and should reflect the taxonomy, not redefine it.',
    '',
  ].join('\n');
}

function writeSurfaceMap(root: string): string {
  const content = buildSurfaceMapMarkdown(collectSurfaceTaxonomy(root));
  const destination = join(root, SURFACE_MAP_PATH);
  writeFileSync(destination, `${content}\n`);
  return destination;
}

function checkSurfaceMap(root: string): void {
  const destination = join(root, SURFACE_MAP_PATH);
  const expected = `${buildSurfaceMapMarkdown(collectSurfaceTaxonomy(root))}\n`;
  const actual = readFileSync(destination, 'utf8');
  if (actual !== expected) {
    throw new Error('surface_map_drift');
  }
}

function main(): void {
  const root = process.cwd();
  const records = collectSurfaceTaxonomy(root);
  const taxonomyErrors = validateSurfaceTaxonomy(records);
  const vocabularyErrors = validateVocabularyDiscipline(records, root);
  const errors = [...taxonomyErrors, ...vocabularyErrors];

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  if (process.argv.includes('--check')) {
    checkSurfaceMap(root);
    console.log('surface taxonomy check ok');
    return;
  }

  const destination = writeSurfaceMap(root);
  console.log(`wrote ${destination}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
