import { Agent, Task, TaskResult } from '../types.js';

export class ClaudeCodeAgent implements Agent {
  id = 'claude-code';
  name = 'Claude Code';
  enabled = true;
  priority = 1;
  capabilities = ['coding', 'file-system', 'terminal'];
  description = 'Coding agent — Claude Code avec terminal + file ops';

  async execute(task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      // @ts-ignore
      console.log(`[AGENT:claude-code] Exécution: ${task.name}`);

      // Simulé: logique réelle intégrée avec Claude Code hook
      await this.sleep(50);

      return {
        taskId: task.id,
        agentId: this.id,
        status: 'success',
        output: {
          agent: this.id,
          executed: true,
          timestamp: new Date().toISOString(),
          payload: task.payload,
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
