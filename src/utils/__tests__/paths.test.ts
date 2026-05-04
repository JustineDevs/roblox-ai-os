import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { join } from "path";
import { homedir, tmpdir } from "os";
import { existsSync } from "fs";
import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from "fs/promises";
import {
  codexHome,
  codexConfigPath,
  codexPromptsDir,
  userSkillsDir,
  projectSkillsDir,
  legacyUserSkillsDir,
  listInstalledSkillDirectories,
  detectLegacySkillRootOverlap,
  rcsStateDir,
  rcsProjectMemoryPath,
  rcsNotepadPath,
  rcsPlansDir,
  rcsAdaptersDir,
  rcsLogsDir,
  packageRoot,
  canonicalizeComparablePath,
  RCS_ENTRY_PATH_ENV,
  RCS_STARTUP_CWD_ENV,
  rememberRcsLaunchContext,
  resolveRcsCliEntryPath,
  resolveRcsEntryPath,
} from "../paths.js";

describe("codexHome", () => {
  let originalCodexHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalCodexHome = process.env.CODEX_HOME;
    originalUserProfile = process.env.USERPROFILE;
  });

  afterEach(() => {
    if (typeof originalCodexHome === "string") {
      process.env.CODEX_HOME = originalCodexHome;
    } else {
      delete process.env.CODEX_HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("returns CODEX_HOME env var when set", () => {
    process.env.CODEX_HOME = "/tmp/custom-codex";
    assert.equal(codexHome(), "/tmp/custom-codex");
  });

  it("defaults to ~/.codex when CODEX_HOME is not set", () => {
    delete process.env.CODEX_HOME;
    assert.equal(codexHome(), join(homedir(), ".codex"));
  });
});

describe("codexConfigPath", () => {
  let originalCodexHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalCodexHome = process.env.CODEX_HOME;
    originalUserProfile = process.env.USERPROFILE;
    process.env.CODEX_HOME = "/tmp/test-codex";
  });

  afterEach(() => {
    if (typeof originalCodexHome === "string") {
      process.env.CODEX_HOME = originalCodexHome;
    } else {
      delete process.env.CODEX_HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("returns config.toml under codex home", () => {
    assert.equal(codexConfigPath(), join("/tmp/test-codex", "config.toml"));
  });
});

describe("codexPromptsDir", () => {
  let originalCodexHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalCodexHome = process.env.CODEX_HOME;
    originalUserProfile = process.env.USERPROFILE;
    process.env.CODEX_HOME = "/tmp/test-codex";
  });

  afterEach(() => {
    if (typeof originalCodexHome === "string") {
      process.env.CODEX_HOME = originalCodexHome;
    } else {
      delete process.env.CODEX_HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("returns prompts/ under codex home", () => {
    assert.equal(codexPromptsDir(), join("/tmp/test-codex", "prompts"));
  });
});

describe("userSkillsDir", () => {
  let originalCodexHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalCodexHome = process.env.CODEX_HOME;
    originalUserProfile = process.env.USERPROFILE;
    process.env.CODEX_HOME = "/tmp/test-codex";
  });

  afterEach(() => {
    if (typeof originalCodexHome === "string") {
      process.env.CODEX_HOME = originalCodexHome;
    } else {
      delete process.env.CODEX_HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("returns CODEX_HOME/skills", () => {
    assert.equal(userSkillsDir(), join("/tmp/test-codex", "skills"));
  });
});

describe("projectSkillsDir", () => {
  it("uses provided projectRoot", () => {
    assert.equal(projectSkillsDir("/my/project"), join("/my/project", ".codex", "skills"));
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(projectSkillsDir(), join(process.cwd(), ".codex", "skills"));
  });
});

describe("legacyUserSkillsDir", () => {
  let originalHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalHome = process.env.HOME;
    originalUserProfile = process.env.USERPROFILE;
    process.env.HOME = "/tmp/test-home";
    process.env.USERPROFILE = "/tmp/test-home";
  });

  afterEach(() => {
    if (typeof originalHome === "string") {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("returns ~/.agents/skills under HOME", () => {
    assert.equal(legacyUserSkillsDir(), join("/tmp/test-home", ".agents", "skills"));
  });
});

describe("rcsAdaptersDir", () => {
  it("returns .rcs/adapters under the project root", () => {
    assert.equal(rcsAdaptersDir("/my/project"), join("/my/project", ".rcs", "adapters"));
  });
});

describe("listInstalledSkillDirectories", () => {
  let originalCodexHome: string | undefined;
  let originalHome: string | undefined;
  let originalUserProfile: string | undefined;

  beforeEach(() => {
    originalCodexHome = process.env.CODEX_HOME;
    originalHome = process.env.HOME;
    originalUserProfile = process.env.USERPROFILE;
  });

  afterEach(() => {
    if (typeof originalCodexHome === "string") {
      process.env.CODEX_HOME = originalCodexHome;
    } else {
      delete process.env.CODEX_HOME;
    }

    if (typeof originalHome === "string") {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }

    if (typeof originalUserProfile === "string") {
      process.env.USERPROFILE = originalUserProfile;
    } else {
      delete process.env.USERPROFILE;
    }
  });

  it("deduplicates by skill name and prefers project skills over user skills", async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), "rcs-paths-project-"));
    const codexHomeRoot = await mkdtemp(join(tmpdir(), "rcs-paths-codex-"));
    process.env.CODEX_HOME = codexHomeRoot;

    try {
      const projectHelpDir = join(projectRoot, ".codex", "skills", "help");
      const projectOnlyDir = join(
        projectRoot,
        ".codex",
        "skills",
        "project-only",
      );
      const userHelpDir = join(codexHomeRoot, "skills", "help");
      const userOnlyDir = join(codexHomeRoot, "skills", "user-only");

      await mkdir(projectHelpDir, { recursive: true });
      await mkdir(projectOnlyDir, { recursive: true });
      await mkdir(userHelpDir, { recursive: true });
      await mkdir(userOnlyDir, { recursive: true });

      await writeFile(join(projectHelpDir, "SKILL.md"), "# project help\n");
      await writeFile(join(projectOnlyDir, "SKILL.md"), "# project only\n");
      await writeFile(join(userHelpDir, "SKILL.md"), "# user help\n");
      await writeFile(join(userOnlyDir, "SKILL.md"), "# user only\n");

      const skills = await listInstalledSkillDirectories(projectRoot);

      assert.deepEqual(
        skills.map((skill) => ({
          name: skill.name,
          scope: skill.scope,
        })),
        [
          { name: "help", scope: "project" },
          { name: "project-only", scope: "project" },
          { name: "user-only", scope: "user" },
        ],
      );
      assert.equal(skills[0]?.path, projectHelpDir);
    } finally {
      await rm(projectRoot, { recursive: true, force: true });
      await rm(codexHomeRoot, { recursive: true, force: true });
    }
  });
  it("detects overlapping legacy and canonical user skill roots including content mismatches", async () => {
    const homeRoot = await mkdtemp(join(tmpdir(), "rcs-paths-home-"));
    const codexHomeRoot = join(homeRoot, ".codex");
    const legacyRoot = join(homeRoot, ".agents", "skills");
    process.env.HOME = homeRoot;
    process.env.USERPROFILE = homeRoot;
    process.env.CODEX_HOME = codexHomeRoot;

    try {
      const canonicalHelpDir = join(codexHomeRoot, "skills", "help");
      const canonicalPlanDir = join(codexHomeRoot, "skills", "plan");
      const legacyHelpDir = join(legacyRoot, "help");
      const legacyOnlyDir = join(legacyRoot, "legacy-only");

      await mkdir(canonicalHelpDir, { recursive: true });
      await mkdir(canonicalPlanDir, { recursive: true });
      await mkdir(legacyHelpDir, { recursive: true });
      await mkdir(legacyOnlyDir, { recursive: true });

      await writeFile(join(canonicalHelpDir, "SKILL.md"), "# canonical help\n");
      await writeFile(join(canonicalPlanDir, "SKILL.md"), "# canonical plan\n");
      await writeFile(join(legacyHelpDir, "SKILL.md"), "# legacy help\n");
      await writeFile(join(legacyOnlyDir, "SKILL.md"), "# legacy only\n");

      const overlap = await detectLegacySkillRootOverlap();

      assert.equal(overlap.canonicalExists, true);
      assert.equal(overlap.legacyExists, true);
      assert.equal(overlap.canonicalSkillCount, 2);
      assert.equal(overlap.legacySkillCount, 2);
      assert.deepEqual(overlap.overlappingSkillNames, ["help"]);
      assert.deepEqual(overlap.mismatchedSkillNames, ["help"]);
      assert.equal(overlap.sameResolvedTarget, false);
    } finally {
      await rm(homeRoot, { recursive: true, force: true });
    }
  });

  it("treats a legacy link to canonical skills as the same resolved target", async () => {
    const homeRoot = await mkdtemp(join(tmpdir(), "rcs-paths-linked-home-"));
    const codexHomeRoot = join(homeRoot, ".codex");
    const canonicalSkillsRoot = join(codexHomeRoot, "skills");
    const legacyParent = join(homeRoot, ".agents");
    const legacyRoot = join(legacyParent, "skills");
    process.env.HOME = homeRoot;
    process.env.USERPROFILE = homeRoot;
    process.env.CODEX_HOME = codexHomeRoot;

    try {
      const canonicalHelpDir = join(canonicalSkillsRoot, "help");
      await mkdir(canonicalHelpDir, { recursive: true });
      await mkdir(legacyParent, { recursive: true });
      await writeFile(join(canonicalHelpDir, "SKILL.md"), "# canonical help\n");
      await symlink(
        canonicalSkillsRoot,
        legacyRoot,
        process.platform === "win32" ? "junction" : "dir",
      );

      const overlap = await detectLegacySkillRootOverlap();

      assert.equal(overlap.canonicalExists, true);
      assert.equal(overlap.legacyExists, true);
      assert.equal(overlap.canonicalSkillCount, 1);
      assert.equal(overlap.legacySkillCount, 1);
      assert.equal(overlap.sameResolvedTarget, true);
      assert.deepEqual(overlap.overlappingSkillNames, ["help"]);
      assert.deepEqual(overlap.mismatchedSkillNames, []);
    } finally {
      await rm(homeRoot, { recursive: true, force: true });
    }
  });
});

describe("rcsStateDir", () => {
  it("uses provided projectRoot", () => {
    assert.equal(rcsStateDir("/my/project"), join("/my/project", ".rcs", "state"));
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(rcsStateDir(), join(process.cwd(), ".rcs", "state"));
  });
});

describe("rcsProjectMemoryPath", () => {
  it("uses provided projectRoot", () => {
    assert.equal(
      rcsProjectMemoryPath("/my/project"),
      join("/my/project", ".rcs", "project-memory.json"),
    );
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(
      rcsProjectMemoryPath(),
      join(process.cwd(), ".rcs", "project-memory.json"),
    );
  });
});

describe("rcsNotepadPath", () => {
  it("uses provided projectRoot", () => {
    assert.equal(rcsNotepadPath("/my/project"), join("/my/project", ".rcs", "notepad.md"));
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(rcsNotepadPath(), join(process.cwd(), ".rcs", "notepad.md"));
  });
});

describe("rcsPlansDir", () => {
  it("uses provided projectRoot", () => {
    assert.equal(rcsPlansDir("/my/project"), join("/my/project", ".rcs", "plans"));
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(rcsPlansDir(), join(process.cwd(), ".rcs", "plans"));
  });
});

describe("rcsLogsDir", () => {
  it("uses provided projectRoot", () => {
    assert.equal(rcsLogsDir("/my/project"), join("/my/project", ".rcs", "logs"));
  });

  it("defaults to cwd when no projectRoot given", () => {
    assert.equal(rcsLogsDir(), join(process.cwd(), ".rcs", "logs"));
  });
});

describe("packageRoot", () => {
  it("resolves to a directory containing package.json", () => {
    const root = packageRoot();
    assert.equal(existsSync(join(root, "package.json")), true);
  });
});

describe("RCS launcher path resolution", () => {
  // Existing launcher files are resolved through realpath before being stored or
  // compared. These assertions intentionally use canonicalized expected paths
  // so macOS /var -> /private/var temp roots and symlinked launch directories
  // exercise the same canonical-realpath contract as production launch context.
  const originalEntryPath = process.env[RCS_ENTRY_PATH_ENV];
  const originalStartupCwd = process.env[RCS_STARTUP_CWD_ENV];

  afterEach(() => {
    if (typeof originalEntryPath === "string") {
      process.env[RCS_ENTRY_PATH_ENV] = originalEntryPath;
    } else {
      delete process.env[RCS_ENTRY_PATH_ENV];
    }
    if (typeof originalStartupCwd === "string") {
      process.env[RCS_STARTUP_CWD_ENV] = originalStartupCwd;
    } else {
      delete process.env[RCS_STARTUP_CWD_ENV];
    }
  });

  it("resolves relative launcher paths against the recorded startup cwd", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-start-"));
    const laterCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-later-"));
    try {
      const launcherDir = join(startupCwd, "dist", "cli");
      const launcherPath = join(launcherDir, "rcs.js");
      await mkdir(launcherDir, { recursive: true });
      await writeFile(launcherPath, "#!/usr/bin/env node\n", "utf-8");

      const resolved = resolveRcsEntryPath({
        argv1: "dist/cli/rcs.js",
        cwd: laterCwd,
        env: {
          ...process.env,
          [RCS_STARTUP_CWD_ENV]: startupCwd,
        },
      });

      assert.equal(resolved, canonicalizeComparablePath(launcherPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
      await rm(laterCwd, { recursive: true, force: true });
    }
  });

  it("canonicalizes symlinked startup cwd launcher paths to their real path", async () => {
    const realRoot = await mkdtemp(join(tmpdir(), "rcs-launcher-real-root-"));
    const linkParent = await mkdtemp(join(tmpdir(), "rcs-launcher-link-root-"));
    const laterCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-symlink-later-"));
    const realStartupCwd = join(realRoot, "project");
    const linkedStartupCwd = join(linkParent, "project-link");
    try {
      const launcherDir = join(realStartupCwd, "dist", "cli");
      const launcherPath = join(launcherDir, "rcs.js");
      await mkdir(launcherDir, { recursive: true });
      await writeFile(launcherPath, "#!/usr/bin/env node\n", "utf-8");
      await symlink(
        realStartupCwd,
        linkedStartupCwd,
        process.platform === "win32" ? "junction" : "dir",
      );

      const resolved = resolveRcsEntryPath({
        argv1: "dist/cli/rcs.js",
        cwd: laterCwd,
        env: {
          ...process.env,
          [RCS_STARTUP_CWD_ENV]: linkedStartupCwd,
        },
      });

      assert.equal(resolved, await realpath(launcherPath));
      assert.notEqual(resolved, join(linkedStartupCwd, "dist", "cli", "rcs.js"));
    } finally {
      await rm(realRoot, { recursive: true, force: true });
      await rm(linkParent, { recursive: true, force: true });
      await rm(laterCwd, { recursive: true, force: true });
    }
  });

  it("records launcher context once so later cwd changes keep the absolute entry path", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-record-"));
    try {
      const launcherDir = join(startupCwd, "dist", "cli");
      const launcherPath = join(launcherDir, "rcs.js");
      await mkdir(launcherDir, { recursive: true });
      await writeFile(launcherPath, "#!/usr/bin/env node\n", "utf-8");

      delete process.env[RCS_ENTRY_PATH_ENV];
      delete process.env[RCS_STARTUP_CWD_ENV];
      rememberRcsLaunchContext({
        argv1: "dist/cli/rcs.js",
        cwd: startupCwd,
        env: process.env,
      });

      assert.equal(process.env[RCS_STARTUP_CWD_ENV], startupCwd);
      assert.equal(process.env[RCS_ENTRY_PATH_ENV], canonicalizeComparablePath(launcherPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
    }
  });

  it("prefers explicit argv1 over an ambient RCS_ENTRY_PATH override", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-explicit-start-"));
    try {
      const launcherDir = join(startupCwd, "dist", "cli");
      const launcherPath = join(launcherDir, "rcs.js");
      await mkdir(launcherDir, { recursive: true });
      await writeFile(launcherPath, "#!/usr/bin/env node\n", "utf-8");

      const resolved = resolveRcsEntryPath({
        argv1: "dist/cli/rcs.js",
        cwd: startupCwd,
        env: {
          ...process.env,
          [RCS_ENTRY_PATH_ENV]: "/tmp/ambient-rcs.js",
          [RCS_STARTUP_CWD_ENV]: startupCwd,
        },
      });

      assert.equal(resolved, canonicalizeComparablePath(launcherPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
    }
  });

  it("records the default launcher path when called without an explicit argv1", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-default-record-"));
    const originalArgv1 = process.argv[1];
    try {
      const launcherDir = join(startupCwd, "dist", "cli");
      const launcherPath = join(launcherDir, "rcs.js");
      await mkdir(launcherDir, { recursive: true });
      await writeFile(launcherPath, "#!/usr/bin/env node\n", "utf-8");

      delete process.env[RCS_ENTRY_PATH_ENV];
      delete process.env[RCS_STARTUP_CWD_ENV];
      process.argv[1] = launcherPath;

      rememberRcsLaunchContext({
        cwd: startupCwd,
        env: process.env,
      });

      assert.equal(process.env[RCS_STARTUP_CWD_ENV], startupCwd);
      assert.equal(process.env[RCS_ENTRY_PATH_ENV], canonicalizeComparablePath(launcherPath));
    } finally {
      process.argv[1] = originalArgv1;
      await rm(startupCwd, { recursive: true, force: true });
    }
  });

  it("falls back to the packaged CLI entry when argv1 points at a non-CLI script", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-cli-fallback-start-"));
    const packageRootDir = await mkdtemp(join(tmpdir(), "rcs-launcher-cli-fallback-root-"));
    try {
      const hookDir = join(startupCwd, "dist", "scripts");
      const hookPath = join(hookDir, "codex-native-hook.js");
      const cliDir = join(packageRootDir, "dist", "cli");
      const cliPath = join(cliDir, "rcs.js");
      await mkdir(hookDir, { recursive: true });
      await mkdir(cliDir, { recursive: true });
      await writeFile(hookPath, "#!/usr/bin/env node\n", "utf-8");
      await writeFile(cliPath, "#!/usr/bin/env node\n", "utf-8");

      const resolved = resolveRcsCliEntryPath({
        argv1: "dist/scripts/codex-native-hook.js",
        cwd: startupCwd,
        env: {
          ...process.env,
          [RCS_STARTUP_CWD_ENV]: startupCwd,
        },
        packageRootDir,
      });

      assert.equal(resolved, canonicalizeComparablePath(cliPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
      await rm(packageRootDir, { recursive: true, force: true });
    }
  });

  it("keeps the resolved path when argv1 already points at the CLI entry", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-cli-direct-start-"));
    try {
      const cliDir = join(startupCwd, "dist", "cli");
      const cliPath = join(cliDir, "rcs.js");
      await mkdir(cliDir, { recursive: true });
      await writeFile(cliPath, "#!/usr/bin/env node\n", "utf-8");

      const resolved = resolveRcsCliEntryPath({
        argv1: "dist/cli/rcs.js",
        cwd: startupCwd,
        env: {
          ...process.env,
          [RCS_STARTUP_CWD_ENV]: startupCwd,
        },
      });

      assert.equal(resolved, canonicalizeComparablePath(cliPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
    }
  });

  it("falls back from a non-RCS host binary to the packaged CLI entry", async () => {
    const startupCwd = await mkdtemp(join(tmpdir(), "rcs-launcher-cli-host-start-"));
    const packageRootDir = await mkdtemp(join(tmpdir(), "rcs-launcher-cli-host-root-"));
    try {
      const hostPath = join(startupCwd, "codex-host");
      const cliDir = join(packageRootDir, "dist", "cli");
      const cliPath = join(cliDir, "rcs.js");
      await writeFile(hostPath, "#!/usr/bin/env node\n", "utf-8");
      await mkdir(cliDir, { recursive: true });
      await writeFile(cliPath, "#!/usr/bin/env node\n", "utf-8");

      const resolved = resolveRcsCliEntryPath({
        argv1: hostPath,
        cwd: startupCwd,
        env: {
          ...process.env,
          [RCS_STARTUP_CWD_ENV]: startupCwd,
        },
        packageRootDir,
      });

      assert.equal(resolved, canonicalizeComparablePath(cliPath));
    } finally {
      await rm(startupCwd, { recursive: true, force: true });
      await rm(packageRootDir, { recursive: true, force: true });
    }
  });

});
