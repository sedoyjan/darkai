type EventCallback<T = unknown> = (args?: T) => void;

class EventEmitter {
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  public on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback as EventCallback);
  }

  public off<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event)!.filter(cb => cb !== callback);
    if (callbacks.length > 0) {
      this.events.set(event, callbacks);
    } else {
      this.events.delete(event);
    }
  }

  public emit<T>(event: string, args?: T): void {
    if (!this.events.has(event)) return;

    this.events.get(event)!.forEach(callback => {
      (callback as EventCallback<T>)(args);
    });
  }
}

export const eventEmitter = new EventEmitter();
