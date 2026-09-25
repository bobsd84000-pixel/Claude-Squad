import { Task, TaskResult, Agent, OrchestratorConfig } from './types.js';
import { getRunner } from './agents/index.js';
import { EventBus } from './eventBus.js';

export class Orchestrator {
  private config: OrchestratorConfig;
  private agents: Map<string, Agent>;
  private results: TaskResult[] = [];
  private eventBus: EventBus;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.agents = new Map();
    this.eventBus = new EventBus();
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

    this.log(`[TASK] ${task.name} → agents: ${matchingAgents.map(a => a.id).join(', ')}`);

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

  private async executeWithRetry(agent: Agent, task: Task): Promise<TaskResult> {
    const maxRetries = this.config.orchestration.retries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeOnAgent(agent, task);
        if (result.status === 'success') return result;
        lastError = new Error(String((result.output as any)?.error || 'unknown error'));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt) * 1000;
          this.log(`[RETRY] ${agent.id}: attempt ${attempt + 1}/${maxRetries + 1}, retrying in ${delayMs}ms`);
          await this.sleep(delayMs);
        }
      }
    }

    return {
      taskId: task.id,
      agentId: agent.id,
      status: 'error',
      output: { error: lastError?.message || 'max retries exceeded' },
      timestamp: Date.now(),
      duration: 0,
    };
  }

  private async executeOnAgent(agent: Agent, task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      this.log(`[EXEC] ${agent.id}: ${task.name}`);
      
      const runner = getRunner(agent.id);
      let output: unknown;
      if (runner) {
        const context = {
          agentId: agent.id,
          taskId: task.id,
          eventBus: this.eventBus,
        };
        output = await runner.run(task, this.config.orchestration.timeout, context);
      } else {
        await this.sleep(100);
        output = { processed: true, agent: agent.id };
      }

      return {
        taskId: task.id,
        agentId: agent.id,
        status: 'success',
        output,
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(msg: string): void {
    if (this.config.orchestration.logging) {
      console.log(`[${new Date().toISOString()}] ${msg}`);
    }
  }

  getResults(): TaskResult[] {
    return this.results;
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }
}
