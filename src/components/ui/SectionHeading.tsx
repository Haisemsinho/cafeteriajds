import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: ReactNode;
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  action,
  className,
  id,
}: Props) {
  const dark = tone === "dark";
  const text = (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className={cn("eyebrow mb-3", dark && "text-sand")}>{eyebrow}</p> : null}
      <Tag id={id} className={cn(Tag === "h1" ? "text-h1" : "text-h2", dark ? "text-paper" : "text-espresso")}>
        {title}
      </Tag>
      {intro ? <div className={cn("mt-4 text-lede", dark ? "text-sand" : "text-mocha")}>{intro}</div> : null}
    </div>
  );

  if (!action) return <div className={className}>{text}</div>;

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8", className)}>
      {text}
      <div className="shrink-0">{action}</div>
    </div>
  );
}
