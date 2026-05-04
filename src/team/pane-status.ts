import { join } from 'node:path';
import { teamReadTaskApproval as readTaskApproval, teamReadConfig as readTeamConfig } from './team-ops.js';
import type { TeamSnapshot } from './runtime.js';
import type { TeamTask, WorkerInfo, WorkerStatus } from './state.js';

type TeamWorkerCli = Exclude<WorkerInfo['worker_cli'], undefined>;
const DEFAULT_SPARKSHELL_TAIL_LINES = 400;

export async function readTeamPaneStatus(
  config: Awaited<ReturnType<typeof readTeamConfig>>,
  cwd: string = process.cwd(),
  snapshot?: Pick<TeamSnapshot, 'teamName' | 'deadWorkers' | 'nonReportingWorkers' | 'workers' | 'tasks'>,
  tailLines: number = DEFAULT_SPARKSHELL_TAIL_LINES,
): Promise<{
  leader_pane_id: string | null;
  hud_pane_id: string | null;
  worker_panes: Record<string, string>;
  sparkshell_hint: string | null;
  sparkshell_commands: Record<string, string>;
  recommended_inspect_targets: string[];
  recommended_inspect_reasons: Record<string, string>;
  recommended_inspect_clis: Record<string, TeamWorkerCli | null>;
  recommended_inspect_roles: Record<string, string | null>;
  recommended_inspect_indexes: Record<string, number | null>;
  recommended_inspect_alive: Record<string, boolean | null>;
  recommended_inspect_turn_counts: Record<string, number | null>;
  recommended_inspect_turns_without_progress: Record<string, number | null>;
  recommended_inspect_last_turn_at: Record<string, string | null>;
  recommended_inspect_status_updated_at: Record<string, string | null>;
  recommended_inspect_pids: Record<string, number | null>;
  recommended_inspect_worktree_paths: Record<string, string | null>;
  recommended_inspect_worktree_repo_roots: Record<string, string | null>;
  recommended_inspect_worktree_branches: Record<string, string | null>;
  recommended_inspect_worktree_detached: Record<string, boolean | null>;
  recommended_inspect_worktree_created: Record<string, boolean | null>;
  recommended_inspect_team_state_roots: Record<string, string | null>;
  recommended_inspect_workdirs: Record<string, string | null>;
  recommended_inspect_assigned_tasks: Record<string, string[]>;
  recommended_inspect_task_statuses: Record<string, TeamTask['status'] | null>;
  recommended_inspect_task_results: Record<string, string | null>;
  recommended_inspect_task_errors: Record<string, string | null>;
  recommended_inspect_task_versions: Record<string, number | null>;
  recommended_inspect_task_created_at: Record<string, string | null>;
  recommended_inspect_task_completed_at: Record<string, string | null>;
  recommended_inspect_task_depends_on: Record<string, string[]>;
  recommended_inspect_task_claim_present: Record<string, boolean | null>;
  recommended_inspect_task_claim_owners: Record<string, string | null>;
  recommended_inspect_task_claim_tokens: Record<string, string | null>;
  recommended_inspect_task_claim_leases: Record<string, string | null>;
  recommended_inspect_task_claim_lock_paths: Record<string, string | null>;
  recommended_inspect_approval_required: Record<string, boolean | null>;
  recommended_inspect_requires_code_change: Record<string, boolean | null>;
  recommended_inspect_descriptions: Record<string, string | null>;
  recommended_inspect_blocked_by: Record<string, string[]>;
  recommended_inspect_task_roles: Record<string, string | null>;
  recommended_inspect_task_owners: Record<string, string | null>;
  recommended_inspect_approval_statuses: Record<string, string | null>;
  recommended_inspect_approval_reviewers: Record<string, string | null>;
  recommended_inspect_approval_reasons: Record<string, string | null>;
  recommended_inspect_approval_decided_at: Record<string, string | null>;
  recommended_inspect_approval_record_present: Record<string, boolean | null>;
  recommended_inspect_states: Record<string, WorkerStatus['state'] | null>;
  recommended_inspect_state_reasons: Record<string, string | null>;
  recommended_inspect_tasks: Record<string, string | null>;
  recommended_inspect_subjects: Record<string, string | null>;
  recommended_inspect_task_paths: Record<string, string | null>;
  recommended_inspect_approval_paths: Record<string, string | null>;
  recommended_inspect_worker_state_dirs: Record<string, string | null>;
  recommended_inspect_worker_status_paths: Record<string, string | null>;
  recommended_inspect_worker_heartbeat_paths: Record<string, string | null>;
  recommended_inspect_worker_identity_paths: Record<string, string | null>;
  recommended_inspect_worker_inbox_paths: Record<string, string | null>;
  recommended_inspect_worker_mailbox_paths: Record<string, string | null>;
  recommended_inspect_worker_shutdown_request_paths: Record<string, string | null>;
  recommended_inspect_worker_shutdown_ack_paths: Record<string, string | null>;
  recommended_inspect_team_config_paths: Record<string, string | null>;
  recommended_inspect_team_manifest_paths: Record<string, string | null>;
  recommended_inspect_team_events_paths: Record<string, string | null>;
  recommended_inspect_team_dispatch_paths: Record<string, string | null>;
  recommended_inspect_team_dir_paths: Record<string, string | null>;
  recommended_inspect_team_phase_paths: Record<string, string | null>;
  recommended_inspect_team_monitor_snapshot_paths: Record<string, string | null>;
  recommended_inspect_team_summary_snapshot_paths: Record<string, string | null>;
  recommended_inspect_panes: Record<string, string | null>;
  recommended_inspect_command: string | null;
  recommended_inspect_commands: string[];
  recommended_inspect_summary: string | null;
  recommended_inspect_items: Array<{
    target: string;
    pane_id: string;
    worker_cli: TeamWorkerCli | null;
    role: string | null;
    index: number | null;
    alive: boolean | null;
    turn_count: number | null;
    turns_without_progress: number | null;
    last_turn_at: string | null;
    status_updated_at: string | null;
    pid: number | null;
    worktree_repo_root: string | null;
    worktree_path: string | null;
    worktree_branch: string | null;
    worktree_detached: boolean | null;
    worktree_created: boolean | null;
    team_state_root: string | null;
    working_dir: string | null;
    assigned_tasks: string[];
    task_status: TeamTask['status'] | null;
    task_result: string | null;
    task_error: string | null;
    task_version: number | null;
    task_created_at: string | null;
    task_completed_at: string | null;
    task_depends_on: string[];
    task_claim_present: boolean | null;
    task_claim_owner: string | null;
    task_claim_token: string | null;
    task_claim_leased_until: string | null;
    task_claim_lock_path: string | null;
    approval_required: boolean | null;
    requires_code_change: boolean | null;
    task_description: string | null;
    blocked_by: string[];
    task_role: string | null;
    task_owner: string | null;
    approval_status: string | null;
    approval_reviewer: string | null;
    approval_reason: string | null;
    approval_decided_at: string | null;
    approval_record_present: boolean | null;
    reason: string;
    state: WorkerStatus['state'] | null;
    state_reason: string | null;
    task_id: string | null;
    task_subject: string | null;
    task_path: string | null;
    approval_path: string | null;
    worker_state_dir: string | null;
    worker_status_path: string | null;
    worker_heartbeat_path: string | null;
    worker_identity_path: string | null;
    worker_inbox_path: string | null;
    worker_mailbox_path: string | null;
    worker_shutdown_request_path: string | null;
    worker_shutdown_ack_path: string | null;
    team_dir_path: string | null;
    team_config_path: string | null;
    team_manifest_path: string | null;
    team_events_path: string | null;
    team_dispatch_path: string | null;
    team_phase_path: string | null;
    team_monitor_snapshot_path: string | null;
    team_summary_snapshot_path: string | null;
    command: string;
  }>;
}> {
  if (!config) {
    return {
      leader_pane_id: null,
      hud_pane_id: null,
      worker_panes: {},
      sparkshell_hint: null,
      sparkshell_commands: {},
      recommended_inspect_targets: [],
      recommended_inspect_reasons: {},
      recommended_inspect_clis: {},
      recommended_inspect_roles: {},
      recommended_inspect_indexes: {},
      recommended_inspect_alive: {},
      recommended_inspect_turn_counts: {},
      recommended_inspect_turns_without_progress: {},
      recommended_inspect_last_turn_at: {},
      recommended_inspect_status_updated_at: {},
      recommended_inspect_pids: {},
      recommended_inspect_worktree_paths: {},
      recommended_inspect_worktree_repo_roots: {},
      recommended_inspect_worktree_branches: {},
      recommended_inspect_worktree_detached: {},
      recommended_inspect_worktree_created: {},
      recommended_inspect_team_state_roots: {},
      recommended_inspect_workdirs: {},
      recommended_inspect_assigned_tasks: {},
      recommended_inspect_task_statuses: {},
      recommended_inspect_task_results: {},
      recommended_inspect_task_errors: {},
      recommended_inspect_task_versions: {},
      recommended_inspect_task_created_at: {},
      recommended_inspect_task_completed_at: {},
      recommended_inspect_task_depends_on: {},
      recommended_inspect_task_claim_present: {},
      recommended_inspect_task_claim_owners: {},
      recommended_inspect_task_claim_tokens: {},
      recommended_inspect_task_claim_leases: {},
      recommended_inspect_task_claim_lock_paths: {},
      recommended_inspect_approval_required: {},
      recommended_inspect_requires_code_change: {},
      recommended_inspect_descriptions: {},
      recommended_inspect_blocked_by: {},
      recommended_inspect_task_roles: {},
      recommended_inspect_task_owners: {},
      recommended_inspect_approval_statuses: {},
      recommended_inspect_approval_reviewers: {},
      recommended_inspect_approval_reasons: {},
      recommended_inspect_approval_decided_at: {},
      recommended_inspect_approval_record_present: {},
      recommended_inspect_states: {},
      recommended_inspect_state_reasons: {},
      recommended_inspect_tasks: {},
      recommended_inspect_subjects: {},
      recommended_inspect_task_paths: {},
      recommended_inspect_approval_paths: {},
      recommended_inspect_worker_state_dirs: {},
      recommended_inspect_worker_status_paths: {},
      recommended_inspect_worker_heartbeat_paths: {},
      recommended_inspect_worker_identity_paths: {},
      recommended_inspect_worker_inbox_paths: {},
      recommended_inspect_worker_mailbox_paths: {},
      recommended_inspect_worker_shutdown_request_paths: {},
      recommended_inspect_worker_shutdown_ack_paths: {},
      recommended_inspect_team_dir_paths: {},
      recommended_inspect_team_config_paths: {},
      recommended_inspect_team_manifest_paths: {},
      recommended_inspect_team_events_paths: {},
      recommended_inspect_team_dispatch_paths: {},
      recommended_inspect_team_phase_paths: {},
      recommended_inspect_team_monitor_snapshot_paths: {},
      recommended_inspect_team_summary_snapshot_paths: {},
      recommended_inspect_panes: {},
      recommended_inspect_command: null,
      recommended_inspect_commands: [],
      recommended_inspect_summary: null,
      recommended_inspect_items: [],
    };
  }

  const leaderPaneId = config.leader_pane_id?.trim() || null;
  const hudPaneId = config.hud_pane_id?.trim() || null;

  const workerPanes = Object.fromEntries(
    config.workers
      .map((worker) => {
        const paneId = worker.pane_id?.trim();
        return paneId ? [worker.name, paneId] : null;
      })
      .filter((entry): entry is [string, string] => entry !== null),
  );

  const sparkshellCommands = Object.fromEntries(
    [
      leaderPaneId ? ['leader', `rcs sparkshell --tmux-pane ${leaderPaneId} --tail-lines ${tailLines}`] : null,
      hudPaneId ? ['hud', `rcs sparkshell --tmux-pane ${hudPaneId} --tail-lines ${tailLines}`] : null,
      ...Object.entries(workerPanes).map(([workerName, paneId]) => [
        workerName,
        `rcs sparkshell --tmux-pane ${paneId} --tail-lines ${tailLines}`,
      ] as const),
    ].filter((entry): entry is [string, string] => entry !== null),
  );

  const recommendedInspectTargets = [
    ...(snapshot?.deadWorkers ?? []),
    ...(snapshot?.nonReportingWorkers ?? []),
  ].filter((workerName, index, values) => (
    Object.hasOwn(workerPanes, workerName) && values.indexOf(workerName) === index
  ));
  const recommendedInspectReasons = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      (snapshot?.deadWorkers ?? []).includes(target) ? 'dead_worker' : 'non_reporting_worker',
    ]),
  );
  const recommendedInspectClis = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worker_cli ?? null];
    }),
  );
  const recommendedInspectRoles = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.role ?? null];
    }),
  );
  const recommendedInspectIndexes = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.index ?? null];
    }),
  );
  const recommendedInspectAlive = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.alive ?? null];
    }),
  );
  const recommendedInspectTurnCounts = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.heartbeat?.turn_count ?? null];
    }),
  );
  const recommendedInspectTurnsWithoutProgress = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.turnsWithoutProgress ?? null];
    }),
  );
  const recommendedInspectLastTurnAt = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.heartbeat?.last_turn_at ?? null];
    }),
  );
  const recommendedInspectStatusUpdatedAt = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.status.updated_at ?? null];
    }),
  );
  const recommendedInspectPids = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.pid ?? null];
    }),
  );
  const recommendedInspectWorktreePaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worktree_path ?? null];
    }),
  );
  const recommendedInspectWorktreeRepoRoots = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worktree_repo_root ?? null];
    }),
  );
  const recommendedInspectWorktreeBranches = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worktree_branch ?? null];
    }),
  );
  const recommendedInspectWorktreeDetached = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worktree_detached ?? null];
    }),
  );
  const recommendedInspectWorktreeCreated = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.worktree_created ?? null];
    }),
  );
  const recommendedInspectTeamStateRoots = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.team_state_root ?? null];
    }),
  );
  const recommendedInspectWorkdirs = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.working_dir ?? worker?.worktree_path ?? null];
    }),
  );
  const recommendedInspectAssignedTasks = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = config.workers.find((candidate) => candidate.name === target);
      return [target, worker?.assigned_tasks ?? []];
    }),
  );
  const recommendedInspectTasks = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.status.current_task_id ?? null];
    }),
  );
  const taskStatusById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.status] as const));
  const taskResultById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.result ?? null] as const));
  const taskErrorById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.error ?? null] as const));
  const taskVersionById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.version ?? null] as const));
  const taskCreatedAtById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.created_at ?? null] as const));
  const taskCompletedAtById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.completed_at ?? null] as const));
  const taskDependsOnById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.depends_on ?? task.blocked_by ?? []] as const));
  const taskClaimPresentById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.claim != null] as const));
  const taskClaimOwnerById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.claim?.owner ?? null] as const));
  const taskClaimTokenById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.claim?.token ?? null] as const));
  const taskClaimLeaseById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.claim?.leased_until ?? null] as const));
  const taskRequiresCodeChangeById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.requires_code_change ?? null] as const));
  const recommendedInspectTaskStatuses = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskStatusById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskResults = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskResultById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskErrors = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskErrorById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskVersions = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskVersionById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskCreatedAt = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskCreatedAtById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskCompletedAt = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskCompletedAtById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskDependsOn = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskDependsOnById.get(taskId) ?? []) : []];
    }),
  );
  const recommendedInspectTaskClaimPresent = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskClaimPresentById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskClaimOwners = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskClaimOwnerById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskClaimTokens = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskClaimTokenById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskClaimLeases = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskClaimLeaseById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskClaimLockPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId && snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'claims', `task-${taskId}.lock`) : null];
    }),
  );
  const recommendedInspectRequiresCodeChange = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskRequiresCodeChangeById.get(taskId) ?? null) : null];
    }),
  );
  const taskDescriptionById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.description] as const));
  const recommendedInspectDescriptions = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskDescriptionById.get(taskId) ?? null) : null];
    }),
  );
  const taskBlockedById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.blocked_by ?? []] as const));
  const recommendedInspectBlockedBy = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskBlockedById.get(taskId) ?? []) : []];
    }),
  );
  const taskRoleById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.role ?? null] as const));
  const recommendedInspectTaskRoles = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskRoleById.get(taskId) ?? null) : null];
    }),
  );
  const taskOwnerById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.owner ?? null] as const));
  const recommendedInspectTaskOwners = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskOwnerById.get(taskId) ?? null) : null];
    }),
  );
  const approvalRecordByTaskId = new Map<string, Awaited<ReturnType<typeof readTaskApproval>>>();
  for (const taskId of new Set(Object.values(recommendedInspectTasks).filter((value): value is string => typeof value === 'string' && value.length > 0))) {
    approvalRecordByTaskId.set(taskId, snapshot?.teamName ? await readTaskApproval(snapshot.teamName, taskId, cwd) : null);
  }
  const recommendedInspectApprovalStatuses = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (approvalRecordByTaskId.get(taskId)?.status ?? null) : null];
    }),
  );
  const recommendedInspectApprovalRequired = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (approvalRecordByTaskId.get(taskId)?.required ?? null) : null];
    }),
  );
  const recommendedInspectApprovalReviewers = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (approvalRecordByTaskId.get(taskId)?.reviewer ?? null) : null];
    }),
  );
  const recommendedInspectApprovalReasons = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (approvalRecordByTaskId.get(taskId)?.decision_reason ?? null) : null];
    }),
  );
  const recommendedInspectApprovalDecidedAt = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (approvalRecordByTaskId.get(taskId)?.decided_at ?? null) : null];
    }),
  );
  const recommendedInspectApprovalRecordPresent = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? approvalRecordByTaskId.get(taskId) !== null : null];
    }),
  );
  const recommendedInspectPanes = Object.fromEntries(
    recommendedInspectTargets.map((target) => [target, workerPanes[target] ?? null]),
  );
  const taskSubjectById = new Map((snapshot?.tasks.items ?? []).map((task) => [task.id, task.subject] as const));
  const recommendedInspectSubjects = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId ? (taskSubjectById.get(taskId) ?? null) : null];
    }),
  );
  const recommendedInspectTaskPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId && snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'tasks', `task-${taskId}.json`) : null];
    }),
  );
  const recommendedInspectApprovalPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const taskId = recommendedInspectTasks[target];
      return [target, taskId && snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'approvals', `task-${taskId}.json`) : null];
    }),
  );
  const recommendedInspectWorkerStateDirs = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target) : null,
    ]),
  );
  const recommendedInspectWorkerStatusPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'status.json') : null,
    ]),
  );
  const recommendedInspectWorkerHeartbeatPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'heartbeat.json') : null,
    ]),
  );
  const recommendedInspectWorkerIdentityPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'identity.json') : null,
    ]),
  );
  const recommendedInspectWorkerInboxPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'inbox.md') : null,
    ]),
  );
  const recommendedInspectWorkerMailboxPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'mailbox', `${target}.json`) : null,
    ]),
  );
  const recommendedInspectWorkerShutdownRequestPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'shutdown-request.json') : null,
    ]),
  );
  const recommendedInspectWorkerShutdownAckPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'workers', target, 'shutdown-ack.json') : null,
    ]),
  );
  const recommendedInspectTeamConfigPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'config.json') : null,
    ]),
  );
  const recommendedInspectTeamManifestPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'manifest.v2.json') : null,
    ]),
  );
  const recommendedInspectTeamEventsPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'events', 'events.ndjson') : null,
    ]),
  );
  const recommendedInspectTeamDispatchPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'dispatch', 'requests.json') : null,
    ]),
  );
  const recommendedInspectTeamDirPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName) : null,
    ]),
  );
  const recommendedInspectTeamPhasePaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'phase.json') : null,
    ]),
  );
  const recommendedInspectTeamMonitorSnapshotPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'monitor-snapshot.json') : null,
    ]),
  );
  const recommendedInspectTeamSummarySnapshotPaths = Object.fromEntries(
    recommendedInspectTargets.map((target) => [
      target,
      snapshot?.teamName ? join(cwd, '.rcs', 'state', 'team', snapshot.teamName, 'summary-snapshot.json') : null,
    ]),
  );
  const recommendedInspectStates = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.status.state ?? null];
    }),
  );
  const recommendedInspectStateReasons = Object.fromEntries(
    recommendedInspectTargets.map((target) => {
      const worker = snapshot?.workers.find((candidate) => candidate.name === target);
      return [target, worker?.status.reason ?? null];
    }),
  );
  const recommendedInspectCommand = recommendedInspectTargets.length > 0
    ? sparkshellCommands[recommendedInspectTargets[0]!] ?? null
    : null;
  const recommendedInspectCommands = recommendedInspectTargets
    .map((target) => sparkshellCommands[target])
    .filter((command): command is string => typeof command === 'string' && command.length > 0);
  const recommendedInspectSummary = recommendedInspectTargets.length > 0
    ? [
      `target=${recommendedInspectTargets[0]}`,
      recommendedInspectPanes[recommendedInspectTargets[0]!] ? `pane=${recommendedInspectPanes[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectClis[recommendedInspectTargets[0]!] ? `cli=${recommendedInspectClis[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectRoles[recommendedInspectTargets[0]!] ? `role=${recommendedInspectRoles[recommendedInspectTargets[0]!]}` : '',
      typeof recommendedInspectAlive[recommendedInspectTargets[0]!] === 'boolean' ? `alive=${recommendedInspectAlive[recommendedInspectTargets[0]!]}` : '',
      typeof recommendedInspectTurnCounts[recommendedInspectTargets[0]!] === 'number' ? `turn_count=${recommendedInspectTurnCounts[recommendedInspectTargets[0]!]}` : '',
      typeof recommendedInspectTurnsWithoutProgress[recommendedInspectTargets[0]!] === 'number'
        ? `turns_without_progress=${recommendedInspectTurnsWithoutProgress[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectReasons[recommendedInspectTargets[0]!] ? `reason=${recommendedInspectReasons[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectStates[recommendedInspectTargets[0]!] ? `state=${recommendedInspectStates[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectTasks[recommendedInspectTargets[0]!] ? `task=${recommendedInspectTasks[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectSubjects[recommendedInspectTargets[0]!] ? `subject=${recommendedInspectSubjects[recommendedInspectTargets[0]!]}` : '',
      recommendedInspectCommand ? `command=${recommendedInspectCommand}` : '',
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
    : null;
  const recommendedInspectItems = recommendedInspectTargets
    .map((target) => {
      const command = sparkshellCommands[target];
      const paneId = recommendedInspectPanes[target];
      if (!command || !paneId) return null;
      return {
        target,
        pane_id: paneId,
        worker_cli: recommendedInspectClis[target] ?? null,
        role: recommendedInspectRoles[target] ?? null,
        index: recommendedInspectIndexes[target] ?? null,
        alive: recommendedInspectAlive[target] ?? null,
        turn_count: recommendedInspectTurnCounts[target] ?? null,
        turns_without_progress: recommendedInspectTurnsWithoutProgress[target] ?? null,
        last_turn_at: recommendedInspectLastTurnAt[target] ?? null,
        status_updated_at: recommendedInspectStatusUpdatedAt[target] ?? null,
        pid: recommendedInspectPids[target] ?? null,
        worktree_repo_root: recommendedInspectWorktreeRepoRoots[target] ?? null,
        worktree_path: recommendedInspectWorktreePaths[target] ?? null,
        worktree_branch: recommendedInspectWorktreeBranches[target] ?? null,
        worktree_detached: recommendedInspectWorktreeDetached[target] ?? null,
        worktree_created: recommendedInspectWorktreeCreated[target] ?? null,
        team_state_root: recommendedInspectTeamStateRoots[target] ?? null,
        working_dir: recommendedInspectWorkdirs[target] ?? null,
        assigned_tasks: recommendedInspectAssignedTasks[target] ?? [],
        task_status: recommendedInspectTaskStatuses[target] ?? null,
        task_result: recommendedInspectTaskResults[target] ?? null,
        task_error: recommendedInspectTaskErrors[target] ?? null,
        task_version: recommendedInspectTaskVersions[target] ?? null,
        task_created_at: recommendedInspectTaskCreatedAt[target] ?? null,
        task_completed_at: recommendedInspectTaskCompletedAt[target] ?? null,
        task_depends_on: recommendedInspectTaskDependsOn[target] ?? [],
        task_claim_present: recommendedInspectTaskClaimPresent[target] ?? null,
        task_claim_owner: recommendedInspectTaskClaimOwners[target] ?? null,
        task_claim_token: recommendedInspectTaskClaimTokens[target] ?? null,
        task_claim_leased_until: recommendedInspectTaskClaimLeases[target] ?? null,
        task_claim_lock_path: recommendedInspectTaskClaimLockPaths[target] ?? null,
        approval_required: recommendedInspectApprovalRequired[target] ?? null,
        requires_code_change: recommendedInspectRequiresCodeChange[target] ?? null,
        task_description: recommendedInspectDescriptions[target] ?? null,
        blocked_by: recommendedInspectBlockedBy[target] ?? [],
        task_role: recommendedInspectTaskRoles[target] ?? null,
        task_owner: recommendedInspectTaskOwners[target] ?? null,
        approval_status: recommendedInspectApprovalStatuses[target] ?? null,
        approval_reviewer: recommendedInspectApprovalReviewers[target] ?? null,
        approval_reason: recommendedInspectApprovalReasons[target] ?? null,
        approval_decided_at: recommendedInspectApprovalDecidedAt[target] ?? null,
        approval_record_present: recommendedInspectApprovalRecordPresent[target] ?? null,
        reason: recommendedInspectReasons[target] ?? 'unknown',
        state: recommendedInspectStates[target] ?? null,
        state_reason: recommendedInspectStateReasons[target] ?? null,
        task_id: recommendedInspectTasks[target] ?? null,
        task_subject: recommendedInspectSubjects[target] ?? null,
        task_path: recommendedInspectTaskPaths[target] ?? null,
        approval_path: recommendedInspectApprovalPaths[target] ?? null,
        worker_state_dir: recommendedInspectWorkerStateDirs[target] ?? null,
        worker_status_path: recommendedInspectWorkerStatusPaths[target] ?? null,
        worker_heartbeat_path: recommendedInspectWorkerHeartbeatPaths[target] ?? null,
        worker_identity_path: recommendedInspectWorkerIdentityPaths[target] ?? null,
        worker_inbox_path: recommendedInspectWorkerInboxPaths[target] ?? null,
        worker_mailbox_path: recommendedInspectWorkerMailboxPaths[target] ?? null,
        worker_shutdown_request_path: recommendedInspectWorkerShutdownRequestPaths[target] ?? null,
        worker_shutdown_ack_path: recommendedInspectWorkerShutdownAckPaths[target] ?? null,
        team_dir_path: recommendedInspectTeamDirPaths[target] ?? null,
        team_config_path: recommendedInspectTeamConfigPaths[target] ?? null,
        team_manifest_path: recommendedInspectTeamManifestPaths[target] ?? null,
        team_events_path: recommendedInspectTeamEventsPaths[target] ?? null,
        team_dispatch_path: recommendedInspectTeamDispatchPaths[target] ?? null,
        team_phase_path: recommendedInspectTeamPhasePaths[target] ?? null,
        team_monitor_snapshot_path: recommendedInspectTeamMonitorSnapshotPaths[target] ?? null,
        team_summary_snapshot_path: recommendedInspectTeamSummarySnapshotPaths[target] ?? null,
        command,
      };
    })
    .filter((item): item is Exclude<typeof item, null> => item !== null);

  return {
    leader_pane_id: leaderPaneId,
    hud_pane_id: hudPaneId,
    worker_panes: workerPanes,
    sparkshell_hint: Object.keys(workerPanes).length > 0
      ? 'rcs sparkshell --tmux-pane <pane-id> --tail-lines 400'
      : null,
    sparkshell_commands: sparkshellCommands,
    recommended_inspect_targets: recommendedInspectTargets,
    recommended_inspect_reasons: recommendedInspectReasons,
    recommended_inspect_clis: recommendedInspectClis,
    recommended_inspect_roles: recommendedInspectRoles,
    recommended_inspect_indexes: recommendedInspectIndexes,
    recommended_inspect_alive: recommendedInspectAlive,
    recommended_inspect_turn_counts: recommendedInspectTurnCounts,
    recommended_inspect_turns_without_progress: recommendedInspectTurnsWithoutProgress,
    recommended_inspect_last_turn_at: recommendedInspectLastTurnAt,
    recommended_inspect_status_updated_at: recommendedInspectStatusUpdatedAt,
    recommended_inspect_pids: recommendedInspectPids,
    recommended_inspect_worktree_paths: recommendedInspectWorktreePaths,
    recommended_inspect_worktree_repo_roots: recommendedInspectWorktreeRepoRoots,
    recommended_inspect_worktree_branches: recommendedInspectWorktreeBranches,
    recommended_inspect_worktree_detached: recommendedInspectWorktreeDetached,
    recommended_inspect_worktree_created: recommendedInspectWorktreeCreated,
    recommended_inspect_team_state_roots: recommendedInspectTeamStateRoots,
    recommended_inspect_workdirs: recommendedInspectWorkdirs,
    recommended_inspect_assigned_tasks: recommendedInspectAssignedTasks,
    recommended_inspect_task_statuses: recommendedInspectTaskStatuses,
    recommended_inspect_task_results: recommendedInspectTaskResults,
    recommended_inspect_task_errors: recommendedInspectTaskErrors,
    recommended_inspect_task_versions: recommendedInspectTaskVersions,
    recommended_inspect_task_created_at: recommendedInspectTaskCreatedAt,
    recommended_inspect_task_completed_at: recommendedInspectTaskCompletedAt,
    recommended_inspect_task_depends_on: recommendedInspectTaskDependsOn,
    recommended_inspect_task_claim_present: recommendedInspectTaskClaimPresent,
    recommended_inspect_task_claim_owners: recommendedInspectTaskClaimOwners,
    recommended_inspect_task_claim_tokens: recommendedInspectTaskClaimTokens,
    recommended_inspect_task_claim_leases: recommendedInspectTaskClaimLeases,
    recommended_inspect_task_claim_lock_paths: recommendedInspectTaskClaimLockPaths,
    recommended_inspect_approval_required: recommendedInspectApprovalRequired,
    recommended_inspect_requires_code_change: recommendedInspectRequiresCodeChange,
    recommended_inspect_descriptions: recommendedInspectDescriptions,
    recommended_inspect_blocked_by: recommendedInspectBlockedBy,
    recommended_inspect_task_roles: recommendedInspectTaskRoles,
    recommended_inspect_task_owners: recommendedInspectTaskOwners,
    recommended_inspect_approval_statuses: recommendedInspectApprovalStatuses,
    recommended_inspect_approval_reviewers: recommendedInspectApprovalReviewers,
    recommended_inspect_approval_reasons: recommendedInspectApprovalReasons,
    recommended_inspect_approval_decided_at: recommendedInspectApprovalDecidedAt,
    recommended_inspect_approval_record_present: recommendedInspectApprovalRecordPresent,
    recommended_inspect_states: recommendedInspectStates,
    recommended_inspect_state_reasons: recommendedInspectStateReasons,
    recommended_inspect_tasks: recommendedInspectTasks,
    recommended_inspect_subjects: recommendedInspectSubjects,
    recommended_inspect_task_paths: recommendedInspectTaskPaths,
    recommended_inspect_approval_paths: recommendedInspectApprovalPaths,
    recommended_inspect_worker_state_dirs: recommendedInspectWorkerStateDirs,
    recommended_inspect_worker_status_paths: recommendedInspectWorkerStatusPaths,
    recommended_inspect_worker_heartbeat_paths: recommendedInspectWorkerHeartbeatPaths,
    recommended_inspect_worker_identity_paths: recommendedInspectWorkerIdentityPaths,
    recommended_inspect_worker_inbox_paths: recommendedInspectWorkerInboxPaths,
    recommended_inspect_worker_mailbox_paths: recommendedInspectWorkerMailboxPaths,
    recommended_inspect_worker_shutdown_request_paths: recommendedInspectWorkerShutdownRequestPaths,
    recommended_inspect_worker_shutdown_ack_paths: recommendedInspectWorkerShutdownAckPaths,
    recommended_inspect_team_dir_paths: recommendedInspectTeamDirPaths,
    recommended_inspect_team_config_paths: recommendedInspectTeamConfigPaths,
    recommended_inspect_team_manifest_paths: recommendedInspectTeamManifestPaths,
    recommended_inspect_team_events_paths: recommendedInspectTeamEventsPaths,
    recommended_inspect_team_dispatch_paths: recommendedInspectTeamDispatchPaths,
    recommended_inspect_team_phase_paths: recommendedInspectTeamPhasePaths,
    recommended_inspect_team_monitor_snapshot_paths: recommendedInspectTeamMonitorSnapshotPaths,
    recommended_inspect_team_summary_snapshot_paths: recommendedInspectTeamSummarySnapshotPaths,
    recommended_inspect_panes: recommendedInspectPanes,
    recommended_inspect_command: recommendedInspectCommand,
    recommended_inspect_commands: recommendedInspectCommands,
    recommended_inspect_summary: recommendedInspectSummary,
    recommended_inspect_items: recommendedInspectItems,
  };
}
