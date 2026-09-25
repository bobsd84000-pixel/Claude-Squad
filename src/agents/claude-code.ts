import { Task } from '../types.js';
import { AgentRunner, buildPrompt, runCommand } from './runner.js';

export const claudeCode: AgentRunner = {
  id: 'claude-code',
  async run(task: Task, timeoutMs: number) {
    const out = await runCommand('claude', ['-p', buildPrompt(task), '--output-format', 'json'], timeoutMs);
    const parsed = JSON.parse(out);
    if (parsed.is_error) throw new Error(`claude-code: ${parsed.result}`);
    return { result: parsed.result, costUsd: parsed.total_cost_usd, sessionId: parsed.session_id };
  },
};
