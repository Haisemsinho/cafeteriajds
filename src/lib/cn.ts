import type { CSSProperties } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function delay(step: number) {
  return { "--d": step } as CSSProperties;
}

export function stagger(index: number, max = 4) {
  return { "--i": Math.min(index, max) } as CSSProperties;
}
