export interface DocumentRefreshRule {
  id: string;
  description: string;
  sourceGlobs: string[];
  refreshTargets: string[];
  ignoredGlobs?: string[];
}

export const DEFAULT_DOCUMENT_REFRESH_RULES: DocumentRefreshRule[] = [
  {
    id: "native-hook-behavior",
    description: "Codex native hook behavior and managed hook configuration",
    sourceGlobs: [
      "src/scripts/codex-native-hook.ts",
      "src/scripts/codex-native-pre-post.ts",
      "src/scripts/__tests__/codex-native-hook.test.ts",
      "src/config/codex-hooks.ts",
      "src/config/__tests__/codex-hooks.test.ts",
    ],
    refreshTargets: [
      "docs/codex-native-hooks.md",
      ".rcs/plans/*codex-native*",
      ".rcs/specs/*codex-native*",
      ".rcs/plans/*native-hook*",
      ".rcs/specs/*native-hook*",
    ],
  },
  {
    id: "document-refresh-enforcer",
    description: "Document-refresh warning classifier and rule behavior",
    sourceGlobs: [
      "src/document-refresh/**",
    ],
    refreshTargets: [
      "docs/codex-native-hooks.md",
      ".rcs/plans/*document-refresh*",
      ".rcs/specs/*document-refresh*",
    ],
  },
  {
    id: "cli-operator-behavior",
    description: "CLI and operator-facing behavior",
    sourceGlobs: [
      "src/cli/**",
    ],
    refreshTargets: [
      "README.md",
      "docs/getting-started.html",
      ".rcs/plans/*cli*",
      ".rcs/specs/*cli*",
      ".rcs/plans/*operator*",
      ".rcs/specs/*operator*",
    ],
    ignoredGlobs: [
      "src/cli/**/__tests__/**",
      "src/cli/**/*.test.ts",
    ],
  },
  {
    id: "prompt-guidance-behavior",
    description: "Prompt guidance and hook routing behavior",
    sourceGlobs: [
      "src/hooks/keyword-detector.ts",
      "src/hooks/triage-config.ts",
      "src/hooks/triage-heuristic.ts",
      "src/hooks/__tests__/prompt-guidance-*.test.ts",
      "src/hooks/__tests__/analyze-*-contract.test.ts",
    ],
    refreshTargets: [
      "docs/prompt-guidance-contract.md",
      ".rcs/plans/*prompt*",
      ".rcs/specs/*prompt*",
      ".rcs/plans/*guidance*",
      ".rcs/specs/*guidance*",
    ],
  },
];
