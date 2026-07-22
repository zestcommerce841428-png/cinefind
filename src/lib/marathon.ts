"use client";

const STORAGE_KEY = "cinefind.marathon";

export interface MarathonItem {
  id: number;
  title: string;
  posterPath: string | null;
  runtime: number;
}

const EMPTY: MarathonItem[] = [];
let cache: MarathonItem[] = EMPTY;
const listeners = new Set<() => void>();

function readFromStorage(): MarathonItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function setCache(next: MarathonItem[]) {
  cache = next;
  listeners.forEach((cb) => cb());
}

export function isInMarathon(id: number): boolean {
  return cache.some((item) => item.id === id);
}

export function addToMarathon(item: MarathonItem) {
  try {
    const existing = readFromStorage().filter((v) => v.id !== item.id);
    const next = [...existing, item];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCache(next);
  } catch {
    // localStorage unavailable — no-op
  }
}

export function removeFromMarathon(id: number) {
  try {
    const next = readFromStorage().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCache(next);
  } catch {
    // ignore
  }
}

export function clearMarathon() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  setCache(EMPTY);
}

export function subscribeMarathon(callback: () => void): () => void {
  if (listeners.size === 0) {
    cache = readFromStorage();
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getMarathonSnapshot(): MarathonItem[] {
  return cache;
}

export function getMarathonServerSnapshot(): MarathonItem[] {
  return EMPTY;
}
