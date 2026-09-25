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
        const result = await this.executeOnAgent(agent, task);
        results.push(result);
        if (result.status === 'error') break;
      }
    } else {
      const promises = matchingAgents.map(a => this.executeOnAgent(a, task));
      results.push(...await Promise.all(promises));
    }

    this.results.push(...results);
    return results;
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
