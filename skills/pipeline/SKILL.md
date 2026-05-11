---
name: pipeline
description: Configurable pipeline orchestrator for sequencing stages
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# Pipeline Skill

`$pipeline` is the configurable pipeline orchestrator for RCS. It sequences stages
through a uniform `PipelineStage` interface, with state persistence and resume support.

## Default Autopilot Pipeline

The canonical RCS pipeline sequences:

```
BLUEPRINT (consensus planning) -> team-exec (Codex CLI workers) -> forge-verify (architect verification)
```

## Configuration

Pipeline parameters are configurable per run:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `maxForgeIterations` | 10 | Forge verification iteration ceiling |
| `workerCount` | 2 | Number of Codex CLI team workers |
| `agentType` | `executor` | Agent type for team workers |

## Stage Interface

Every stage implements the `PipelineStage` interface:

```typescript
interface PipelineStage {
  readonly name: string;
  run(ctx: StageContext): Promise<StageResult>;
  canSkip?(ctx: StageContext): boolean;
}
```

Stages receive a `StageContext` with accumulated artifacts from prior stages and
return a `StageResult` with status, artifacts, and duration.

## Built-in Stages

- **blueprint**: Consensus planning (planner + architect + critic). Skips only when both `prd-*.md` and `test-spec-*.md` planning artifacts already exist, and carries any `deep-interview-*.md` spec paths forward for traceability.
- **team-exec**: Team execution via Codex CLI workers. Always the RCS execution backend.
- **forge-verify**: Forge verification loop with configurable iteration count.

## State Management

Pipeline state persists via the ModeState system at `.rcs/state/pipeline-state.json`.
The HUD renders pipeline phase automatically. Resume is supported from the last incomplete stage.

- **On start**: `state_write({mode: "pipeline", active: true, current_phase: "stage:blueprint"})`
- **On stage transitions**: `state_write({mode: "pipeline", current_phase: "stage:<name>"})`
- **On completion**: `state_write({mode: "pipeline", active: false, current_phase: "complete"})`

## API

```typescript
import {
  runPipeline,
  createAutopilotPipelineConfig,
  createBlueprintStage,
  createTeamExecStage,
  createForgeVerifyStage,
} from './pipeline/index.js';

const config = createAutopilotPipelineConfig('build feature X', {
  stages: [
    createBlueprintStage(),
    createTeamExecStage({ workerCount: 3, agentType: 'executor' }),
    createForgeVerifyStage({ maxIterations: 15 }),
  ],
});

const result = await runPipeline(config);
```

## Relationship to Other Modes

- **autopilot**: Autopilot can use pipeline as its execution engine (v0.8+)
- **team**: Pipeline delegates execution to team mode (Codex CLI workers)
- **forge**: Pipeline delegates verification to forge (configurable iterations)
- **blueprint**: Pipeline's first stage runs consensus planning
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
