import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const blueprintSkill = readFileSync(
  join(__dirname, '../../../skills/blueprint/SKILL.md'),
  'utf-8',
);
const teamSkill = readFileSync(
  join(__dirname, '../../../skills/team/SKILL.md'),
  'utf-8',
);
const autopilotSkill = readFileSync(
  join(__dirname, '../../../skills/autopilot/SKILL.md'),
  'utf-8',
);
const forgeSkill = readFileSync(
  join(__dirname, '../../../skills/forge/SKILL.md'),
  'utf-8',
);

describe('pre-context gate guidance in planning/execution-heavy skills', () => {
  it('blueprint documents required context snapshot intake', () => {
    assert.match(blueprintSkill, /Pre-context Intake/i);
    assert.match(blueprintSkill, /\.rcs\/context\/\{slug\}-\{timestamp\}\.md/);
    assert.match(blueprintSkill, /\$deep-interview\s+--quick/i);
  });

  it('team documents required context snapshot gate before launch', () => {
    assert.match(teamSkill, /Pre-context Intake Gate/i);
    assert.match(teamSkill, /\.rcs\/context\/\{slug\}-\{timestamp\}\.md/);
    assert.match(teamSkill, /\$deep-interview\s+--quick/i);
    assert.match(teamSkill, /initialize\/sync it from canonical team runtime state before proceeding/i);
  });

  it('autopilot documents required pre-context intake before expansion', () => {
    assert.match(autopilotSkill, /Pre-context Intake/i);
    assert.match(autopilotSkill, /\.rcs\/context\/\{slug\}-\{timestamp\}\.md/);
    assert.match(autopilotSkill, /run `explore` first/i);
    assert.match(autopilotSkill, /\$deep-interview\s+--quick/i);
  });

  it('forge documents required pre-context intake before execution loop', () => {
    assert.match(forgeSkill, /Pre-context intake/i);
    assert.match(forgeSkill, /\.rcs\/context\/\{task-slug\}-\{timestamp\}\.md/);
    assert.match(forgeSkill, /\$deep-interview\s+--quick/i);
  });

  it('forge documents state CLI retry guidance when the MCP channel is unavailable', () => {
    assert.match(forgeSkill, /do \*\*not\*\* retry the same MCP call/i);
    assert.match(forgeSkill, /rcs state write --input '<json>' --json/i);
    assert.match(forgeSkill, /preserving `workingDirectory` and `session_id`/i);
  });
});
