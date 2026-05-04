/**
 * Pipeline orchestrator for roblox-ai-os-creator-skills
 *
 * Configurable pipeline that sequences: ralplan -> ralph -> code-review.
 * This is the strict Autopilot loop; legacy team/ralph-verify adapters remain available.
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

export { createRalplanStage } from './stages/ralplan.js';
export type { CreateRalplanStageOptions } from './stages/ralplan.js';
export { createTeamExecStage, buildTeamInstruction } from './stages/team-exec.js';
export type { TeamExecStageOptions, TeamExecDescriptor } from './stages/team-exec.js';
export { createRalphVerifyStage, createRalphStage, buildRalphInstruction } from './stages/ralph-verify.js';
export type { RalphVerifyStageOptions, RalphVerifyDescriptor } from './stages/ralph-verify.js';
export { createCodeReviewStage, buildCodeReviewInstruction } from './stages/code-review.js';
export type { CodeReviewStageOptions, CodeReviewDescriptor, CodeReviewVerdict } from './stages/code-review.js';
