/**
 * Forge verification stage adapter for pipeline orchestrator.
 *
 * Wraps the Forge persistence loop into a PipelineStage for the
 * verification phase. Uses configurable iteration count.
 */

import type { PipelineStage, StageContext, StageResult } from '../types.js';
import {
  buildFollowupStaffingPlan,
  resolveAvailableAgentTypes,
} from '../../team/followup-planner.js';

export interface ForgeVerifyStageOptions {
  /** Stage name. Strict Autopilot uses 'forge'; legacy pipeline adapters use 'forge-verify'. */
  stageName?: string;

  /**
   * Ordered artifact keys used as Forge execution input.
   * Legacy forge-verify keeps reading prior forge/team-exec output; strict Autopilot
   * Forge reads blueprint first so implementation starts from approved planning.
   */
  executionArtifactKeys?: readonly string[];

  /**
   * Maximum number of forge verification iterations.
   * Defaults to 10.
   */
  maxIterations?: number;
}

/**
 * Create a forge-verify pipeline stage.
 *
 * This stage wraps the Forge persistence loop for the verification phase
 * of legacy pipelines. Strict Autopilot uses `createForgeStage()` for the
 * implementation/verification phase before code-review.
 */
export function createForgeVerifyStage(options: ForgeVerifyStageOptions = {}): PipelineStage {
  const maxIterations = options.maxIterations ?? 10;

  return {
    name: options.stageName ?? 'forge-verify',

    async run(ctx: StageContext): Promise<StageResult> {
      const startTime = Date.now();

      try {
        // Extract execution context from previous stage.
        const executionArtifactKeys = options.executionArtifactKeys ?? ['forge', 'team-exec'];
        const executionArtifacts = pickFirstArtifact(ctx.artifacts, executionArtifactKeys);
        const availableAgentTypes = await resolveAvailableAgentTypes(ctx.cwd);
        const staffingPlan = buildFollowupStaffingPlan('forge', ctx.task, availableAgentTypes, {
          workerCount: Math.min(maxIterations, 3),
        });

        // Build forge verification descriptor
        const verifyDescriptor: ForgeVerifyDescriptor = {
          task: ctx.task,
          maxIterations,
          cwd: ctx.cwd,
          sessionId: ctx.sessionId,
          availableAgentTypes,
          staffingPlan,
          executionArtifacts: executionArtifacts ?? {},
        };

        return {
          status: 'completed',
          artifacts: {
            verifyDescriptor,
            maxIterations,
            availableAgentTypes,
            staffingPlan,
            stage: 'forge-verify',
            instruction: buildForgeInstruction(verifyDescriptor),
          },
          duration_ms: Date.now() - startTime,
        };
      } catch (err) {
        return {
          status: 'failed',
          artifacts: {},
          duration_ms: Date.now() - startTime,
          error: `Forge verification stage failed: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Forge verification descriptor
// ---------------------------------------------------------------------------

/**
 * Descriptor for a forge verification run, consumed by the forge runtime.
 */
export interface ForgeVerifyDescriptor {
  task: string;
  maxIterations: number;
  cwd: string;
  sessionId?: string;
  availableAgentTypes: string[];
  staffingPlan: ReturnType<typeof buildFollowupStaffingPlan>;
  executionArtifacts: Record<string, unknown>;
}

/**
 * Build the forge CLI instruction from a descriptor.
 */
export function buildForgeInstruction(descriptor: ForgeVerifyDescriptor): string {
  return `${descriptor.staffingPlan.launchHints.shellCommand} # max_iterations=${descriptor.maxIterations} # staffing=${descriptor.staffingPlan.staffingSummary} # verify=${descriptor.staffingPlan.verificationPlan.summary}`;
}

function pickFirstArtifact(
  artifacts: Record<string, unknown>,
  keys: readonly string[],
): Record<string, unknown> | undefined {
  for (const key of keys) {
    const artifact = artifacts[key];
    if (artifact && typeof artifact === 'object') {
      return artifact as Record<string, unknown>;
    }
  }
  return undefined;
}

/** Create the strict Autopilot Forge phase adapter. */
export function createForgeStage(options: ForgeVerifyStageOptions = {}): PipelineStage {
  return createForgeVerifyStage({
    ...options,
    stageName: 'forge',
    executionArtifactKeys: options.executionArtifactKeys ?? ['blueprint', 'team-exec'],
  });
}
