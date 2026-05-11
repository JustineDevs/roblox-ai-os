/**
 * Blueprint stage adapter for pipeline orchestrator.
 *
 * Wraps the consensus planning workflow (planner + architect + critic)
 * into a PipelineStage. Produces a plan artifact at `.rcs/plans/`.
 */

import type { PipelineStage, StageContext, StageResult } from '../types.js';
import { isPlanningComplete, readPlanningArtifacts } from '../../planning/artifacts.js';
import { isNonCleanReviewVerdict } from '../review-verdict.js';
import {
  runBlueprintConsensus,
  type BlueprintConsensusExecutor,
} from '../../blueprint/runtime.js';

export interface CreateBlueprintStageOptions {
  executor?: BlueprintConsensusExecutor;
  maxIterations?: number;
}

/**
 * Create a blueprint pipeline stage.
 *
 * The BLUEPRINT stage performs consensus planning by coordinating planner,
 * architect, and critic agents. It outputs a plan file that downstream
 * stages consume.
 *
 * By default this remains a structural adapter — actual agent orchestration
 * happens at the skill layer. When an executor is provided, the stage can
 * drive the real blueprint runtime and persist live mode state.
 */
export function createBlueprintStage(options: CreateBlueprintStageOptions = {}): PipelineStage {
  return {
    name: 'blueprint',

    canSkip(ctx: StageContext): boolean {
      if (hasReviewLoopContext(ctx.artifacts)) {
        return false;
      }
      return isPlanningComplete(readPlanningArtifacts(ctx.cwd));
    },

    async run(ctx: StageContext): Promise<StageResult> {
      const startTime = Date.now();
      try {
        if (options.executor) {
          const runtimeResult = await runBlueprintConsensus(options.executor, {
            task: ctx.task,
            cwd: ctx.cwd,
            maxIterations: options.maxIterations,
          });

          const planningArtifacts = readPlanningArtifacts(ctx.cwd);
          return {
            status: runtimeResult.status === 'completed' ? 'completed' : 'failed',
            artifacts: {
              plansDir: planningArtifacts.plansDir,
              specsDir: planningArtifacts.specsDir,
              task: ctx.task,
              prdPaths: planningArtifacts.prdPaths,
              testSpecPaths: planningArtifacts.testSpecPaths,
              deepInterviewSpecPaths: planningArtifacts.deepInterviewSpecPaths,
              planningComplete: runtimeResult.planningComplete,
              stage: 'blueprint',
              runtime: true,
              iteration: runtimeResult.iteration,
              latestPlanPath: runtimeResult.latestPlanPath,
              drafts: runtimeResult.drafts,
              architectReviews: runtimeResult.architectReviews,
              criticReviews: runtimeResult.criticReviews,
              ...runtimeResult.artifacts,
            },
            duration_ms: Date.now() - startTime,
            error: runtimeResult.error,
          };
        }

        const planningArtifacts = readPlanningArtifacts(ctx.cwd);

        return {
          status: 'completed',
          artifacts: {
            plansDir: planningArtifacts.plansDir,
            specsDir: planningArtifacts.specsDir,
            task: ctx.task,
            prdPaths: planningArtifacts.prdPaths,
            testSpecPaths: planningArtifacts.testSpecPaths,
            deepInterviewSpecPaths: planningArtifacts.deepInterviewSpecPaths,
            planningComplete: isPlanningComplete(planningArtifacts),
            stage: 'blueprint',
            instruction: `Run blueprint consensus planning for: ${ctx.task}`,
          },
          duration_ms: Date.now() - startTime,
        };
      } catch (err) {
        return {
          status: 'failed',
          artifacts: {},
          duration_ms: Date.now() - startTime,
          error: `Blueprint stage failed: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    },
  };
}

function hasReviewLoopContext(artifacts: Record<string, unknown>): boolean {
  if (typeof artifacts.return_to_blueprint_reason === 'string' && artifacts.return_to_blueprint_reason.trim() !== '') {
    return true;
  }
  if (isNonCleanReviewVerdict(artifacts.review_verdict)) {
    return true;
  }

  const codeReviewArtifacts = artifacts['code-review'];
  if (!codeReviewArtifacts || typeof codeReviewArtifacts !== 'object') {
    return false;
  }

  const reviewArtifacts = codeReviewArtifacts as Record<string, unknown>;
  return (
    (typeof reviewArtifacts.return_to_blueprint_reason === 'string'
      && reviewArtifacts.return_to_blueprint_reason.trim() !== '')
    || isNonCleanReviewVerdict(reviewArtifacts.review_verdict)
  );
}
