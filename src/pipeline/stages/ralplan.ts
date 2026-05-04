/**
 * RALPLAN stage adapter for pipeline orchestrator.
 *
 * Wraps the consensus planning workflow (planner + architect + critic)
 * into a PipelineStage. Produces a plan artifact at `.rcs/plans/`.
 */

import type { PipelineStage, StageContext, StageResult } from '../types.js';
import { isPlanningComplete, readPlanningArtifacts } from '../../planning/artifacts.js';
import { isNonCleanReviewVerdict } from '../review-verdict.js';
import {
  runRalplanConsensus,
  type RalplanConsensusExecutor,
} from '../../ralplan/runtime.js';

export interface CreateRalplanStageOptions {
  executor?: RalplanConsensusExecutor;
  maxIterations?: number;
}

/**
 * Create a RALPLAN pipeline stage.
 *
 * The RALPLAN stage performs consensus planning by coordinating planner,
 * architect, and critic agents. It outputs a plan file that downstream
 * stages consume.
 *
 * By default this remains a structural adapter — actual agent orchestration
 * happens at the skill layer. When an executor is provided, the stage can
 * drive the real ralplan runtime and persist live mode state.
 */
export function createRalplanStage(options: CreateRalplanStageOptions = {}): PipelineStage {
  return {
    name: 'ralplan',

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
          const runtimeResult = await runRalplanConsensus(options.executor, {
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
              stage: 'ralplan',
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
            stage: 'ralplan',
            instruction: `Run RALPLAN consensus planning for: ${ctx.task}`,
          },
          duration_ms: Date.now() - startTime,
        };
      } catch (err) {
        return {
          status: 'failed',
          artifacts: {},
          duration_ms: Date.now() - startTime,
          error: `RALPLAN stage failed: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    },
  };
}

function hasReviewLoopContext(artifacts: Record<string, unknown>): boolean {
  if (typeof artifacts.return_to_ralplan_reason === 'string' && artifacts.return_to_ralplan_reason.trim() !== '') {
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
    (typeof reviewArtifacts.return_to_ralplan_reason === 'string'
      && reviewArtifacts.return_to_ralplan_reason.trim() !== '')
    || isNonCleanReviewVerdict(reviewArtifacts.review_verdict)
  );
}
