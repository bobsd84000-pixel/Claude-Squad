import { Task, TaskResult, Agent, OrchestratorConfig } from './types.js';

export class Orchestrator {
  private config: OrchestratorConfig;
  private agents: Map<string, Agent>;
  private results: TaskResult[] = [];

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.agents = new Map();
    Object.entries(config.agents).forEach(([id, agent]) => {
      this.agents.set(id, { ...agent, id });
    });
  }

  async executeTask(task: Task): Promise<TaskResult[]> {
    const enabledAgents = Array.from(this.agents.values())
      .filter(a => a.enabled)
      .sort((a, b) => a.priority - b.priority);

    const matchingAgents = enabledAgents.filter(a =>
      task.requiredCapabilities.every(cap => a.capabilities.includes(cap))
    );

    if (matchingAgents.length === 0) {
      throw new Error(`Aucun agent capable de: ${task.requiredCapabilities.join(', ')}`);
    }

    this.log(`[TASK] ${task.name} ↳ agents: ${matchingAgents.map(a => a.id).join(', ')}`);

    const results: TaskResult[] = [];

    if (this.config.orchestration.mode === 'sequential') {
      for (const agent of matchingAgents) {
        const result = await this.executeWithRetry(agent, task);
        results.push(result);
        if (result.status === 'error') break;
      }
    } else {
      const promises = matchingAgents.map(a => this.executeWithRetry(a, task));
      results.push(...await Promise.all(promises));
    }

    this.results.push(...results);
    return results;
  }

  private async executeWithRetry(agent: any, task: Task): Promise<TaskResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.orchestration.retries + 1; attempt++) {
      try {
        return await this.executeOnAgent(agent, task);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.log(`[RETRY] ${agent.id}: tentative ${attempt}/${this.config.orchestration.retries + 1}`);

        if (attempt < this.config.orchestration.retries + 1) {
          const backoff = Math.pow(2, attempt - 1) * 100;
          await this.sleep(backoff);
        }
      }
    }

    return {
      taskId: task.id,
      agentId: agent.id,
      status: 'error',
      output: { error: lastError?.message || 'Unknown error' },
      timestamp: Date.now(),
      duration: 0,
    };
  }

  private async executeOnAgent(agent: Agent, task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      this.log(`[EXEC] ${agent.id}: ${task.name}`);

      // Simulé ↳ remplacer par logique agent réelle
      await this.sleep(100);

      return {
        taskId: task.id,
        agentId: agent.id,
        status: 'success',
        output: { processed: true, agent: agent.id },
        timestamp: startTime,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        taskId: task.id,
        agentId: agent.id,
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

  private log(msg: string): void {
    if (this.config.orchestration.logging) {
      // @ts-ignore
      console.log(`[${new Date().toISOString()}] ${msg}`);
    }
  }

  getResults(): TaskResult[] {
    return this.results;
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}
