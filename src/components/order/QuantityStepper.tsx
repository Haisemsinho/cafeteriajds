"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MAX_QUANTITY } from "@/lib/order/pricing";

type Props = {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: "md" | "lg";
  min?: number;
  className?: string;
};

export function QuantityStepper({ value, onChange, label, size = "md", min = 1, className }: Props) {
  const btn = cn(
    "press grid shrink-0 place-items-center rounded-full text-espresso transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-latte disabled:hover:bg-transparent",
    size === "lg" ? "size-12" : "size-11",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border border-line-strong bg-white p-0.5", className)}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Diminuir quantidade de ${label.replace(/^Quantidade de /, "")}`}
      >
        <Icon name="minus" size={20} />
      </button>
      <output
        aria-live="polite"
        className={cn("min-w-10 text-center font-semibold tabular-nums", size === "lg" ? "text-lg" : "text-base")}
      >
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={`Aumentar quantidade de ${label.replace(/^Quantidade de /, "")}`}
      >
        <Icon name="plus" size={20} />
      </button>
    </div>
  );
}
