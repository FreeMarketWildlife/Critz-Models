export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
  }

  off(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      return;
    }
    const handlers = this.listeners.get(eventName);
    handlers.delete(callback);
    if (handlers.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  emit(eventName, payload) {
    if (!this.listeners.has(eventName)) {
      return;
    }
    for (const callback of this.listeners.get(eventName)) {
      callback(payload);
    }
  }
}
