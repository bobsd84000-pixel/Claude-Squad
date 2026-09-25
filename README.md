# Claude Squad

Orchestrateur multi-agents production-ready pour coordonner Claude Code, Codex, OpenCode et Amp.

## Architecture

```
src/
  ├─ index.ts              (entrée)
  ├─ orchestrator.ts       (engine principal + retry logic)
  ├─ types.ts              (interfaces)
  ├─ events.ts             (EventBus pour communication inter-agents)
  ├─ agents/               (implémentations agents)
  │  ├─ claude-code.agent.ts
  │  └─ codex.agent.ts
  ├─ api.ts                (Dashboard API)
  ├─ server.ts             (Serveur HTTP + Dashboard web)
  ├─ orchestrator.test.ts  (Tests unitaires)
  └─ globals.d.ts          (Déclarations types globales)
agents.config.json         (configuration agents)
vercel.json                (config déploiement)
.github/workflows/ci.yml   (CI/CD)
```

## Démarrage

```bash
npm install
npm run build

# Mode classique (orchestration + affichage)
npm start

# Mode serveur (Dashboard web)
npm run server

# Lancer les tests
npm test
```

## Commandes

| Commande | Description |
|----------|------------|
| `npm run build` | Compiler TypeScript → JavaScript |
| `npm start` | Exécuter orchestrateur classique |
| `npm run server` | Lancer serveur Dashboard (http://localhost:3000) |
| `npm test` | Exécuter tests unitaires |
| `npm run dev` | Mode développement |

## Agents activés ✓

- **claude-code** (priorité 1) — Coding, terminal, file-system
- **codex** (priorité 2) — Search, documentation, indexing

## Agents futurs

- **opencode** — Discovery + analysis
- **amp** — Metrics + telemetry

## Features

### ✓ Implémentées

- [x] **Orchestration** - Exécution agents séquentielle/parallèle
- [x] **Agents réels** - claude-code, codex avec logique
- [x] **Error handling** - Retry avec backoff exponentiel
- [x] **Événements** - EventBus pour communication inter-agents
- [x] **API REST** - Endpoints pour stats, agents, métriques
- [x] **Dashboard** - Web UI temps-réel (HTML/CSS/JS)
- [x] **Tests** - Suite de tests unitaires (4 tests)
- [x] **Config** - agents.config.json centralisée
- [x] **TypeScript** - Full type-safety (sans @types/node)
- [x] **CI/CD** - GitHub Actions workflow

### Déploiement Vercel

```bash
# Configurer secrets GitHub
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Push déclenche déploiement auto
git push origin main
```

## Workflow

1. Créer une `Task` avec `requiredCapabilities`
2. `Orchestrator` identifie agents capable
3. Exécution avec retry automatique (2 tentatives par défaut)
4. EventBus notifie tous les agents intéressés
5. Collecte résultats dans Dashboard
6. API expose métriques & stats

## Exemple

```typescript
const task = {
  id: 'task-001',
  name: 'Refactor component',
  description: 'Refactoriser React component',
  requiredCapabilities: ['coding', 'file-system'],
  payload: { file: 'Button.tsx' },
};

const results = await orchestrator.executeTask(task);
// results[0].status === 'success' ✓
```

## Métriques

Dashboard affiche:
- Agents actifs/inactifs
- Tâches exécutées
- Taux de succès global
- Temps de réponse moyen
- Performance par agent

## Roadmap futuro

- [ ] WebSocket live updates
- [ ] Persistent queue (Redis)
- [ ] Multi-cluster orchestration
- [ ] Audit logging
- [ ] Rate limiting & quotas