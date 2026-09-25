declare global {
  var console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
  };

  function setTimeout(callback: () => void, ms: number): any;
  function clearTimeout(timeoutId: any): void;

  var JSON: {
    parse(text: string, reviver?: any): any;
    stringify(value: any, replacer?: any, space?: any): string;
  };

  var Date: {
    new(): Date;
    now(): number;
    parse(s: string): number;
  } & {
    prototype: {
      toISOString(): string;
    };
  };

  var Array: {
    from<T>(arrayLike: ArrayLike<T> | Iterable<T>): T[];
    isArray(arg: any): arg is any[];
  } & {
    prototype: any[];
  };

  var String: {
    prototype: string;
  };

  var Object: {
    entries<T extends Record<string, any>>(o: T): Array<[string, any]>;
    keys(o: any): string[];
  };

  var Map: {
    new<K, V>(): Map<K, V>;
    prototype: any;
  };

  interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
  }

  interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
  }

  interface Iterator<T> {
    next(): IteratorResult<T>;
  }

  interface IteratorResult<T> {
    done?: boolean;
    value?: T;
  }

  var Promise: {
    new<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    all<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]>;
  };

  interface PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
      onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
    ): PromiseLike<TResult1 | TResult2>;
  }

  var Error: {
    new(message?: string): Error;
    prototype: Error;
  };

  interface Error {
    name: string;
    message: string;
  }

  var process: {
    argv: string[];
    exit(code?: number): never;
    env: Record<string, string | undefined>;
  };
}

declare module 'fs' {
  export function readFileSync(path: string, encoding: BufferEncoding): string;
  export function writeFileSync(path: string, data: string, encoding?: BufferEncoding): void;
  export function existsSync(path: string): boolean;
}

export {};
