import { cancelMode, readModeState, startMode, updateModeState } from '../modes/base.js';
import { readPlanningArtifacts } from '../planning/artifacts.js';

export const BLUEPRINT_ACTIVE_PHASES = [
  'draft',
  'architect-review',
  'critic-review',
  'complete',
] as const;

export type BlueprintActivePhase = (typeof BLUEPRINT_ACTIVE_PHASES)[number];
export type BlueprintTerminalPhase = 'complete' | 'cancelled' | 'failed';
export type BlueprintReviewVerdict = 'approve' | 'iterate' | 'reject';

export interface BlueprintDraftResult {
  summary?: string;
  planPath?: string;
  artifacts?: Record<string, unknown>;
}

export interface BlueprintReviewResult {
  verdict: BlueprintReviewVerdict;
  summary?: string;
  artifacts?: Record<string, unknown>;
}

export interface BlueprintConsensusIterationContext {
  task: string;
  cwd: string;
  iteration: number;
  priorDrafts: BlueprintDraftResult[];
  architectReviews: BlueprintReviewResult[];
  criticReviews: BlueprintReviewResult[];
}

export interface BlueprintConsensusExecutor {
  draft(ctx: BlueprintConsensusIterationContext): Promise<BlueprintDraftResult>;
  architectReview(
    ctx: BlueprintConsensusIterationContext & { draft: BlueprintDraftResult },
  ): Promise<BlueprintReviewResult>;
  criticReview(
    ctx: BlueprintConsensusIterationContext & {
      draft: BlueprintDraftResult;
      architectReview: BlueprintReviewResult;
    },
  ): Promise<BlueprintReviewResult>;
}

export interface RunBlueprintConsensusOptions {
  task: string;
  cwd?: string;
  maxIterations?: number;
}

export interface BlueprintRuntimeResult {
  status: 'completed' | 'failed' | 'cancelled';
  iteration: number;
  phase: BlueprintTerminalPhase;
  planningComplete: boolean;
  drafts: BlueprintDraftResult[];
  architectReviews: BlueprintReviewResult[];
  criticReviews: BlueprintReviewResult[];
  latestPlanPath?: string;
  artifacts: Record<string, unknown>;
  error?: string;
}

