import { Task } from '../types.js';
import { AgentRunner, buildPrompt, runCommand } from './runner.js';

export const codex: AgentRunner = {
  id: 'codex',
  async run(task: Task, timeoutMs: number) {
    const out = await runCommand('codex', ['exec', buildPrompt(task)], timeoutMs);
    return { result: out };
  },
};
