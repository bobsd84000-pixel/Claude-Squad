import { Orchestrator } from './orchestrator.js';
import { TaskResult } from './types.js';

export interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  timestamp: number;
}

export class Dashboard {
  private orchestrator: Orchestrator;
  private requestCount = 0;
  private startTime = Date.now();

  constructor(orchestrator: Orchestrator) {
    this.orchestrator = orchestrator;
  }

  getStats(): APIResponse<{
    uptime: number;
    requests: number;
    agents: any[];
    results: TaskResult[];
  }> {
    return {
      status: 'success',
      data: {
        uptime: Date.now() - this.startTime,
        requests: this.requestCount,
        agents: this.orchestrator.listAgents().map(a => ({
          id: a.id,
          name: a.name,
          enabled: a.enabled,
          priority: a.priority,
          capabilities: a.capabilities,
        })),
        results: this.orchestrator.getResults(),
      },
      timestamp: Date.now(),
    };
  }

  getAgents(): APIResponse<any[]> {
    return {
      status: 'success',
      data: this.orchestrator.listAgents(),
      timestamp: Date.now(),
    };
  }

  getResults(): APIResponse<TaskResult[]> {
    return {
      status: 'success',
      data: this.orchestrator.getResults(),
      timestamp: Date.now(),
    };
  }

  async executeTask(task: any): Promise<APIResponse<TaskResult[]>> {
    this.requestCount++;
    try {
      const results = await this.orchestrator.executeTask(task);
      return {
        status: 'success',
        data: results,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'error',
        error: String(error),
        timestamp: Date.now(),
      };
    }
  }

  getMetrics(): APIResponse<{
    totalTasks: number;
    successRate: number;
    averageDuration: number;
    agentPerformance: Record<string, any>;
  }> {
    const results = this.orchestrator.getResults();
    const successful = results.filter(r => r.status === 'success').length;
    const avgDuration = results.length > 0
      ? results.reduce((sum, r) => sum + r.duration, 0) / results.length
      : 0;

    const agentPerf: Record<string, any> = {};
    results.forEach(r => {
      if (!agentPerf[r.agentId]) {
        agentPerf[r.agentId] = { total: 0, success: 0, avgDuration: 0 };
      }
      agentPerf[r.agentId].total++;
      if (r.status === 'success') agentPerf[r.agentId].success++;
      agentPerf[r.agentId].avgDuration += r.duration;
    });

    Object.keys(agentPerf).forEach(agentId => {
      agentPerf[agentId].avgDuration /= agentPerf[agentId].total;
      agentPerf[agentId].successRate = agentPerf[agentId].success / agentPerf[agentId].total;
    });

    return {
      status: 'success',
      data: {
        totalTasks: results.length,
        successRate: results.length > 0 ? successful / results.length : 0,
        averageDuration: avgDuration,
        agentPerformance: agentPerf,
      },
      timestamp: Date.now(),
    };
  }
}
