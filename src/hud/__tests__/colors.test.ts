import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  RESET,
  green,
  yellow,
  cyan,
  dim,
  bold,
  getForgeColor,
} from '../colors.js';

const GREEN = '\x1b[32m';
const YELLOW_CODE = '\x1b[33m';
const RED_CODE = '\x1b[31m';
const CYAN_CODE = '\x1b[36m';
const DIM_CODE = '\x1b[2m';
const BOLD_CODE = '\x1b[1m';

describe('RESET', () => {
  it('is the ANSI reset escape code', () => {
    assert.equal(RESET, '\x1b[0m');
  });
});

describe('green', () => {
  it('wraps text with green ANSI codes', () => {
    assert.equal(green('hello'), `${GREEN}hello${RESET}`);
  });

  it('handles empty string', () => {
    assert.equal(green(''), `${GREEN}${RESET}`);
  });

  it('starts with GREEN and ends with RESET', () => {
    const result = green('test');
    assert.ok(result.startsWith(GREEN));
    assert.ok(result.endsWith(RESET));
  });
});

describe('yellow', () => {
  it('wraps text with yellow ANSI codes', () => {
    assert.equal(yellow('warning'), `${YELLOW_CODE}warning${RESET}`);
  });

  it('handles empty string', () => {
    assert.equal(yellow(''), `${YELLOW_CODE}${RESET}`);
  });
});

describe('cyan', () => {
  it('wraps text with cyan ANSI codes', () => {
    assert.equal(cyan('info'), `${CYAN_CODE}info${RESET}`);
  });

  it('handles empty string', () => {
    assert.equal(cyan(''), `${CYAN_CODE}${RESET}`);
  });
});

describe('dim', () => {
  it('wraps text with dim ANSI codes', () => {
    assert.equal(dim('muted'), `${DIM_CODE}muted${RESET}`);
  });

  it('handles empty string', () => {
    assert.equal(dim(''), `${DIM_CODE}${RESET}`);
  });
});

describe('bold', () => {
  it('wraps text with bold ANSI codes', () => {
    assert.equal(bold('important'), `${BOLD_CODE}important${RESET}`);
  });

  it('handles empty string', () => {
    assert.equal(bold(''), `${BOLD_CODE}${RESET}`);
  });
});

describe('getForgeColor', () => {
  // With maxIterations=10: warningThreshold=7, criticalThreshold=9

  it('returns GREEN for low iterations', () => {
    assert.equal(getForgeColor(0, 10), GREEN);
    assert.equal(getForgeColor(6, 10), GREEN);
  });

  it('returns YELLOW at and above warning threshold', () => {
    // floor(10 * 0.7) = 7
    assert.equal(getForgeColor(7, 10), YELLOW_CODE);
    assert.equal(getForgeColor(8, 10), YELLOW_CODE);
  });

  it('returns RED at and above critical threshold', () => {
    // floor(10 * 0.9) = 9
    assert.equal(getForgeColor(9, 10), RED_CODE);
    assert.equal(getForgeColor(10, 10), RED_CODE);
  });

  it('handles the exact warning boundary', () => {
    // maxIterations=100: warning=70, critical=90
    assert.equal(getForgeColor(69, 100), GREEN);
    assert.equal(getForgeColor(70, 100), YELLOW_CODE);
  });

  it('handles the exact critical boundary', () => {
    assert.equal(getForgeColor(89, 100), YELLOW_CODE);
    assert.equal(getForgeColor(90, 100), RED_CODE);
  });

  it('handles floor rounding in thresholds', () => {
    // maxIterations=7: warning=floor(4.9)=4, critical=floor(6.3)=6
    assert.equal(getForgeColor(3, 7), GREEN);
    assert.equal(getForgeColor(4, 7), YELLOW_CODE);
    assert.equal(getForgeColor(6, 7), RED_CODE);
  });
});
