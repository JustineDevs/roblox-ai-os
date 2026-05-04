#!/usr/bin/env node

const [provider = '', ...rest] = process.argv.slice(2);
const prompt = rest.join(' ');

const stdout = process.env.RCS_ASK_STUB_STDOUT ?? `OUT:${provider}:${prompt}\n`;
const stderr = process.env.RCS_ASK_STUB_STDERR ?? '';
const exitCode = Number.parseInt(process.env.RCS_ASK_STUB_EXIT_CODE ?? '0', 10);

if (stdout.length > 0) process.stdout.write(stdout);
if (stderr.length > 0) process.stderr.write(stderr);
process.exit(Number.isFinite(exitCode) ? exitCode : 0);
