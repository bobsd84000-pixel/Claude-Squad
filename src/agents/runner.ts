import { spawn } from 'child_process';
import { Task, AgentContext } from '../types.js';

export interface AgentRunner {
  id: string;
  run(task: Task, timeoutMs: number, context?: AgentContext): Promise<unknown>;
}

export function runCommand(cmd: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${cmd}: timeout après ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', chunk => (stdout += chunk));
    child.stderr.on('data', chunk => (stderr += chunk));
    child.on('error', err => {
      clearTimeout(timer);
      reject(new Error(`${cmd}: ${err.message}`));
    });
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`${cmd} (code ${code}): ${stderr.trim() || stdout.trim()}`));
    });
  });
}

export function buildPrompt(task: Task): string {
  return `${task.name}\n\n${task.description}\n\nPayload: ${JSON.stringify(task.payload)}`;
}
