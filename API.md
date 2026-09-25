# Claude Squad API

API REST pour orchestrer agents et monitorer exécution.

## Endpoints

### GET `/api/stats`
Statistiques globales du système.

**Response:**
```json
{
  "status": "success",
  "data": {
    "uptime": 12500,
    "requests": 5,
    "agents": [
      {
        "id": "claude-code",
        "name": "Claude Code",
        "enabled": true,
        "priority": 1,
        "capabilities": ["coding", "file-system", "terminal"]
      }
    ],
    "results": []
  },
  "timestamp": 1695753947123
}
```

### GET `/api/agents`
Liste tous les agents enregistrés.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "claude-code",
      "name": "Claude Code",
      "enabled": true,
      "priority": 1,
      "capabilities": ["coding", "file-system", "terminal"],
      "description": "Coding agent..."
    }
  ],
  "timestamp": 1695753947123
}
```

### GET `/api/results`
Récupère tous les résultats d'exécution.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "taskId": "task-001",
      "agentId": "claude-code",
      "status": "success",
      "output": { "processed": true },
      "timestamp": 1695753947000,
      "duration": 100
    }
  ],
  "timestamp": 1695753947123
}
```

### GET `/api/metrics`
Métriques de performance.

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalTasks": 5,
    "successRate": 1.0,
    "averageDuration": 102.5,
    "agentPerformance": {
      "claude-code": {
        "total": 5,
        "success": 5,
        "avgDuration": 102.5,
        "successRate": 1.0
      }
    }
  },
  "timestamp": 1695753947123
}
```

### POST `/api/execute`
Exécute une tâche sur les agents capables.

**Request Body:**
```json
{
  "id": "task-123",
  "name": "Fix bug",
  "description": "Corriger le bug de login",
  "requiredCapabilities": ["coding"],
  "payload": {
    "file": "auth.ts",
    "line": 42
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "taskId": "task-123",
      "agentId": "claude-code",
      "status": "success",
      "output": {
        "agent": "claude-code",
        "executed": true,
        "timestamp": "2026-09-25T18:30:00.000Z",
        "payload": { "file": "auth.ts", "line": 42 }
      },
      "timestamp": 1695753947000,
      "duration": 150
    }
  ],
  "timestamp": 1695753947123
}
```

### GET `/`
Affiche le Dashboard web.

## Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 400 | Requête invalide |
| 404 | Endpoint non trouvé |
| 500 | Erreur serveur |

## Exemples cURL

### Récupérer stats
```bash
curl http://localhost:3000/api/stats | jq
```

### Exécuter une tâche
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "id": "task-001",
    "name": "Test",
    "description": "Test task",
    "requiredCapabilities": ["coding"],
    "payload": {}
  }' | jq
```

### Obtenir métriques
```bash
curl http://localhost:3000/api/metrics | jq .data.successRate
```

## WebSocket (futur)

Connexion live pour updates temps-réel:
```typescript
const ws = new WebSocket('ws://localhost:3000/subscribe');
ws.onmessage = (event) => {
  const result = JSON.parse(event.data);
  console.log('Nouvelle exécution:', result);
};
```

## Authentification (futur)

API key header:
```bash
curl http://localhost:3000/api/stats \
  -H "X-API-Key: your-secret-key"
```

## Rate Limiting (futur)

Limites:
- 100 requêtes/minute par IP
- 10 exécutions de tâche/minute

Headers de réponse:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1695754000
```

## Erreurs

### Agent non capable
```json
{
  "status": "error",
  "error": "Aucun agent capable de: ['non-existent']",
  "timestamp": 1695753947123
}
```

### Timeout
```json
{
  "status": "error",
  "error": "Task timeout après 30000ms",
  "timestamp": 1695753947123
}
```

### Retry failure
```json
{
  "status": "error",
  "error": "Agent failed after 3 retries",
  "timestamp": 1695753947123
}
```
