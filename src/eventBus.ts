export interface BusEvent {
  type: string;
  agentId: string;
  taskId: string;
  timestamp: number;
  data: unknown;
}

type EventListener = (event: BusEvent) => void;

export class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  subscribe(eventType: string, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);

    return () => {
      const list = this.listeners.get(eventType);
      if (list) {
        const idx = list.indexOf(listener);
        if (idx >= 0) list.splice(idx, 1);
      }
    };
  }

  publish(event: BusEvent): void {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        console.error(`EventBus error for ${event.type}:`, err);
      }
    });
  }
}
