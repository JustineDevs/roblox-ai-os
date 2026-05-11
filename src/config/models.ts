/**
 * Model Configuration
 *
 * Reads per-mode model overrides and default-env overrides from .rcs-config.json.
 *
 * Config format:
 * {
 *   "env": {
 *     "RCS_DEFAULT_FRONTIER_MODEL": "your-frontier-model",
 *     "RCS_DEFAULT_STANDARD_MODEL": "your-standard-model",
 *     "RCS_DEFAULT_SPARK_MODEL": "your-spark-model"
 *   },
 *   "models": {
 *     "default": "o4-mini",
 *     "team": "gpt-4.1"
 *   }
 * }
 *
 * Resolution: mode-specific > "default" key > RCS_DEFAULT_FRONTIER_MODEL > DEFAULT_FRONTIER_MODEL
 */

import { parse as parseToml } from '@iarna/toml';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { codexConfigPath, codexHome } from '../utils/paths.js';

export interface ModelsConfig {
  [mode: string]: string | undefined;
}

export interface RcsConfigEnv {
  [key: string]: string | undefined;
}

export interface ProviderProfile {
  base_url?: string;
  api_format?: string;
  env_key?: string;
  capabilities?: string[];
  label?: string;
}

export interface ProviderRoutingConfig {
  default_provider?: string;
  mode_providers?: Record<string, string | undefined>;
  fallback_providers?: string[];
  mode_fallback_providers?: Record<string, string[] | undefined>;
  hot_swap?: boolean;
  failover?: boolean;
}

interface RcsConfigFile {
  env?: RcsConfigEnv;
  models?: ModelsConfig;
  providers?: Record<string, ProviderProfile>;
  routing?: ProviderRoutingConfig;
}

interface CodexConfigFile {
  model?: unknown;
  model_provider?: unknown;
  model_providers?: Record<string, unknown>;
}

export const RCS_DEFAULT_FRONTIER_MODEL_ENV = 'RCS_DEFAULT_FRONTIER_MODEL';
export const RCS_DEFAULT_STANDARD_MODEL_ENV = 'RCS_DEFAULT_STANDARD_MODEL';
export const RCS_DEFAULT_SPARK_MODEL_ENV = 'RCS_DEFAULT_SPARK_MODEL';
export const RCS_SPARK_MODEL_ENV = 'RCS_SPARK_MODEL';
export const RCS_TEAM_CHILD_MODEL_ENV = 'RCS_TEAM_CHILD_MODEL';
export const RCS_DEFAULT_PROVIDER_ENV = 'RCS_DEFAULT_PROVIDER';
export const RCS_PROVIDER_FAILOVER_ENV = 'RCS_PROVIDER_FAILOVER';
export const RCS_PROVIDER_HOT_SWAP_ENV = 'RCS_PROVIDER_HOT_SWAP';

export interface ActiveProviderConnection {
  provider: string | null;
  baseUrl: string | null;
  apiFormat: string | null;
  envKey: string | null;
  envValuePresent: boolean;
  fallbackProviders: string[];
  hotSwapEnabled: boolean;
  failoverEnabled: boolean;
}

function readRcsConfigFile(codexHomeOverride?: string): RcsConfigFile | null {
  const configPath = join(codexHomeOverride || codexHome(), '.rcs-config.json');
  if (!existsSync(configPath)) return null;
  try {
    const raw = JSON.parse(readFileSync(configPath, 'utf-8'));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    return raw as RcsConfigFile;
  } catch {
    return null;
  }
}

function readCodexConfigFile(codexHomeOverride?: string): CodexConfigFile | null {
  const configPath = codexHomeOverride
    ? join(codexHomeOverride, 'config.toml')
    : codexConfigPath();
  if (!existsSync(configPath)) return null;
  try {
    const raw = parseToml(readFileSync(configPath, 'utf-8'));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    return raw as CodexConfigFile;
  } catch {
    return null;
  }
}

function readModelsBlock(codexHomeOverride?: string): ModelsConfig | null {
  const config = readRcsConfigFile(codexHomeOverride);
  if (!config) return null;
  if (config.models && typeof config.models === 'object' && !Array.isArray(config.models)) {
    return config.models;
  }
  return null;
}

