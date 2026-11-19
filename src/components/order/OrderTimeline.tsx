import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { orderSteps } from "@/lib/order/status";

export function OrderTimeline({ status }: { status: number }) {
  return (
    <ol className="relative space-y-1">
      {orderSteps.map((s, i) => {
        const done = i < status;
        const current = i === status;
        const state = done ? "concluída" : current ? "etapa atual" : "pendente";
        return (
          <li key={s.label} aria-current={current ? "step" : undefined} className="relative flex gap-4 pb-5 last:pb-0">
            {i < orderSteps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-12 bottom-0 left-[1.375rem] w-0.5 -translate-x-1/2",
                  done ? "bg-forest" : "bg-cream",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative grid size-11 shrink-0 place-items-center rounded-full border-2",
                done && "border-forest bg-forest text-white",
                current && "border-forest bg-mint text-forest ring-4 ring-forest/15",
                !done && !current && "border-sand bg-white text-latte",
              )}
            >
              <Icon name={done ? "check" : s.icon} size={20} strokeWidth={done ? 2.4 : 1.6} />
            </span>
            <span className="pt-1.5">
              <span
                className={cn(
                  "block text-base font-semibold",
                  current ? "text-forest" : done ? "text-espresso" : "text-mocha",
                )}
              >
                {s.label}
              </span>
              <span className={cn("block text-sm", current ? "text-espresso" : "text-mocha")}>
                {current ? s.description : null}
                <span className={current ? "sr-only" : undefined}>
                  {current ? ` (${state})` : state === "concluída" ? "Concluída" : "Pendente"}
                </span>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
