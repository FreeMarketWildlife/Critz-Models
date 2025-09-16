export const createEventBus = () => {
  const listeners = new Map();

  return {
    on(event, handler) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(handler);
      return () => this.off(event, handler);
    },
    off(event, handler) {
      const handlers = listeners.get(event);
      if (!handlers) return;
      handlers.delete(handler);
      if (handlers.size === 0) {
        listeners.delete(event);
      }
    },
    emit(event, payload) {
      const handlers = listeners.get(event);
      if (!handlers) return;
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Event handler for "${event}" failed`, error);
        }
      });
    },
  };
};
