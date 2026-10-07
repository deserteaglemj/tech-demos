export class SyncQueue {
  constructor() {
    this.pending = [];
  }
  enqueue(op) {
    this.pending.push({ ...op, at: Date.now() });
  }
  flushPending() {
    const batch = this.pending.splice(0);
    return batch;
  }
}
