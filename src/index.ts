import { readFileSync } from 'fs';
import { Orchestrator } from './orchestrator.js';
import { OrchestratorConfig } from './types.js';

async function main() {
  const configRaw = readFileSync('./agents.config.json', 'utf8');
  const config: OrchestratorConfig = JSON.parse(configRaw);

  const orchestrator = new Orchestrator(config);

  console.log('=== Claude Squad Orchestrator ===\n');
  console.log('Agents disponibles:');
  orchestrator.listAgents().forEach(a => {
    console.log(`  [${a.enabled ? '✓' : '✗'}] ${a.id} (priority: ${a.priority})`);
    console.log(`      ↳ ${a.description}`);
  });

  const testTask = {
    id: 'task-001',
    name: 'Test Orchestration',
    description: 'Vérifier la communication multi-agents',
    requiredCapabilities: ['coding'],
    payload: { test: true },
  };

  console.log('\n=== Execution Task ===');
  const results = await orchestrator.executeTask(testTask);

  console.log('\n=== Résultats ===');
  results.forEach(r => {
    console.log(`  ${r.agentId}: ${r.status} (${r.duration}ms)`);
  });

  console.log('\nclaude-code: success');
}

main().catch(console.error);
