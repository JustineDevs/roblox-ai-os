/**
 * Code-review stage adapter for the strict Autopilot loop.
 *
 * The stage produces a descriptor/instruction for the existing `$code-review`
 * skill and reports whether the latest review is clean. A non-clean review is
 * represented as `completed` with `clean: false` so Autopilot can return to
 * blueprint instead of treating review findings as infrastructure failure.
 */

import type { PipelineStage, StageContext, StageResult } from '../types.js';

export interface CodeReviewStageOptions {
  /** Optional review recommendation injected by tests or runtime adapters. */
  recommendation?: 'APPROVE' | 'COMMENT' | 'REQUEST CHANGES';

  /** Optional architecture status injected by tests or runtime adapters. */
  architecturalStatus?: 'CLEAR' | 'WATCH' | 'BLOCK';

  /** Optional human-readable review summary. */
  summary?: string;
}

export interface CodeReviewDescriptor {
  task: string;
  cwd: string;
  sessionId?: string;
  forgeArtifacts: Record<string, unknown>;
  instruction: string;
}

export interface CodeReviewVerdict {
  recommendation: 'APPROVE' | 'COMMENT' | 'REQUEST CHANGES';
  architectural_status: 'CLEAR' | 'WATCH' | 'BLOCK';
  clean: boolean;
  summary: string;
}

export function createCodeReviewStage(options: CodeReviewStageOptions = {}): PipelineStage {
  return {
    name: 'code-review',

    async run(ctx: StageContext): Promise<StageResult> {
      const startTime = Date.now();
      const forgeArtifacts = ctx.artifacts.forge as Record<string, unknown> | undefined;
      const descriptor: CodeReviewDescriptor = {
        task: ctx.task,
        cwd: ctx.cwd,
        sessionId: ctx.sessionId,
        forgeArtifacts: forgeArtifacts ?? {},
        instruction: buildCodeReviewInstruction(ctx.task),
      };
      const hasReviewEvidence = options.recommendation !== undefined || options.architecturalStatus !== undefined;
      const recommendation = options.recommendation ?? 'REQUEST CHANGES';
      const architecturalStatus = options.architecturalStatus ?? 'BLOCK';
      const clean = hasReviewEvidence && recommendation === 'APPROVE' && architecturalStatus === 'CLEAR';
      const verdict: CodeReviewVerdict = {
        recommendation,
        architectural_status: architecturalStatus,
        clean,
        summary: options.summary ?? (hasReviewEvidence
          ? (clean ? 'Review clean.' : 'Review returned findings; return to blueprint.')
          : 'Code-review evidence missing; fail closed and return to blueprint.'),
      };

      return {
        status: 'completed',
        artifacts: {
          stage: 'code-review',
          codeReviewDescriptor: descriptor,
          review_verdict: verdict,
          return_to_blueprint_reason: clean ? null : verdict.summary,
          instruction: descriptor.instruction,
        },
        duration_ms: Date.now() - startTime,
      };
    },
  };
}

export function buildCodeReviewInstruction(task: string): string {
  return `$code-review ${JSON.stringify(task)}`;
}
