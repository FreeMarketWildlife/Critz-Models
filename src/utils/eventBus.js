class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    const eventListeners = this.listeners.get(eventName);
    eventListeners.add(callback);

    return () => {
      eventListeners.delete(callback);
    };
  }

  emit(eventName, payload) {
    const eventListeners = this.listeners.get(eventName);
    if (!eventListeners || eventListeners.size === 0) {
      return;
    }

    eventListeners.forEach((callback) => {
      callback(payload ?? {});
    });
  }
}

export const eventBus = new EventBus();
