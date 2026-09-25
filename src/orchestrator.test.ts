import { Orchestrator } from './orchestrator.js';
import { OrchestratorConfig, Task } from './types.js';

// Simple test framework
const tests: { name: string; fn: () => Promise<void> | void }[] = [];
let passed = 0;
let failed = 0;

function test(name: string, fn: () => Promise<void> | void) {
  tests.push({ name, fn });
}

async function runTests() {
  // @ts-ignore
  console.log('\n=== Tests Orchestrator ===\n');

  for (const t of tests) {
    try {
      await t.fn();
      // @ts-ignore
      console.log(`✓ ${t.name}`);
      passed++;
    } catch (error) {
      // @ts-ignore
      console.log(`✗ ${t.name}: ${error.message}`);
      failed++;
    }
  }

  // @ts-ignore
  console.log(`\n${passed} passed, ${failed} failed\n`);
}

// Tests
test('Orchestrator crée avec config', () => {
  const config: OrchestratorConfig = {
    agents: {
      'test-agent': {
        id: 'test-agent',
        name: 'Test',
        enabled: true,
        priority: 1,
        capabilities: ['test'],
        description: 'Test agent',
      },
    },
    orchestration: {
      mode: 'sequential',
      timeout: 30000,
      retries: 2,
      logging: false,
    },
  };

  const orchestrator = new Orchestrator(config);
  const agents = orchestrator.listAgents();

  if (agents.length !== 1) throw new Error('Devrait avoir 1 agent');
  if (agents[0].id !== 'test-agent') throw new Error('ID agent invalide');
});

test('Identifie agents capable', async () => {
  const config: OrchestratorConfig = {
    agents: {
      'agent-1': {
        id: 'agent-1',
        name: 'Agent 1',
        enabled: true,
        priority: 1,
        capabilities: ['coding', 'test'],
        description: 'Test',
      },
      'agent-2': {
        id: 'agent-2',
        name: 'Agent 2',
        enabled: true,
        priority: 2,
        capabilities: ['search'],
        description: 'Test',
      },
    },
    orchestration: {
      mode: 'sequential',
      timeout: 30000,
      retries: 1,
      logging: false,
    },
  };

  const orchestrator = new Orchestrator(config);
  const task: Task = {
    id: 'task-1',
    name: 'Test Task',
    description: 'Test',
    requiredCapabilities: ['coding'],
    payload: {},
  };

  const results = await orchestrator.executeTask(task);
  if (results.length === 0) throw new Error('Aucun résultat');
  if (results[0].agentId !== 'agent-1') throw new Error('Mauvais agent sélectionné');
});

test('Erreur si aucun agent capable', async () => {
  const config: OrchestratorConfig = {
    agents: {
      'agent-1': {
        id: 'agent-1',
        name: 'Agent 1',
        enabled: true,
        priority: 1,
        capabilities: ['search'],
        description: 'Test',
      },
    },
    orchestration: {
      mode: 'sequential',
      timeout: 30000,
      retries: 1,
      logging: false,
    },
  };

  const orchestrator = new Orchestrator(config);
  const task: Task = {
    id: 'task-2',
    name: 'Test Task',
    description: 'Test',
    requiredCapabilities: ['non-existent'],
    payload: {},
  };

  try {
    await orchestrator.executeTask(task);
    throw new Error('Devrait lancer une erreur');
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    if (!error.message.includes('Aucun agent capable')) throw error;
  }
});

test('Mode séquentiel execute agents en ordre', async () => {
  const execOrder: string[] = [];

  const config: OrchestratorConfig = {
    agents: {
      'priority-1': {
        id: 'priority-1',
        name: 'P1',
        enabled: true,
        priority: 1,
        capabilities: ['test'],
        description: 'Test',
      },
      'priority-2': {
        id: 'priority-2',
        name: 'P2',
        enabled: true,
        priority: 2,
        capabilities: ['test'],
        description: 'Test',
      },
    },
    orchestration: {
      mode: 'sequential',
      timeout: 30000,
      retries: 1,
      logging: false,
    },
  };

  const orchestrator = new Orchestrator(config);
  const task: Task = {
    id: 'task-3',
    name: 'Order Test',
    description: 'Test',
    requiredCapabilities: ['test'],
    payload: {},
  };

  const results = await orchestrator.executeTask(task);
  if (results.length < 2) throw new Error('Devrait avoir 2 résultats');
  if (results[0].agentId !== 'priority-1') throw new Error('Ordre invalide');
  if (results[1].agentId !== 'priority-2') throw new Error('Ordre invalide');
});

export { runTests };
