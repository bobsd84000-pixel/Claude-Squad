import { AgentRunner } from './runner.js';
import { claudeCode } from './claude-code.js';
import { codex } from './codex.js';

const runners: Record<string, AgentRunner> = {
  [claudeCode.id]: claudeCode,
  [codex.id]: codex,
};

export function getRunner(agentId: string): AgentRunner | undefined {
  return runners[agentId];
}

export type { AgentRunner } from './runner.js';
