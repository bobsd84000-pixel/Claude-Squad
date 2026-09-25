import { createServer, Server } from 'http';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { EventBus, BusEvent } from './eventBus.js';

export class Dashboard {
  private server: Server;
  private port: number;
  private eventBus: EventBus;
  private events: BusEvent[] = [];
  private maxEvents = 1000;
  private __dirname: string;

  constructor(eventBus: EventBus, port: number = 3000) {
    const __filename = fileURLToPath(import.meta.url);
    this.__dirname = dirname(__filename);

    this.eventBus = eventBus;
    this.port = port;
    this.server = createServer((req, res) => this.handleRequest(req, res));

    this.eventBus.subscribe('*', (event: BusEvent) => {
      this.events.push(event);
      if (this.events.length > this.maxEvents) {
        this.events.shift();
      }
    });
  }

  private handleRequest(req: any, res: any): void {
    const url = req.url || '/';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (url === '/') {
      this.serveDashboard(res);
    } else if (url === '/api/events') {
      this.serveEvents(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }

  private serveDashboard(res: any): void {
    try {
      const dashboardPath = join(this.__dirname, 'dashboard.html');
      const html = readFileSync(dashboardPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Dashboard not found' }));
    }
  }

  private serveEvents(res: any): void {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      events: this.events,
      total: this.events.length,
      timestamp: Date.now(),
    }));
  }

  start(): void {
    this.server.listen(this.port, () => {
      console.log(`\n📊 Dashboard disponible: http://localhost:${this.port}`);
      console.log(`📡 Events API: http://localhost:${this.port}/api/events\n`);
    });
  }

  stop(): void {
    this.server.close();
  }
}
