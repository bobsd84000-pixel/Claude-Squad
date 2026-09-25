import { readFileSync } from 'fs';
import { Orchestrator } from './orchestrator.js';
import { Dashboard } from './dashboard.js';
import { OrchestratorConfig } from './types.js';

async function main() {
  try {
    const configRaw = readFileSync('./agents.config.json', 'utf8');
    const config: OrchestratorConfig = JSON.parse(configRaw);

  const orchestrator = new Orchestrator(config);
  const dashboard = new Dashboard(orchestrator.getEventBus(), 3000);

  console.log('=== Claude Squad Orchestrator ===\n');
  console.log('Agents disponibles:');
  orchestrator.listAgents().forEach(a => {
    console.log(`  [${a.enabled ? '✓' : '✗'}] ${a.id} (priority: ${a.priority})`);
    console.log(`      → ${a.description}`);
  });

  dashboard.start();

  const testTask = {
    id: 'task-001',
    name: 'Test Orchestration',
    description: 'Vérifier la communication multi-agents',
    requiredCapabilities: ['coding'],
    payload: { test: true },
  };

  console.log('\n=== Exécution Task ===');
  const results = await orchestrator.executeTask(testTask);

  console.log('\n=== Résultats ===');
  results.forEach(r => {
    console.log(`  ${r.agentId}: ${r.status} (${r.duration}ms)`);
  });
  } catch (err) {
    console.error('❌ Erreur:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main().catch(console.error);
