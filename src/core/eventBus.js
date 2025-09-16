export default class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const handlers = this.events.get(event);
    handlers.add(handler);

    return () => this.off(event, handler);
  }

  off(event, handler) {
    const handlers = this.events.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.events.delete(event);
    }
  }

  emit(event, payload) {
    const handlers = this.events.get(event);
    if (!handlers) return;

    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error handling event "${event}":`, error);
      }
    });
  }

  clear() {
    this.events.clear();
  }
}
