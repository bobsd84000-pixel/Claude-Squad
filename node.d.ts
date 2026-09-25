declare module 'fs' {
  export function readFileSync(path: string, encoding: string): string;
}

declare var console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
};

declare function setTimeout(callback: () => void, ms: number): any;
