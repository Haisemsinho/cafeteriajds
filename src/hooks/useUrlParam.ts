"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("popstate", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("popstate", callback);
  };
}

export function setUrlParams(update: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(update)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((l) => l());
}

export function pushUrlParams(update: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(update)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.pushState(window.history.state, "", url);
  listeners.forEach((l) => l());
}

export function useUrlParam(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
  const set = useCallback((next: string | null) => setUrlParams({ [key]: next }), [key]);
  return [value, set] as const;
}
