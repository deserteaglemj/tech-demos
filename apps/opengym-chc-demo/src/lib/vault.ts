import { AppState, createSeed } from "../data/seed";
import type { WhoopBundle } from "../whoop/parse";
import { APP_VERSION, DATA_SCHEMA } from "./version";

const DB_NAME = "chc-customer-vault";
const DB_VERSION = 1;
const TRAINING_KEY = "training";
const WHOOP_KEY = "whoop";
const META_KEY = "meta";
const LEGACY_TRAINING = "chc-opengym-demo-v3";
const LEGACY_WHOOP = "chc-whoop-private-v1";

type Meta = {
  appVersion: string;
  dataSchema: number;
  skipWhoopAutoload?: boolean;
};

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function kvGet<T>(key: string): Promise<T | null> {
  const db = await openDb();
  const tx = db.transaction("kv", "readonly");
  const value = await requestToPromise(tx.objectStore("kv").get(key));
  db.close();
  return (value as T | undefined) ?? null;
}

async function kvSet(key: string, value: unknown) {
  const db = await openDb();
  const tx = db.transaction("kv", "readwrite");
  tx.objectStore("kv").put(value, key);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  db.close();
}

async function kvDelete(key: string) {
  const db = await openDb();
  const tx = db.transaction("kv", "readwrite");
  tx.objectStore("kv").delete(key);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

function mergeProduct(saved: AppState): AppState {
  const fresh = createSeed();
  const previous = new Map(saved.library.map((item) => [item.id, item]));
  const library = fresh.library.map((item) => {
    const prior = previous.get(item.id);
    if (!prior) return item;
    return {
      ...item,
      lastWeight: prior.lastWeight,
      lastReps: prior.lastReps,
      prWeight: prior.prWeight,
    };
  });
  const history = (saved.history ?? []).filter(
    (item) => item.id !== "h1" && item.id !== "h2" && item.id !== "h3",
  );
  const midSession = saved.session?.started && !saved.session.finished;
  return {
    ...fresh,
    athlete: saved.athlete?.trim() || fresh.athlete,
    units: saved.units ?? fresh.units,
    bodyWeight: saved.bodyWeight ?? fresh.bodyWeight,
    bodyGoal: saved.bodyGoal ?? fresh.bodyGoal,
    bodyHistory: saved.bodyHistory ?? [],
    history,
    completedSessions: history.length,
    library,
    routines: fresh.routines,
    week: fresh.week,
    session: midSession ? saved.session : fresh.session,
  };
}

function readLegacyTraining(): AppState | null {
  try {
    const raw = localStorage.getItem(LEGACY_TRAINING);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.routines || !parsed.library) return null;
    return mergeProduct(parsed);
  } catch {
    return null;
  }
}

export async function loadWhoop(): Promise<WhoopBundle | null> {
  const stored = await kvGet<WhoopBundle>(WHOOP_KEY);
  if (stored?.cycles?.length) return stored;
  try {
    const raw = localStorage.getItem(LEGACY_WHOOP);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WhoopBundle;
    if (!parsed.cycles?.length) return null;
    await kvSet(WHOOP_KEY, parsed);
    localStorage.removeItem(LEGACY_WHOOP);
    return parsed;
  } catch {
    return null;
  }
}

export async function saveWhoop(bundle: WhoopBundle) {
  await kvSet(WHOOP_KEY, bundle);
  const meta = await kvGet<Meta>(META_KEY);
  await kvSet(META_KEY, {
    appVersion: meta?.appVersion ?? APP_VERSION,
    dataSchema: meta?.dataSchema ?? DATA_SCHEMA,
    skipWhoopAutoload: false,
  });
  localStorage.removeItem(LEGACY_WHOOP);
}

export async function clearWhoop() {
  await kvDelete(WHOOP_KEY);
  const meta = await kvGet<Meta>(META_KEY);
  await kvSet(META_KEY, {
    appVersion: meta?.appVersion ?? APP_VERSION,
    dataSchema: meta?.dataSchema ?? DATA_SCHEMA,
    skipWhoopAutoload: true,
  });
  localStorage.removeItem(LEGACY_WHOOP);
}

export async function whoopAutoloadAllowed() {
  const meta = await kvGet<Meta>(META_KEY);
  return !meta?.skipWhoopAutoload;
}

export async function saveTraining(state: AppState) {
  await kvSet(TRAINING_KEY, state);
}

export async function hydrateCustomer(): Promise<{
  training: AppState;
  updateNote: string | null;
}> {
  const meta = await kvGet<Meta>(META_KEY);
  let training = await kvGet<AppState>(TRAINING_KEY);
  const hadVault = Boolean(training?.history);

  if (!training) {
    training = readLegacyTraining() ?? createSeed();
    localStorage.removeItem(LEGACY_TRAINING);
    await kvSet(TRAINING_KEY, training);
  } else {
    training = mergeProduct(training);
  }

  const updateNote =
    hadVault && meta?.appVersion && meta.appVersion !== APP_VERSION
      ? `Updated to ${APP_VERSION}. Your workouts and Whoop data stayed on this device.`
      : null;

  await kvSet(META_KEY, {
    appVersion: APP_VERSION,
    dataSchema: DATA_SCHEMA,
  });

  return { training, updateNote };
}

export async function replaceTraining(state: AppState) {
  await kvSet(TRAINING_KEY, state);
}
