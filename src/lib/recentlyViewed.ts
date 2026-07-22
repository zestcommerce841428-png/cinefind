"use client";

const STORAGE_KEY = "cinefind.recentlyViewed";
const MAX_ITEMS = 20;

export interface RecentlyViewedItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  voteAverage: number;
  viewedAt: number;
}

const EMPTY: RecentlyViewedItem[] = [];
let cache: RecentlyViewedItem[] = EMPTY;
const listeners = new Set<() => void>();

function readFromStorage(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function setCache(next: RecentlyViewedItem[]) {
  cache = next;
  listeners.forEach((cb) => cb());
}

/** Imperative read — use in non-component code. Fresh from storage on first call after hydration. */
export function getRecentlyViewed(): RecentlyViewedItem[] {
  return cache;
}

export function addRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt">) {
  try {
    const existing = readFromStorage().filter(
      (v) => !(v.id === item.id && v.mediaType === item.mediaType)
    );
    const next = [{ ...item, viewedAt: Date.now() }, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCache(next);
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — no-op
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  setCache(EMPTY);
}

/** React 19 useSyncExternalStore bindings. */
export function subscribeRecentlyViewed(callback: () => void): () => void {
  if (listeners.size === 0) {
    // First subscriber: hydrate the cache from storage.
    cache = readFromStorage();
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getRecentlyViewedSnapshot(): RecentlyViewedItem[] {
  return cache;
}

export function getRecentlyViewedServerSnapshot(): RecentlyViewedItem[] {
  return EMPTY;
}
