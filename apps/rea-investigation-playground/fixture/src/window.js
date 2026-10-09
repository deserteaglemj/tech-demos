export function createWindow(opts) {
  const listeners = new Map();
  return {
    title: opts.title,
    on(event, fn) {
      listeners.set(event, fn);
      if (event === 'ready') queueMicrotask(fn);
    },
    emit(event) {
      listeners.get(event)?.();
    },
  };
}
