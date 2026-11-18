"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "jds:selecao";
const empty: string[] = [];
const listeners = new Set<() => void>();

let memory: string[] = empty;
let lastRaw: string | null | undefined;

function parse(raw: string | null) {
  try {
    const data: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((x): x is string => typeof x === "string") : empty;
  } catch {
    return empty;
  }
}

function read() {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
  if (raw !== lastRaw) {
    lastRaw = raw;
    memory = parse(raw);
  }
  return memory;
}

function write(ids: string[]) {
  memory = ids;
  try {
    lastRaw = JSON.stringify(ids);
    window.localStorage.setItem(KEY, lastRaw);
  } catch {
    // sem localStorage (aba anonima no safari antigo), fica so na memoria
  }
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSavedItems() {
  const ids = useSyncExternalStore(subscribe, read, () => empty);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);

  const clear = useCallback(() => write(empty), []);

  return { ids, toggle, clear };
}
