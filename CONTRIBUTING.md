# Contribution à Claude Squad

Merci de votre intérêt dans Claude Squad! Guide pour contribuer.

## Démarrage

```bash
# Fork le repo
git clone https://github.com/[votre-username]/Claude-Squad.git
cd Claude-Squad

# Créer branche feature
git checkout -b feature/nom-feature

# Installer et tester
npm install
npm run build
npm test
```

## Architecture du projet

```
src/
├── index.ts              # Point d'entrée
├── orchestrator.ts       # Core orchestration engine
├── types.ts             # Interfaces TypeScript
├── events.ts            # EventBus pour inter-agent communication
├── api.ts               # API Dashboard
├── server.ts            # Serveur HTTP
├── globals.d.ts         # Déclarations types globales
├── orchestrator.test.ts # Tests unitaires
└── agents/
    ├── index.ts
    ├── claude-code.agent.ts
    └── codex.agent.ts
```

## Ajouter un nouvel agent

### 1. Créer le fichier agent

`src/agents/my-agent.agent.ts`:
```typescript
import { Agent, Task, TaskResult } from '../types.js';

export class MyAgent implements Agent {
  id = 'my-agent';
  name = 'My Agent';
  enabled = true;
  priority = 3;
  capabilities = ['feature1', 'feature2'];
  description = 'Description courte';

  async execute(task: Task): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      // Votre logique ici
      
      return {
        taskId: task.id,
        agentId: this.id,
        status: 'success',
        output: { /* résultats */ },
        timestamp: startTime,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        taskId: task.id,
        agentId: this.id,
        status: 'error',
        output: { error: String(error) },
        timestamp: startTime,
        duration: Date.now() - startTime,
      };
    }
  }
}
```

### 2. Exporter dans `src/agents/index.ts`

```typescript
export { MyAgent } from './my-agent.agent.js';
```

### 3. Enregistrer dans `agents.config.json`

```json
{
  "agents": {
    "my-agent": {
      "enabled": false,
      "priority": 3,
      "description": "Description",
      "capabilities": ["feature1", "feature2"]
    }
  }
}
```

### 4. Ajouter tests dans `orchestrator.test.ts`

```typescript
test('MyAgent execute task', async () => {
  // Votre test ici
});
```

## Convention de code

### TypeScript

- ✓ Utiliser `const` plutôt que `let`
- ✓ Typer tous les paramètres et retours
- ✓ Éviter `any` sauf avec `// @ts-ignore`
- ✓ Pas de commentaires inutiles (le code doit être auto-documenté)

### Nommage

- Classes: PascalCase (`MyAgent`)
- Fonctions: camelCase (`executeTask`)
- Constantes: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Privé: préfixe `_` (`_internal`)

### Structure fichier

```typescript
// Imports
import { ... } from '...';

// Types/Interfaces (si nécessaire)
interface MyInterface { }

// Classe/Fonction principale
export class MyClass { }

// Fonctions export
export function myFunction() { }
```

## Commits

Format conventionnel:

```
type(scope): message

Explication détaillée si nécessaire.

Closes #123
```

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction bug
- `docs`: Documentation
- `test`: Tests
- `refactor`: Refactoring
- `perf`: Performance
- `ci`: CI/CD
- `chore`: Maintenance

Exemples:

```
feat(agents): ajouter agent OpenCode
fix(orchestrator): retry logic avec backoff
docs(api): documenter endpoint /api/metrics
test(agents): ajouter tests pour codex
```

## Pull Requests

1. **Avant de commencer:**
   - Créer une issue pour discuter du changement
   - Attendre validation

2. **Faire votre changement:**
   ```bash
   npm run build
   npm test
   npm run server  # Tester le dashboard
   ```

3. **Push et PR:**
   - Title court et clair
   - Description détaillée
   - Reference l'issue (#123)
   - Screenshots/videos si UI change

4. **Template PR:**
   ```markdown
   ## Changement
   Quoi et pourquoi?

   ## Testing
   Comment vous l'avez testé?

   ## Checklist
   - [ ] Tests ajoutés/mis à jour
   - [ ] Documentation mise à jour
   - [ ] Build passe
   - [ ] Pas de breaking changes
   ```

## Tests

### Écrire un test

```typescript
test('Description du test', async () => {
  // Arrange
  const config = { /* config */ };
  const orchestrator = new Orchestrator(config);

  // Act
  const result = await orchestrator.executeTask(task);

  // Assert
  if (result.status !== 'success') {
    throw new Error('Devrait être success');
  }
});
```

### Exécuter les tests

```bash
npm test                    # Tous les tests
npm test -- agents.test     # Tests spécifiques
```

## Documentation

### README.md
- Architecture claire
- Installation/usage
- Examples
- Roadmap

### API.md
- Tous les endpoints
- Exemples cURL
- Codes d'erreur
- Authentification future

### DEPLOYMENT.md
- Steps déploiement Vercel
- Monitoring
- Troubleshooting

### Code comments
Minimiser, ne commenter que:
- Logique complexe
- Décisions architecturales
- Workarounds ou hacks

## Performance

- Éviter les allocations inutiles
- Utiliser cache quand approprié
- Minimiser les appels réseau
- Profiler avec DevTools Node.js

## Sécurité

- ✓ Valider inputs utilisateur
- ✓ Pas de secrets en code source
- ✓ Utiliser environment variables
- ✓ Sanitizer les outputs
- ✓ CORS bien configuré

## Signaler un bug

Title: `[BUG] Brève description`

Body:
```markdown
## Description
Explication détaillée.

## Reproduction
Étapes pour reproduire:
1. ...
2. ...

## Expected
Behavior attendu.

## Actual
Behavior réel.

## Environment
- Node: 20.x
- OS: Linux/Mac/Windows
- Browser: N/A
```

## Suggestions de features

Title: `[FEATURE] Brève description`

Body:
```markdown
## Motivation
Pourquoi cette feature?

## Solution proposée
Votre idée.

## Alternatives
Autres approches?

## Example
Code exemple d'utilisation.
```

## Merging

Une PR est ready à merger si:
- ✓ Tous les tests passent
- ✓ Build réussit
- ✓ Reviewed et approved
- ✓ Pas de conflicts avec main
- ✓ Documentation mise à jour

Merge strategy: **Squash and merge** (garder git history propre)

## Release

Version: `MAJOR.MINOR.PATCH`

Steps:
```bash
# Mettre à jour version dans package.json
# Créer tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions crée la release automatiquement
```

## License

Tous les contributions sont sous Apache 2.0 license.
En contribuant, vous acceptez la license.

## Questions?

- GitHub Discussions
- Issues
- Email: [contact info]

Merci de votre contribution! 🙏
