/**
 * Pipeline orchestrator for roblox-ai-os-creator-skills
 *
 * Configurable pipeline that sequences: blueprint -> forge -> code-review.
 * This is the strict Autopilot loop; canonical stage ownership lives under
 * blueprint -> forge -> code-review.
 *
 * @module pipeline
 */

export type {
  PipelineConfig,
  PipelineModeStateExtension,
  PipelineResult,
  PipelineStage,
  StageContext,
  StageResult,
} from './types.js';

export {
  cancelPipeline,
  canResumePipeline,
  createAutopilotPipelineConfig,
  readPipelineState,
  runPipeline,
} from './orchestrator.js';

export { createBlueprintStage } from './stages/blueprint.js';
export type { CreateBlueprintStageOptions } from './stages/blueprint.js';
export { createTeamExecStage, buildTeamInstruction } from './stages/team-exec.js';
export type { TeamExecStageOptions, TeamExecDescriptor } from './stages/team-exec.js';
export {
  createForgeVerifyStage,
  createForgeStage,
  buildForgeInstruction,
} from './stages/forge-verify.js';
export type { ForgeVerifyStageOptions, ForgeVerifyDescriptor } from './stages/forge-verify.js';
export { createCodeReviewStage, buildCodeReviewInstruction } from './stages/code-review.js';
export type { CodeReviewStageOptions, CodeReviewDescriptor, CodeReviewVerdict } from './stages/code-review.js';
