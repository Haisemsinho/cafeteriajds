"use client";

import { useSyncExternalStore } from "react";

export type Toast = { id: number; message: string; action?: { label: string; href?: string; onClick?: () => void } };

let current: Toast | null = null;
let counter = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function showToast(message: string, action?: Toast["action"]) {
  current = { id: ++counter, message, action };
  clearTimeout(timer);
  timer = setTimeout(dismissToast, action ? 6000 : 4000);
  emit();
}

export function dismissToast() {
  current = null;
  emit();
}

export function holdToast(hold: boolean) {
  clearTimeout(timer);
  if (!hold && current) timer = setTimeout(dismissToast, 3000);
}

export function useToast() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => null,
  );
}
