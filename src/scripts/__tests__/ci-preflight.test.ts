import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CI_PREFLIGHT_STAGES,
  resolveCiPreflightStages,
  type CiPreflightStage,
} from '../ci-preflight.js';

describe('ci-preflight', () => {
  it('defines the expected strict local CI stage inventory', () => {
    const ids = new Set(CI_PREFLIGHT_STAGES.map((stage) => stage.id));
    for (const id of [
      'rustfmt',
      'clippy',
      'lint',
      'tsc-noemit',
      'check-no-unused',
      'build',
      'sync-release-notes-check',
      'verify-native-agents',
      'verify-plugin-bundle',
      'team-state-runtime',
      'hooks-notify-platform',
      'cli-core-rest',
      'catalog-check',
      'smoke-cross-rebase',
      'smoke-remaining',
      'coverage-team-critical',
      'coverage-ts-full',
    ]) {
      assert.ok(ids.has(id), `missing stage ${id}`);
    }
  });

  it('supports a quick mode that keeps the highest-signal local gate without the full coverage sweep', () => {
    const quick = resolveCiPreflightStages({ mode: 'quick', only: null });
    const ids = quick.map((stage) => stage.id);

    assert.deepEqual(ids, [
      'lint',
      'tsc-noemit',
      'check-no-unused',
      'build',
      'sync-release-notes-check',
      'verify-native-agents',
      'verify-plugin-bundle',
      'team-state-runtime',
    ]);
  });

  it('can select specific stages by id', () => {
    const selected = resolveCiPreflightStages({
      mode: 'full',
      only: ['build', 'catalog-check'],
    }).map((stage) => stage.id);

    assert.deepEqual(selected, ['build', 'catalog-check']);
  });

  it('rejects unknown stage ids', () => {
    assert.throws(
      () => resolveCiPreflightStages({ mode: 'full', only: ['does-not-exist'] }),
      /ci_preflight_unknown_stage/,
    );
  });

  it('keeps all stage commands explicit and shell-free', () => {
    for (const stage of CI_PREFLIGHT_STAGES) {
      assert.notEqual(stage.command.trim(), '');
      assert.ok(stage.args.length > 0, `stage ${stage.id} should have explicit args`);
      assert.ok(stage.args.every((arg) => typeof arg === 'string' && arg.length > 0));
    }
  });
});
