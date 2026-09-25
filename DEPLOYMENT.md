# Déploiement Vercel

Guide complet pour déployer Claude Squad sur Vercel.

## Prérequis

- Compte GitHub avec le repo `bobsd84000-pixel/Claude-Squad`
- Compte Vercel (gratuit ou payant)
- Accès admin au repo

## Étapes de déploiement

### 1. Configuration Vercel

```bash
# Cloner le repo (si ce n'est pas déjà fait)
git clone https://github.com/bobsd84000-pixel/Claude-Squad.git
cd Claude-Squad

# Installer Vercel CLI
npm install -g vercel

# Login
vercel login
```

### 2. Variables d'environnement

Créer `.env.local` pour le développement local:
```bash
NODE_ENV=production
VERCEL_ENV=production
```

### 3. GitHub Actions Secrets

Ajouter les secrets au repo GitHub:

1. Aller à `Settings > Secrets and variables > Actions`

2. Ajouter les secrets:

**`VERCEL_TOKEN`**
- Aller à https://vercel.com/account/tokens
- Créer un nouveau token
- Copier et ajouter comme secret

**`VERCEL_ORG_ID`**
- Depuis vercel.json ou:
```bash
vercel env pull
cat .vercelignore | grep -i org
```

**`VERCEL_PROJECT_ID`**
- Depuis vercel.json ou:
```bash
vercel projects
```

### 4. Déploiement manuel

```bash
# Déployer production
vercel --prod

# Déployer preview
vercel

# Voir logs
vercel logs
```

### 5. Déploiement automatique

À chaque push sur `main`:

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main  # ← Déclenche GitHub Actions → Vercel
```

## Architecture déploiement

```
GitHub (bobsd84000-pixel/Claude-Squad)
    ↓ push sur main
GitHub Actions (.github/workflows/ci.yml)
    ↓ build + test réussis
Vercel (claude-squad.vercel.app)
    ↓ serve
Dashboard web + API REST
```

## Endpoints après déploiement

```
Production: https://claude-squad.vercel.app
Dashboard:  https://claude-squad.vercel.app/
API:        https://claude-squad.vercel.app/api/*
```

### Exemples requêtes

```bash
# Stats
curl https://claude-squad.vercel.app/api/stats

# Agents
curl https://claude-squad.vercel.app/api/agents

# Exécuter tâche
curl -X POST https://claude-squad.vercel.app/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "id": "task-001",
    "name": "Production test",
    "description": "Test sur production",
    "requiredCapabilities": ["coding"],
    "payload": {}
  }'
```

## Configuration Vercel.json

```json
{
  "version": 2,
  "name": "claude-squad",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nodejs",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Monitoring

### Logs Vercel

```bash
# Logs temps-réel
vercel logs --tail

# Logs d'une déploiement spécifique
vercel logs [deployment-url]
```

### Dashboard Vercel

1. Aller à https://vercel.com/dashboard
2. Sélectionner `claude-squad`
3. Voir:
   - Déploiements récents
   - Analytics
   - Environment variables
   - Domaines

## Rollback

```bash
# Si déploiement échoue
vercel rollback

# Redéployer une ancienne version
vercel deploy --prod [commit-sha]
```

## Domaines personnalisés

1. Vercel Dashboard → Settings → Domains
2. Ajouter domaine custom
3. Configurer DNS records (CNAME)

Exemple:
```
orchestrator.example.com → claude-squad.vercel.app
```

## Environnements multiples

### Preview (branches feature)
```bash
git checkout -b feature/new-agent
# Modifications...
git push origin feature/new-agent

# GitHub Actions crée auto un preview Vercel
# URL: claude-squad-git-feature-new-agent-*.vercel.app
```

### Staging (branche staging)
```bash
git push origin staging

# Déploiement auto vers staging.claude-squad.vercel.app
```

### Production (branche main)
```bash
git push origin main

# Déploiement auto vers claude-squad.vercel.app
```

## Troubleshooting

### Build échoue

```bash
# Vérifier logs localement
npm run build

# Vérifier version Node
node --version  # Doit être ≥ 18

# Vérifier dépendances
npm install
```

### Port déjà utilisé

```bash
# Changer port dans src/server.ts
const config = { port: 8080, host: '0.0.0.0' };
```

### Erreur de mémoire

Dans vercel.json:
```json
{
  "functions": {
    "src/index.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

## Monitoring en production

Les métriques automatiques de Vercel:
- Response time
- Error rate
- Uptime
- Request count

Accessible sur Dashboard → Analytics

## Coûts

- **Hobby** (gratuit): 100 déploiements/mois, 3000 minutes/mois
- **Pro** ($20/mois): Illimité, priorité support

Vérifier quota:
```bash
vercel env
```

## CI/CD Pipeline

```
Commit → GitHub
  ↓
GitHub Actions
  ├─ npm install
  ├─ npm run build (TypeScript)
  ├─ npm test (Tests unitaires)
  └─ Deploy to Vercel
    ↓
Vercel
  ├─ Build (npm run build)
  └─ Deploy (npm start)
    ↓
Production live
  └─ https://claude-squad.vercel.app
```

## Best practices

1. ✓ Toujours tester localement avant push
2. ✓ Utiliser des branches feature pour changements
3. ✓ Écrire tests pour nouvelles fonctionnalités
4. ✓ Monitorer les logs en production
5. ✓ Garder README et docs à jour
6. ✓ Version les variables d'env sensibles via Vercel UI
7. ✓ Utiliser rollback si problème détecté

## Support

- Docs Vercel: https://vercel.com/docs
- Vercel CLI: `vercel --help`
- Issues GitHub: https://github.com/bobsd84000-pixel/Claude-Squad/issues
