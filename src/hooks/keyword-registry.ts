export interface KeywordTriggerDefinition {
  keyword: string;
  skill: string;
  priority: number;
  guidance: string;
}

export const KEYWORD_TRIGGER_DEFINITIONS: readonly KeywordTriggerDefinition[] = [
  { keyword: '$ralph', skill: 'ralph', priority: 9, guidance: 'Activate ralph persistence loop with verification' },
  { keyword: '$forge', skill: 'ralph', priority: 10, guidance: 'Activate creator-facing forge alias over ralph persistence' },
  { keyword: '$forge:reward-loop', skill: 'forge-reward-loop', priority: 12, guidance: 'Generate a creator-facing reward-loop specification' },
  { keyword: '$forge:daily-loop', skill: 'forge-daily-loop', priority: 12, guidance: 'Generate a creator-facing daily return loop specification' },
  { keyword: '$forge:event-loop', skill: 'forge-event-loop', priority: 12, guidance: 'Generate a creator-facing event loop specification' },
  { keyword: '$forge:progression', skill: 'forge-progression', priority: 12, guidance: 'Generate a creator-facing progression ladder' },
  { keyword: '$forge:status', skill: 'forge-status', priority: 12, guidance: 'Generate a creator-facing prestige and status specification' },
  { keyword: '$forge:fomo', skill: 'forge-fomo', priority: 12, guidance: 'Generate fair urgency and FOMO mechanics with guardrails' },
  { keyword: '$forge:mastery', skill: 'forge-mastery', priority: 12, guidance: 'Generate mastery and skill-expression systems' },
  { keyword: '$forge:community', skill: 'forge-community', priority: 12, guidance: 'Generate social stickiness and community systems' },
  { keyword: "don't stop", skill: 'ralph', priority: 9, guidance: 'Activate ralph persistence loop with verification' },
  { keyword: 'must complete', skill: 'ralph', priority: 9, guidance: 'Activate ralph persistence loop with verification' },
  { keyword: 'keep going', skill: 'ralph', priority: 9, guidance: 'Activate ralph persistence loop with verification' },

  { keyword: '$autopilot', skill: 'autopilot', priority: 10, guidance: 'Activate autopilot skill for autonomous execution' },
  { keyword: '$autoforge', skill: 'autopilot', priority: 10, guidance: 'Activate creator-facing autoforge alias over autopilot' },
  { keyword: 'build me', skill: 'autopilot', priority: 10, guidance: 'Activate autopilot skill for autonomous execution' },
  { keyword: 'I want a', skill: 'autopilot', priority: 10, guidance: 'Activate autopilot skill for autonomous execution' },

  { keyword: '$ultrawork', skill: 'ultrawork', priority: 10, guidance: 'Activate ultrawork parallel execution mode' },
  { keyword: 'ulw', skill: 'ultrawork', priority: 10, guidance: 'Activate ultrawork parallel execution mode' },
  { keyword: 'parallel', skill: 'ultrawork', priority: 10, guidance: 'Activate ultrawork parallel execution mode' },
  { keyword: '$ultraqa', skill: 'ultraqa', priority: 8, guidance: 'Activate UltraQA cycling workflow' },
  { keyword: '$analyze', skill: 'analyze', priority: 7, guidance: 'Activate deep analysis workflow' },
  { keyword: 'investigate', skill: 'analyze', priority: 7, guidance: 'Activate deep analysis workflow' },

  { keyword: '$deep-interview', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: '$brief', skill: 'deep-interview', priority: 9, guidance: 'Activate creator-facing briefing alias over deep-interview' },
  { keyword: '$brief:audience', skill: 'brief-audience', priority: 12, guidance: 'Profile target fantasy, habits, pain language, and return motive' },
  { keyword: '$brief:motivation', skill: 'brief-motivation', priority: 12, guidance: 'Rank the core psychology drivers and identify anti-pattern risks' },
  { keyword: 'deep interview', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: 'gather requirements', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: 'interview me', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: "don't assume", skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: 'ouroboros', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },
  { keyword: 'interview', skill: 'deep-interview', priority: 8, guidance: 'Activate Ouroboros-inspired Socratic ambiguity-gated interview workflow' },

  { keyword: '$plan', skill: 'plan', priority: 8, guidance: 'Activate planning skill' },
  { keyword: 'plan this', skill: 'plan', priority: 8, guidance: 'Activate planning skill' },
  { keyword: 'plan the', skill: 'plan', priority: 8, guidance: 'Activate planning skill' },
  { keyword: "let's plan", skill: 'plan', priority: 8, guidance: 'Activate planning skill' },

  { keyword: '$ralplan', skill: 'ralplan', priority: 11, guidance: 'Activate consensus planning (planner + architect + critic)' },
  { keyword: '$blueprint', skill: 'ralplan', priority: 11, guidance: 'Activate creator-facing blueprint alias over consensus planning' },
  { keyword: '$blueprint:psych', skill: 'blueprint-psych', priority: 12, guidance: 'Generate a player psychology blueprint from desire backward' },
  { keyword: '$blueprint:loop', skill: 'blueprint-loop', priority: 12, guidance: 'Generate session, daily, weekly, and comeback loops' },
  { keyword: '$blueprint:retention', skill: 'blueprint-retention', priority: 12, guidance: 'Generate D1/D7/D30 retention assumptions and cadence' },
  { keyword: '$blueprint:social', skill: 'blueprint-social', priority: 12, guidance: 'Generate the social machine design for the experience' },
  { keyword: 'consensus plan', skill: 'ralplan', priority: 11, guidance: 'Activate consensus planning (planner + architect + critic)' },

  { keyword: '$autoresearch', skill: 'autoresearch', priority: 10, guidance: 'Activate autoresearch validator-gated research loop' },

  { keyword: '$team', skill: 'team', priority: 8, guidance: 'Activate coordinated team mode' },
  { keyword: '$crew', skill: 'team', priority: 9, guidance: 'Activate creator-facing crew alias over team mode' },
  { keyword: 'swarm', skill: 'team', priority: 8, guidance: 'Activate coordinated team mode (swarm is a compatibility alias for team)' },
  { keyword: 'coordinated team', skill: 'team', priority: 8, guidance: 'Activate coordinated team mode' },
  { keyword: 'coordinated swarm', skill: 'team', priority: 8, guidance: 'Activate coordinated team mode (swarm is a compatibility alias for team)' },

  { keyword: '$cancel', skill: 'cancel', priority: 5, guidance: 'Cancel active execution modes' },
  { keyword: 'stop', skill: 'cancel', priority: 5, guidance: 'Cancel active execution modes' },
  { keyword: 'abort', skill: 'cancel', priority: 5, guidance: 'Cancel active execution modes' },

  { keyword: '$tdd', skill: 'tdd', priority: 6, guidance: 'Activate test-driven workflow' },
  { keyword: 'tdd', skill: 'tdd', priority: 6, guidance: 'Activate test-driven workflow' },
  { keyword: 'test first', skill: 'tdd', priority: 6, guidance: 'Activate test-driven workflow' },

  { keyword: '$build-fix', skill: 'build-fix', priority: 6, guidance: 'Activate build-fix workflow' },
  { keyword: 'fix build', skill: 'build-fix', priority: 6, guidance: 'Activate build-fix workflow' },
  { keyword: 'type errors', skill: 'build-fix', priority: 6, guidance: 'Activate build-fix workflow' },

  { keyword: '$wiki', skill: 'wiki', priority: 5, guidance: 'Activate the project wiki skill' },
  { keyword: 'wiki query', skill: 'wiki', priority: 5, guidance: 'Activate the project wiki skill for search' },
  { keyword: 'wiki add', skill: 'wiki', priority: 5, guidance: 'Activate the project wiki skill for page creation' },
  { keyword: 'wiki lint', skill: 'wiki', priority: 5, guidance: 'Activate the project wiki skill for wiki health checks' },

  { keyword: 'code review', skill: 'code-review', priority: 6, guidance: 'Activate code-review workflow' },
  { keyword: '$code-review', skill: 'code-review', priority: 6, guidance: 'Activate code-review workflow' },
  { keyword: 'review code', skill: 'code-review', priority: 6, guidance: 'Activate code-review workflow' },
  { keyword: '$security-review', skill: 'security-review', priority: 6, guidance: 'Activate security-review workflow' },
  { keyword: 'security review', skill: 'security-review', priority: 6, guidance: 'Activate security-review workflow' },
] as const;

export function compareKeywordMatches(a: { priority: number; keyword: string }, b: { priority: number; keyword: string }): number {
  if (b.priority !== a.priority) return b.priority - a.priority;
  if (b.keyword.length !== a.keyword.length) return b.keyword.length - a.keyword.length;
  return a.keyword.localeCompare(b.keyword);
}
