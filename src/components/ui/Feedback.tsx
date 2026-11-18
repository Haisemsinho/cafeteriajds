import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export function EmptyState({
  icon = "cup",
  title,
  children,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-line bg-paper px-6 py-14 text-center", className)}>
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-cream-soft text-caramel-deep">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="text-h3 text-espresso">{title}</h3>
      {children ? <div className="mt-3 max-w-md text-mocha">{children}</div> : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

type NoticeTone = "info" | "warning" | "special" | "setup";

const noticeTones: Record<NoticeTone, string> = {
  info: "border-line bg-paper",
  warning: "border-caramel-deep/40 bg-[#f6e6d6]",
  special: "border-caramel/40 bg-cream-soft",
  setup: "border-dashed border-caramel-deep/45 bg-paper",
};

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: NoticeTone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 rounded-lg border px-4 py-3.5 text-sm leading-relaxed text-espresso", noticeTones[tone], className)}>
      <Icon name={tone === "special" ? "sparkle" : "info"} size={17} className="mt-0.5 shrink-0 text-caramel-deep" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-mocha">{children}</div>
      </div>
    </div>
  );
}

export function SetupHint({ field, children, className }: { field: string; children?: ReactNode; className?: string }) {
  return (
    <Notice tone="setup" title={`Falta configurar: ${field}`} className={className}>
      {children ?? "Este bloco aparece no site assim que o dado for preenchido em src/content/business.ts."}
    </Notice>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-md", className)} />;
}
