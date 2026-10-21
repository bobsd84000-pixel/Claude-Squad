# Graph Report - Claude-Squad  (2026-10-21)

## Corpus Check
- 11 files · ~1,063 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 1 file(s) not represented in the graph (top: (none) 1)

## Summary
- 82 nodes · 125 edges · 6 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `73ba9ffa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- Orchestrator
- compilerOptions
- agents/index.ts
- Claude Squad
- scripts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `Orchestrator` - 13 edges
3. `Task` - 9 edges
4. `TaskResult` - 6 edges
5. `scripts` - 5 edges
6. `AgentRunner` - 5 edges
7. `Agent` - 5 edges
8. `OrchestratorConfig` - 5 edges
9. `Claude Squad` - 5 edges
10. `main()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Workflow` --references--> `Task`  [INFERRED]
  README.md → src/types.ts
- `main()` --calls--> `Orchestrator`  [EXTRACTED]
  src/index.ts → src/orchestrator.ts
- `Orchestrator` --references--> `Agent`  [EXTRACTED]
  src/orchestrator.ts → src/types.ts
- `Orchestrator` --references--> `OrchestratorConfig`  [EXTRACTED]
  src/orchestrator.ts → src/types.ts
- `Orchestrator` --references--> `TaskResult`  [EXTRACTED]
  src/orchestrator.ts → src/types.ts

## Import Cycles
- None detected.

## Communities (6 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.11
Nodes (18): author, dependencies, dotenv, description, devDependencies, ts-node, @types/node, typescript (+10 more)

### Community 1 - "Orchestrator"
Cohesion: 0.26
Nodes (7): getRunner(), main(), Orchestrator, Agent, OrchestratorConfig, TaskResult, WorkflowConfig

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution (+9 more)

### Community 3 - "agents/index.ts"
Cohesion: 0.33
Nodes (7): claudeCode, codex, runners, AgentRunner, buildPrompt(), runCommand(), Task

### Community 4 - "Claude Squad"
Cohesion: 0.22
Nodes (8): Agents activés, Agents futurs, Architecture, Claude Squad, Démarrage, Roadmap, Usage, Workflow

### Community 5 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, start, test

## Knowledge Gaps
- **4 isolated node(s):** `dotenv`, `@types/node`, `ts-node`, `typescript`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 46 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Task` connect `agents/index.ts` to `Orchestrator`, `Claude Squad`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `dotenv`, `@types/node`, `ts-node` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `Workflow` connect `Claude Squad` to `agents/index.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._