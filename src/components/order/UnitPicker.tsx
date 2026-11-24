"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { useUrlParam } from "@/hooks/useUrlParam";
import { cn } from "@/lib/cn";
import { setUnit, useUnit } from "@/lib/order/store";
import type { UnitId } from "@/types/content";
import { useOrderConfig } from "./OrderContext";

export function useUnitFromUrl() {
  const [param, setParam] = useUrlParam("unidade");
  const unitId = useUnit();
  const applied = useRef<string | null>(null);
  useEffect(() => {
    if ((param === "centro" || param === "br116") && param !== applied.current) {
      applied.current = param;
      setUnit(param);
    }
  }, [param]);
  return { unitId, setParam };
}

type Props = {
  title?: string;
  compact?: boolean;
  syncUrl?: boolean;
  invalid?: boolean;
  className?: string;
  onPick?: (id: UnitId) => void;
};

export function UnitPicker({ title = "Escolha a unidade", compact, syncUrl, invalid, className, onPick }: Props) {
  const { units } = useOrderConfig();
  const { unitId, setParam } = useUnitFromUrl();

  const pick = (id: UnitId) => {
    setUnit(id);
    if (syncUrl) setParam(id);
    onPick?.(id);
  };

  return (
    <fieldset className={className} id="unidade">
      <legend className={cn("font-semibold text-espresso", compact ? "text-sm" : "text-base")}>{title}</legend>
      {invalid && !unitId ? (
        <p className="mt-1.5 text-sm font-medium text-alert" role="alert">
          Escolha em qual unidade você quer fazer o pedido.
        </p>
      ) : null}
      <div className={cn("mt-3 grid gap-2", compact ? "grid-cols-2" : "sm:grid-cols-2")}>
        {units.map((u) => {
          const active = u.id === unitId;
          return (
            <label
              key={u.id}
              className={cn(
                "press relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel-deep",
                active
                  ? "border-night bg-night text-white"
                  : "border-line-strong bg-white text-espresso hover:border-espresso",
                invalid && !unitId && "border-alert",
              )}
            >
              <input
                type="radio"
                name="unidade"
                value={u.id}
                checked={active}
                onChange={() => pick(u.id)}
                className="sr-only"
              />
              <Icon name="store" size={22} className={active ? "text-caramel-light" : "text-caramel-deep"} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{u.name}</span>
                {!compact ? (
                  <span className={cn("block text-sm", active ? "text-white/80" : "text-mocha")}>{u.summary}</span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border",
                  active ? "border-caramel-light bg-caramel-light text-night" : "border-line-strong",
                )}
              >
                {active ? <Icon name="check" size={14} strokeWidth={2.4} /> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