function readProvidersBlock(
  codexHomeOverride?: string,
): Record<string, ProviderProfile> | null {
  const config = readRcsConfigFile(codexHomeOverride);
  if (!config) return null;
  if (
    config.providers &&
    typeof config.providers === 'object' &&
    !Array.isArray(config.providers)
  ) {
    return config.providers;
  }
  return null;
}

function readRoutingBlock(
  codexHomeOverride?: string,
): ProviderRoutingConfig | null {
  const config = readRcsConfigFile(codexHomeOverride);
  if (!config) return null;
  if (
    config.routing &&
    typeof config.routing === 'object' &&
    !Array.isArray(config.routing)
  ) {
    return config.routing;
  }
  return null;
}

export const DEFAULT_FRONTIER_MODEL = 'gpt-5.5';
export const DEFAULT_STANDARD_MODEL = 'gpt-5.4-mini';
export const DEFAULT_SPARK_MODEL = 'gpt-5.3-codex-spark';
export const DEFAULT_TEAM_CHILD_MODEL = DEFAULT_STANDARD_MODEL;

function normalizeConfiguredValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readConfigEnvValue(key: string, codexHomeOverride?: string): string | undefined {
  const config = readRcsConfigFile(codexHomeOverride);
  if (!config || !config.env || typeof config.env !== 'object' || Array.isArray(config.env)) {
    return undefined;
  }
  return normalizeConfiguredValue(config.env[key]);
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => normalizeConfiguredValue(entry))
    .filter((entry): entry is string => Boolean(entry));
}

function readTeamLowComplexityOverride(codexHomeOverride?: string): string | undefined {
  const models = readModelsBlock(codexHomeOverride);
  if (!models) return undefined;
  for (const key of TEAM_LOW_COMPLEXITY_MODEL_KEYS) {
    const value = normalizeConfiguredValue(models[key]);
    if (value) return value;
  }
  return undefined;
}

export function readConfiguredEnvOverrides(codexHomeOverride?: string): NodeJS.ProcessEnv {
  const config = readRcsConfigFile(codexHomeOverride);
  if (!config || !config.env || typeof config.env !== 'object' || Array.isArray(config.env)) {
    return {};
  }

  const resolved: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(config.env)) {
    const normalized = normalizeConfiguredValue(value);
    if (normalized) resolved[key] = normalized;
  }
  return resolved;
}

export function readProviderProfiles(
  codexHomeOverride?: string,
): Record<string, ProviderProfile> {
  const providers = readProvidersBlock(codexHomeOverride);
  if (!providers) return {};

  const normalized: Record<string, ProviderProfile> = {};
  for (const [name, profile] of Object.entries(providers)) {
    const normalizedName = normalizeConfiguredValue(name);
    if (!normalizedName || !profile || typeof profile !== 'object' || Array.isArray(profile)) {
      continue;
    }

    normalized[normalizedName] = {
      ...(normalizeConfiguredValue(profile.base_url)
        ? { base_url: normalizeConfiguredValue(profile.base_url) }
        : {}),
      ...(normalizeConfiguredValue(profile.api_format)
        ? { api_format: normalizeConfiguredValue(profile.api_format) }
        : {}),
      ...(normalizeConfiguredValue(profile.env_key)
        ? { env_key: normalizeConfiguredValue(profile.env_key) }
        : {}),
      ...(normalizeConfiguredValue(profile.label)
        ? { label: normalizeConfiguredValue(profile.label) }
        : {}),
      ...(normalizeStringArray(profile.capabilities).length > 0
        ? { capabilities: normalizeStringArray(profile.capabilities) }
        : {}),
    };
  }

  return normalized;
}

export function getConfiguredDefaultProvider(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): string | undefined {
  return normalizeConfiguredValue(env[RCS_DEFAULT_PROVIDER_ENV])
    ?? normalizeConfiguredValue(readRoutingBlock(codexHomeOverride)?.default_provider)
    ?? getCodexConfigRootModelProvider(codexHomeOverride);
}

export function getProviderForMode(
  mode: string,
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): string | undefined {
  const routing = readRoutingBlock(codexHomeOverride);
  const modeProvider = normalizeConfiguredValue(routing?.mode_providers?.[mode]);
  if (modeProvider) return modeProvider;
  return getConfiguredDefaultProvider(env, codexHomeOverride);
}

