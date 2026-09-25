// Node.js globals
declare function setTimeout(callback: () => void, ms: number): NodeJS.Timeout;
declare function clearTimeout(timer: NodeJS.Timeout): void;

declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
};

declare const process: {
  exit(code?: number): never;
  cwd(): string;
  env: { [key: string]: string | undefined };
};

declare namespace NodeJS {
  interface Timeout {}
}

declare module 'child_process' {
  export function spawn(cmd: string, args: string[], opts?: any): any;
}

declare module 'fs' {
  export function readFileSync(path: string, encoding: 'utf8'): string;
  export function existsSync(path: string): boolean;
}

declare module 'http' {
  export function createServer(cb?: any): any;
  export type Server = any;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function dirname(path: string): string;
}

declare module 'url' {
  export function fileURLToPath(url: any): string;
}
