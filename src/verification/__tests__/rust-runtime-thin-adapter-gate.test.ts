import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('rust runtime thin-adapter gate artifacts', () => {
  it('requires a contract doc that describes the compatibility lane', () => {
    const root = process.cwd();
    const contractPath = join(root, 'docs', 'contracts', 'rust-runtime-thin-adapter-contract.md');
    assert.equal(existsSync(contractPath), true, `missing required artifact: ${contractPath}`);

    const contract = readFileSync(contractPath, 'utf-8');
    assert.match(contract, /Rust core is the single semantic owner/);
    assert.match(contract, /Compatibility artifacts/);
    assert.match(contract, /rcs team status/);
    assert.match(contract, /rcs doctor --team/);
    assert.match(contract, /HUD readers/);
  });

  it('requires a gate doc that maps the pre-mortem scenarios to release gates', () => {
    const root = process.cwd();
    const gatePath = join(root, 'docs', 'qa', 'rust-runtime-thin-adapter-gate.md');
    assert.equal(existsSync(gatePath), true, `missing required artifact: ${gatePath}`);

    const gate = readFileSync(gatePath, 'utf-8');
    for (const id of ['G1', 'G2', 'G3', 'G4', 'G5']) {
      assert.match(gate, new RegExp(`\\|\\s*${id}\\s*\\|`));
    }
    assert.match(gate, /Semantic leakage survives into legacy readers/);
    assert.match(gate, /Watcher send-keys parity breaks/);
    assert.match(gate, /Mux contract stays tmux-shaped/);
    assert.match(gate, /src\/compat\/__tests__\/rust-runtime-compat\.test\.ts/);
    assert.match(gate, /src\/hooks\/__tests__\/notify-hook-team-dispatch\.test\.ts/);
  });
});
