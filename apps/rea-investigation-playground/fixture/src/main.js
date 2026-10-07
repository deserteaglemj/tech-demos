import { createWindow } from './window.js';
import { SearchIndex } from './search.js';
import { SyncQueue } from './sync.js';

const index = new SearchIndex();
const queue = new SyncQueue();

export async function boot() {
  const win = createWindow({ title: 'Inkdesk' });
  win.on('ready', () => {
    index.hydrateFromLocalStorage('inkdesk.notes.v1');
    queue.flushPending();
  });
  return { index, queue, win };
}
