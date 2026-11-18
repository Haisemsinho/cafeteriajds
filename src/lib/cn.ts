import type { CSSProperties } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function delay(step: number) {
  return { "--d": step } as CSSProperties;
}
