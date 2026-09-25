import { Task, AgentContext } from '../types.js';
import { AgentRunner, buildPrompt, runCommand } from './runner.js';

export const claudeCode: AgentRunner = {
  id: 'claude-code',
  async run(task: Task, timeoutMs: number, context?: AgentContext) {
    const out = await runCommand('claude', ['-p', buildPrompt(task), '--output-format', 'json'], timeoutMs);
    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (err) {
      throw new Error(`claude-code: invalid JSON - ${String(err)}`);
    }
    if (!parsed || typeof parsed !== 'object') throw new Error('claude-code: invalid response format');
    if (parsed.is_error) throw new Error(`claude-code: ${parsed.result}`);

    const result = { result: parsed.result, costUsd: parsed.total_cost_usd, sessionId: parsed.session_id };

    if (context?.eventBus) {
      context.eventBus.publish({
        type: 'agent.task.completed',
        agentId: context.agentId,
        taskId: context.taskId,
        timestamp: Date.now(),
        data: result,
      });
    }

    return result;
  },
};
