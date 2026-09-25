import { Task, AgentContext } from '../types.js';
import { AgentRunner, buildPrompt, runCommand } from './runner.js';

export const codex: AgentRunner = {
  id: 'codex',
  async run(task: Task, timeoutMs: number, context?: AgentContext) {
    const out = await runCommand('codex', ['exec', buildPrompt(task)], timeoutMs);
    const result = { result: out };

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
