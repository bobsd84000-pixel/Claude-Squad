import { Agent, Task, TaskResult } from '../types.js';

export class CodexAgent implements Agent {
  id = 'codex';
  name = 'Codex';
  enabled = true;
  priority = 2;
  capabilities = ['search', 'documentation', 'indexing'];
  description = 'Documentation + search agent';

  async execute(task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      // @ts-ignore
      console.log(`[AGENT:codex] Recherche: ${task.name}`);

      // Simulé: logique réelle de recherche/indexing
      await this.sleep(75);

      return {
        taskId: task.id,
        agentId: this.id,
        status: 'success',
        output: {
          agent: this.id,
          searched: true,
          results: 5,
          timestamp: new Date().toISOString(),
        },
        timestamp: startTime,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        taskId: task.id,
        agentId: this.id,
        status: 'error',
        output: { error: String(error) },
        timestamp: startTime,
        duration: Date.now() - startTime,
      };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      // @ts-ignore
      setTimeout(resolve, ms);
    });
  }
}
