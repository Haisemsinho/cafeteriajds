import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "dark" | "draft";

const tones: Record<Tone, string> = {
  neutral: "bg-cream-soft text-walnut",
  accent: "bg-caramel-deep text-white",
  dark: "bg-night text-white",
  draft: "bg-white text-caramel-deep ring-1 ring-inset ring-caramel-deep/30",
};

export function Tag({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs leading-none font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DraftTag({ className, label = "Exemplo" }: { className?: string; label?: string }) {
  return (
    <Tag tone="draft" className={className}>
      {label}
    </Tag>
  );
}
