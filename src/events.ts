export interface Event {
  id: string;
  type: string;
  source: string;
  target?: string;
  payload: Record<string, unknown>;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export type EventListener = (event: Event) => Promise<void> | void;

export class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize = 1000;

  subscribe(eventType: string, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

    // Retourner fonction de désabonnement
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  async emit(event: Event): Promise<void> {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const listeners = this.listeners.get(event.type) || [];
    // @ts-ignore
    await Promise.all(listeners.map(l => l(event)));
  }

  getHistory(eventType?: string): Event[] {
    if (!eventType) return [...this.eventHistory];
    return this.eventHistory.filter(e => e.type === eventType);
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}

export const globalEventBus = new EventBus();
