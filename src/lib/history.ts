import type { ExamType } from "./exams";

/**
 * Only non-sensitive demonstration metadata is stored. No image data,
 * file names or personal information ever reaches storage.
 */
export interface DemoSession {
  id: string;
  type: ExamType;
  createdAt: string; // ISO timestamp
  format: "JPG" | "PNG";
  sizeKb: number;
}

export const HISTORY_STORAGE_KEY = "medscan.demo-history.v1";
export const MAX_HISTORY_ITEMS = 50;
const CHANGE_EVENT = "medscan:history-change";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isSession(value: unknown): value is DemoSession {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Record<keyof DemoSession, unknown>>;
  return (
    typeof v.id === "string" &&
    (v.type === "ecg" || v.type === "xray") &&
    typeof v.createdAt === "string" &&
    (v.format === "JPG" || v.format === "PNG") &&
    typeof v.sizeKb === "number"
  );
}

let cachedRaw: string | null | undefined;
let cachedList: DemoSession[] = [];

export function getHistory(): DemoSession[] {
  const raw = storage()?.getItem(HISTORY_STORAGE_KEY) ?? null;
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedList = Array.isArray(parsed) ? parsed.filter(isSession) : [];
  } catch {
    cachedList = [];
  }
  return cachedList;
}

function write(list: DemoSession[]) {
  const s = storage();
  if (!s) return;
  s.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function addSession(input: Omit<DemoSession, "id" | "createdAt"> & { id?: string; createdAt?: string }): DemoSession {
  const session: DemoSession = {
    id: input.id ?? createSessionId(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    type: input.type,
    format: input.format,
    sizeKb: Math.round(input.sizeKb),
  };
  write([session, ...getHistory()].slice(0, MAX_HISTORY_ITEMS));
  return session;
}

export function getSession(id: string): DemoSession | undefined {
  return getHistory().find((s) => s.id === id);
}

export function deleteSession(id: string) {
  write(getHistory().filter((s) => s.id !== id));
}

export function clearHistory() {
  write([]);
}

export function subscribeHistory(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === HISTORY_STORAGE_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
