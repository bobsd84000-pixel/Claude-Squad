// @ts-ignore
import { readFileSync } from 'fs';
import { Orchestrator } from './orchestrator.js';
import { OrchestratorConfig } from './types.js';
import { OrchestratorServer } from './server.js';
import { runTests } from './orchestrator.test.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';

  if (command === 'test') {
    await runTests();
    return;
  }

  const configRaw = readFileSync('./agents.config.json', 'utf8');
  const config: OrchestratorConfig = JSON.parse(configRaw);

  const orchestrator = new Orchestrator(config);

  // @ts-ignore
  console.log('=== Claude Squad Orchestrator ===\n');
  // @ts-ignore
  console.log('Agents disponibles:');
  orchestrator.listAgents().forEach(a => {
    // @ts-ignore
    console.log(`  [${a.enabled ? '✓' : '✗'}] ${a.id} (priority: ${a.priority})`);
    // @ts-ignore
    console.log(`      ↳ ${a.description}`);
  });

  const testTask = {
    id: 'task-001',
    name: 'Test Orchestration',
    description: 'Vérifier la communication multi-agents',
    requiredCapabilities: ['coding'],
    payload: { test: true },
  };

  // @ts-ignore
  console.log('\n=== Execution Task ===');
  const results = await orchestrator.executeTask(testTask);

  // @ts-ignore
  console.log('\n=== Résultats ===');
  results.forEach(r => {
    // @ts-ignore
    console.log(`  ${r.agentId}: ${r.status} (${r.duration}ms)`);
  });

  // Démarrer le serveur dashboard
  if (command === 'server' || command === 'run') {
    const server = new OrchestratorServer(orchestrator, { port: 3000, host: '0.0.0.0' });
    try {
      await server.start();
      // @ts-ignore
      console.log('\nServeur lancé. Dashboard disponible sur http://localhost:3000');
    } catch (error) {
      // @ts-ignore
      console.error('Erreur serveur:', error);
    }
  } else {
    // @ts-ignore
    console.log('\nclaude-code: success');
  }
}

main().catch(err => {
  // @ts-ignore
  console.error('Erreur:', err);
  process.exit(1);
});
