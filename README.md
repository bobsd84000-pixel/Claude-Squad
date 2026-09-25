# Claude Squad

Orchestrateur multi-agents pour coordonner Claude Code, Codex, OpenCode et Amp.

## Architecture

```
src/
  ├─ index.ts            (entrée)
  ├─ orchestrator.ts     (engine principal)
  ├─ types.ts            (interfaces)
  └─ agents/             (implémentations agents — TBD)
agents.config.json       (config agents)
```

## Usage

### Démarrage

```bash
npm install
npm run build
npm start
```

### Agents activés

- **claude-code** (priorité 1) — Coding, terminal, file-system
- **codex** (priorité 2) — Search, documentation, indexing

### Agents futurs

- **opencode** — Discovery + analysis
- **amp** — Metrics + telemetry

## Workflow

1. Créer une `Task` avec capabilities requises
2. Orchestrator identifie agents capable
3. Exécution séquentielle (par défaut) ou parallèle
4. Collect résultats

## Roadmap

- [ ] Implémentation agents (Claude Code hook)
- [ ] Communication inter-agents (IPC/webhooks)
- [ ] Error handling + retry logic
- [ ] Déployer sur Vercel
- [ ] Dashboard monitoring