export function getFallbackProvidersForMode(
  mode: string,
  codexHomeOverride?: string,
): string[] {
  const routing = readRoutingBlock(codexHomeOverride);
  const modeFallbacks = normalizeStringArray(routing?.mode_fallback_providers?.[mode]);
  if (modeFallbacks.length > 0) return modeFallbacks;
  return normalizeStringArray(routing?.fallback_providers);
}

export function readProviderRoutingFlags(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): { hotSwapEnabled: boolean; failoverEnabled: boolean } {
  const routing = readRoutingBlock(codexHomeOverride);

  const hotSwapEnabled = normalizeConfiguredValue(env[RCS_PROVIDER_HOT_SWAP_ENV]) === '1'
    || routing?.hot_swap === true;
  const failoverEnabled = normalizeConfiguredValue(env[RCS_PROVIDER_FAILOVER_ENV]) === '1'
    || routing?.failover === true;

  return { hotSwapEnabled, failoverEnabled };
}

export function readActiveProviderEnvOverrides(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
  activeProviderOverride?: string,
): NodeJS.ProcessEnv {
  const activeProvider =
    normalizeConfiguredValue(activeProviderOverride)
    ?? getConfiguredDefaultProvider(env, codexHomeOverride);
  if (!activeProvider) return {};

  const rcsProviderProfile = readProviderProfiles(codexHomeOverride)[activeProvider];
  const rcsEnvKey = normalizeConfiguredValue(rcsProviderProfile?.env_key);
  if (rcsEnvKey) {
    const envValue = normalizeConfiguredValue(env[rcsEnvKey]);
    return envValue ? { [rcsEnvKey]: envValue } : {};
  }

  const config = readCodexConfigFile(codexHomeOverride);
  if (!config) return {};

  const providers = config.model_providers;
  if (!providers || typeof providers !== 'object' || Array.isArray(providers)) {
    return {};
  }

  const providerConfig = providers[activeProvider];
  if (!providerConfig || typeof providerConfig !== 'object' || Array.isArray(providerConfig)) {
    return {};
  }

  const envKey = normalizeConfiguredValue((providerConfig as Record<string, unknown>).env_key);
  if (!envKey) return {};

  const envValue = normalizeConfiguredValue(env[envKey]);
  return envValue ? { [envKey]: envValue } : {};
}

export function readActiveProviderConnection(
  env: NodeJS.ProcessEnv = process.env,
  mode?: string,
  codexHomeOverride?: string,
  activeProviderOverride?: string,
): ActiveProviderConnection {
  const provider =
    normalizeConfiguredValue(activeProviderOverride)
    ?? (mode ? getProviderForMode(mode, env, codexHomeOverride) : getConfiguredDefaultProvider(env, codexHomeOverride))
    ?? null;

  const profile = provider ? readProviderProfiles(codexHomeOverride)[provider] : undefined;
  const fallbackProviders = mode
    ? getFallbackProvidersForMode(mode, codexHomeOverride)
    : normalizeStringArray(readRoutingBlock(codexHomeOverride)?.fallback_providers);
  const { hotSwapEnabled, failoverEnabled } = readProviderRoutingFlags(env, codexHomeOverride);

  const envKey = normalizeConfiguredValue(profile?.env_key) ?? null;
  const envValuePresent = envKey ? normalizeConfiguredValue(env[envKey]) !== undefined : false;

  return {
    provider,
    baseUrl: normalizeConfiguredValue(profile?.base_url) ?? null,
    apiFormat: normalizeConfiguredValue(profile?.api_format) ?? null,
    envKey,
    envValuePresent,
    fallbackProviders,
    hotSwapEnabled,
    failoverEnabled,
  };
}

export function getEnvConfiguredMainDefaultModel(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): string | undefined {
  return normalizeConfiguredValue(env[RCS_DEFAULT_FRONTIER_MODEL_ENV])
    ?? readConfigEnvValue(RCS_DEFAULT_FRONTIER_MODEL_ENV, codexHomeOverride);
}

function getCodexConfigRootModel(codexHomeOverride?: string): string | undefined {
  return normalizeConfiguredValue(readCodexConfigFile(codexHomeOverride)?.model);
}

export function getCodexConfigRootModelProvider(codexHomeOverride?: string): string | undefined {
  return normalizeConfiguredValue(readCodexConfigFile(codexHomeOverride)?.model_provider);
}

