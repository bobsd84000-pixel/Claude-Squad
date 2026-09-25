export interface Agent {
  id: string;
  name?: string;
  enabled: boolean;
  priority: number;
  capabilities: string[];
  description: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  requiredCapabilities: string[];
  payload: Record<string, unknown>;
}

export interface TaskResult {
  taskId: string;
  agentId: string;
  status: 'success' | 'error' | 'pending';
  output: unknown;
  timestamp: number;
  duration: number;
}

export interface WorkflowConfig {
  name: string;
  agents: string[];
  mode: 'sequential' | 'parallel';
  timeout: number;
}

export interface OrchestratorConfig {
  agents: Record<string, Agent>;
  orchestration: {
    mode: 'sequential' | 'parallel';
    timeout: number;
    retries: number;
    logging: boolean;
  };
}

export interface AgentContext {
  agentId: string;
  taskId: string;
  eventBus: any;
}
