// @ts-ignore
import http from 'http';
import { Orchestrator } from './orchestrator.js';
import { Dashboard } from './api.js';
import { Task } from './types.js';

export interface ServerConfig {
  port: number;
  host: string;
}

export class OrchestratorServer {
  private orchestrator: Orchestrator;
  private dashboard: Dashboard;
  private server: any;
  private config: ServerConfig;

  constructor(orchestrator: Orchestrator, config: ServerConfig = { port: 3000, host: 'localhost' }) {
    this.orchestrator = orchestrator;
    this.dashboard = new Dashboard(orchestrator);
    this.config = config;
  }

  async start(): Promise<void> {
    this.server = http.createServer((req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const url = req.url;
      const method = req.method;

      try {
        if (method === 'GET' && url === '/api/stats') {
          const response = this.dashboard.getStats();
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else if (method === 'GET' && url === '/api/agents') {
          const response = this.dashboard.getAgents();
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else if (method === 'GET' && url === '/api/results') {
          const response = this.dashboard.getResults();
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else if (method === 'GET' && url === '/api/metrics') {
          const response = this.dashboard.getMetrics();
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } else if (method === 'POST' && url === '/api/execute') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', () => {
            try {
              const task = JSON.parse(body) as Task;
              const response = this.dashboard.executeTask(task);
              res.writeHead(200);
              res.end(JSON.stringify(response));
            } catch (error) {
              res.writeHead(400);
              res.end(JSON.stringify({ status: 'error', error: String(error), timestamp: Date.now() }));
            }
          });
        } else if (method === 'GET' && url === '/') {
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.end(this.getDashboardHTML());
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ status: 'error', error: 'Not found', timestamp: Date.now() }));
        }
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', error: String(error), timestamp: Date.now() }));
      }
    });

    return new Promise((resolve, reject) => {
      this.server.listen(this.config.port, this.config.host, () => {
        // @ts-ignore
        console.log(`\n🚀 Dashboard: http://${this.config.host}:${this.config.port}`);
        resolve();
      });
      this.server.on('error', reject);
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((error: any) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  private getDashboardHTML(): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Squad - Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: #fff;
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      text-align: center;
      margin-bottom: 40px;
      animation: slideDown 0.6s ease;
    }
    h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .subtitle { font-size: 0.9rem; opacity: 0.8; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      animation: fadeIn 0.6s ease;
    }
    .card h2 { font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px; text-transform: uppercase; }
    .card .value { font-size: 2rem; font-weight: bold; }
    .agents-list {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      animation: fadeIn 0.8s ease;
    }
    .agent-item {
      padding: 12px;
      margin: 8px 0;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .agent-name { font-weight: 600; }
    .agent-status { padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; }
    .status-enabled { background: rgba(76, 175, 80, 0.3); color: #4caf50; }
    .status-disabled { background: rgba(244, 67, 54, 0.3); color: #f44336; }
    .refresh-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.2s;
      margin-top: 20px;
    }
    .refresh-btn:hover { transform: scale(1.05); }
    .loading { opacity: 0.6; }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🤖 Claude Squad</h1>
      <p class="subtitle">Orchestrateur Multi-Agents</p>
    </header>

    <div class="grid" id="stats">
      <div class="card loading">
        <h2>Agents Actifs</h2>
        <div class="value">-</div>
      </div>
      <div class="card loading">
        <h2>Tâches Exécutées</h2>
        <div class="value">-</div>
      </div>
      <div class="card loading">
        <h2>Taux de Succès</h2>
        <div class="value">-</div>
      </div>
      <div class="card loading">
        <h2>Uptime</h2>
        <div class="value">-</div>
      </div>
    </div>

    <div class="agents-list" id="agents">
      <h2 style="margin-bottom: 16px;">Agents</h2>
      <div class="loading" style="text-align: center; padding: 20px;">Chargement...</div>
    </div>

    <button class="refresh-btn" onclick="loadData()">🔄 Actualiser</button>
  </div>

  <script>
    async function loadData() {
      try {
        const statsRes = await fetch('/api/stats');
        const stats = await statsRes.json();

        const metricsRes = await fetch('/api/metrics');
        const metrics = await metricsRes.json();

        if (stats.status === 'success' && stats.data) {
          const enabledAgents = stats.data.agents.filter(a => a.enabled).length;
          const uptime = Math.floor(stats.data.uptime / 1000);

          document.getElementById('stats').innerHTML = \`
            <div class="card">
              <h2>Agents Actifs</h2>
              <div class="value">\${enabledAgents}</div>
            </div>
            <div class="card">
              <h2>Tâches Exécutées</h2>
              <div class="value">\${stats.data.results.length}</div>
            </div>
            <div class="card">
              <h2>Taux de Succès</h2>
              <div class="value">\${metrics.data ? (metrics.data.successRate * 100).toFixed(0) : 'N/A'}%</div>
            </div>
            <div class="card">
              <h2>Uptime</h2>
              <div class="value">\${uptime}s</div>
            </div>
          \`;

          document.getElementById('agents').innerHTML = \`
            <h2 style="margin-bottom: 16px;">Agents (\${stats.data.agents.length})</h2>
            \${stats.data.agents.map(a => \`
              <div class="agent-item">
                <span class="agent-name">\${a.name}</span>
                <span class="agent-status \${a.enabled ? 'status-enabled' : 'status-disabled'}">
                  \${a.enabled ? '✓ Actif' : '✗ Inactif'}
                </span>
              </div>
            \`).join('')}
          \`;
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }

    loadData();
    setInterval(loadData, 3000);
  </script>
</body>
</html>
    `;
  }
}