interface BlueprintModeUpdates {
  active?: boolean;
  current_phase?: string;
  completed_at?: string;
  error?: string;
  planning_complete?: boolean;
  iteration?: number;
  latest_plan_path?: string;
  latest_draft_summary?: string;
  latest_architect_verdict?: BlueprintReviewVerdict;
  latest_architect_summary?: string;
  latest_critic_verdict?: BlueprintReviewVerdict;
  latest_critic_summary?: string;
  review_history?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

function buildReviewHistory(
  drafts: BlueprintDraftResult[],
  architectReviews: BlueprintReviewResult[],
  criticReviews: BlueprintReviewResult[],
): Array<Record<string, unknown>> {
  const entries: Array<Record<string, unknown>> = [];
  const total = Math.max(drafts.length, architectReviews.length, criticReviews.length);
  for (let index = 0; index < total; index++) {
    entries.push({
      iteration: index + 1,
      draft: drafts[index] ?? null,
      architect_review: architectReviews[index] ?? null,
      critic_review: criticReviews[index] ?? null,
    });
  }
  return entries;
}

async function updateBlueprintState(
  cwd: string,
  updates: BlueprintModeUpdates,
): Promise<void> {
  await updateModeState('blueprint', updates, cwd);
}

export async function runBlueprintConsensus(
  executor: BlueprintConsensusExecutor,
  options: RunBlueprintConsensusOptions,
): Promise<BlueprintRuntimeResult> {
  const cwd = options.cwd ?? process.cwd();
  const maxIterations = options.maxIterations ?? 5;
  const drafts: BlueprintDraftResult[] = [];
  const architectReviews: BlueprintReviewResult[] = [];
  const criticReviews: BlueprintReviewResult[] = [];
  const aggregatedArtifacts: Record<string, unknown> = {};
  let latestPlanPath: string | undefined;
  let iteration = 1;

  const existing = await readModeState('blueprint', cwd);
  if (existing?.active) {
    throw new Error('blueprint_active_mode_exists');
  }

  await startMode('blueprint', options.task, maxIterations, cwd);

  try {
    while (iteration <= maxIterations) {
      const iterationContext: BlueprintConsensusIterationContext = {
        task: options.task,
        cwd,
        iteration,
        priorDrafts: [...drafts],
        architectReviews: [...architectReviews],
        criticReviews: [...criticReviews],
      };

      await updateBlueprintState(cwd, {
        iteration,
        current_phase: 'draft',
        planning_complete: false,
        review_history: buildReviewHistory(drafts, architectReviews, criticReviews),
      });
      const draft = await executor.draft(iterationContext);
      drafts.push(draft);
      if (draft.artifacts) Object.assign(aggregatedArtifacts, draft.artifacts);
      if (draft.planPath) latestPlanPath = draft.planPath;

      await updateBlueprintState(cwd, {
        iteration,
        current_phase: 'architect-review',
        latest_plan_path: latestPlanPath,
        latest_draft_summary: draft.summary,
        review_history: buildReviewHistory(drafts, architectReviews, criticReviews),
      });
      const architectReview = await executor.architectReview({
        ...iterationContext,
        draft,
      });
      architectReviews.push(architectReview);
      if (architectReview.artifacts) Object.assign(aggregatedArtifacts, architectReview.artifacts);

      await updateBlueprintState(cwd, {
        iteration,
        current_phase: 'critic-review',
        latest_architect_verdict: architectReview.verdict,
        latest_architect_summary: architectReview.summary,
        review_history: buildReviewHistory(drafts, architectReviews, criticReviews),
      });
      const criticReview = await executor.criticReview({
        ...iterationContext,
        draft,
        architectReview,
      });
      criticReviews.push(criticReview);
      if (criticReview.artifacts) Object.assign(aggregatedArtifacts, criticReview.artifacts);

      const reviewHistory = buildReviewHistory(drafts, architectReviews, criticReviews);
      await updateBlueprintState(cwd, {
        iteration,
        current_phase: 'critic-review',
        latest_critic_verdict: criticReview.verdict,
        latest_critic_summary: criticReview.summary,
        review_history: reviewHistory,
      });

      if (criticReview.verdict === 'approve') {
        const planningArtifacts = readPlanningArtifacts(cwd);
        const planningComplete = planningArtifacts.prdPaths.length > 0 && planningArtifacts.testSpecPaths.length > 0;
        await updateBlueprintState(cwd, {
          active: false,
          iteration,
          current_phase: 'complete',
          completed_at: new Date().toISOString(),
          planning_complete: planningComplete,
          latest_plan_path: latestPlanPath,
          review_history: reviewHistory,
        });
        return {
          status: 'completed',
          iteration,
          phase: 'complete',
          planningComplete,
          drafts,
          architectReviews,
          criticReviews,
          latestPlanPath,
          artifacts: aggregatedArtifacts,
        };
      }

      if (iteration >= maxIterations) {
        const error = `blueprint_consensus_not_reached_after_${maxIterations}_iterations`;
        await updateBlueprintState(cwd, {
          active: false,
          iteration,
          current_phase: 'failed',
          completed_at: new Date().toISOString(),
          planning_complete: false,
          latest_plan_path: latestPlanPath,
          latest_critic_verdict: criticReview.verdict,
          latest_critic_summary: criticReview.summary,
          review_history: reviewHistory,
          error,
        });
        return {
          status: 'failed',
          iteration,
          phase: 'failed',
          planningComplete: false,
          drafts,
          architectReviews,
          criticReviews,
          latestPlanPath,
          artifacts: aggregatedArtifacts,
          error,
        };
      }

      iteration += 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updateBlueprintState(cwd, {
      active: false,
      iteration,
      current_phase: 'failed',
      completed_at: new Date().toISOString(),
      planning_complete: false,
      latest_plan_path: latestPlanPath,
      review_history: buildReviewHistory(drafts, architectReviews, criticReviews),
      error: message,
    });
    return {
      status: 'failed',
      iteration,
      phase: 'failed',
      planningComplete: false,
      drafts,
      architectReviews,
      criticReviews,
      latestPlanPath,
      artifacts: aggregatedArtifacts,
      error: message,
    };
  }

  const unreachableError = 'blueprint_runtime_unreachable_state';
  await updateBlueprintState(cwd, {
    active: false,
    iteration,
    current_phase: 'failed',
    completed_at: new Date().toISOString(),
    planning_complete: false,
    error: unreachableError,
  });
  return {
    status: 'failed',
    iteration,
    phase: 'failed',
    planningComplete: false,
    drafts,
    architectReviews,
    criticReviews,
    latestPlanPath,
    artifacts: aggregatedArtifacts,
    error: unreachableError,
  };
}

export async function cancelBlueprintConsensus(cwd?: string): Promise<void> {
  await cancelMode('blueprint', cwd);
}