export function getEnvConfiguredStandardDefaultModel(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): string | undefined {
  return normalizeConfiguredValue(env[RCS_DEFAULT_STANDARD_MODEL_ENV])
    ?? readConfigEnvValue(RCS_DEFAULT_STANDARD_MODEL_ENV, codexHomeOverride);
}

export function getEnvConfiguredSparkDefaultModel(
  env: NodeJS.ProcessEnv = process.env,
  codexHomeOverride?: string,
): string | undefined {
  return normalizeConfiguredValue(env[RCS_DEFAULT_SPARK_MODEL_ENV])
    ?? normalizeConfiguredValue(env[RCS_SPARK_MODEL_ENV])
    ?? readConfigEnvValue(RCS_DEFAULT_SPARK_MODEL_ENV, codexHomeOverride)
    ?? readConfigEnvValue(RCS_SPARK_MODEL_ENV, codexHomeOverride);
}


export function getTeamChildModel(codexHomeOverride?: string): string {
  return normalizeConfiguredValue(process.env[RCS_TEAM_CHILD_MODEL_ENV])
    ?? readConfigEnvValue(RCS_TEAM_CHILD_MODEL_ENV, codexHomeOverride)
    ?? DEFAULT_TEAM_CHILD_MODEL;
}

/**
 * Get the envvar-backed main/default model.
 * Resolution: RCS_DEFAULT_FRONTIER_MODEL > config.toml model > DEFAULT_FRONTIER_MODEL
 */
export function getMainDefaultModel(codexHomeOverride?: string): string {
  return getEnvConfiguredMainDefaultModel(process.env, codexHomeOverride)
    ?? getCodexConfigRootModel(codexHomeOverride)
    ?? DEFAULT_FRONTIER_MODEL;
}

/**
 * Get the envvar-backed standard/default subagent model.
 *
 * Standard-role subagents inherit the configured main/default model unless an
 * explicit standard-lane override is configured. This keeps spawned agents in
 * sync with the leader model while preserving RCS_DEFAULT_STANDARD_MODEL as the
 * opt-in escape hatch for cheaper/specialized standard workers.
 *
 * Resolution: RCS_DEFAULT_STANDARD_MODEL > RCS_DEFAULT_FRONTIER_MODEL > config.toml model > DEFAULT_FRONTIER_MODEL
 */
export function getStandardDefaultModel(codexHomeOverride?: string): string {
  return getEnvConfiguredStandardDefaultModel(process.env, codexHomeOverride)
    ?? getMainDefaultModel(codexHomeOverride);
}

/**
 * Get the configured model for a specific mode.
 * Resolution: mode-specific override > "default" key > RCS_DEFAULT_FRONTIER_MODEL > DEFAULT_FRONTIER_MODEL
 */
export function getModelForMode(mode: string, codexHomeOverride?: string): string {
  const models = readModelsBlock(codexHomeOverride);
  const modeValue = normalizeConfiguredValue(models?.[mode]);
  if (modeValue) return modeValue;

  const defaultValue = normalizeConfiguredValue(models?.default);
  if (defaultValue) return defaultValue;

  return getMainDefaultModel(codexHomeOverride);
}

const TEAM_LOW_COMPLEXITY_MODEL_KEYS = [
  'team_low_complexity',
  'team-low-complexity',
  'teamLowComplexity',
];

/**
 * Get the envvar-backed spark/low-complexity default model.
 * Resolution: RCS_DEFAULT_SPARK_MODEL > RCS_SPARK_MODEL > explicit low-complexity key(s) > DEFAULT_SPARK_MODEL
 */
export function getSparkDefaultModel(codexHomeOverride?: string): string {
  return getEnvConfiguredSparkDefaultModel(process.env, codexHomeOverride)
    ?? readTeamLowComplexityOverride(codexHomeOverride)
    ?? DEFAULT_SPARK_MODEL;
}

/**
 * Get the low-complexity team worker model.
 * Resolution: explicit low-complexity key(s) > RCS_DEFAULT_SPARK_MODEL > RCS_SPARK_MODEL > DEFAULT_SPARK_MODEL
 */
export function getTeamLowComplexityModel(codexHomeOverride?: string): string {
  return readTeamLowComplexityOverride(codexHomeOverride) ?? getSparkDefaultModel(codexHomeOverride);
}
