"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { describeNext, formatPeriods, formatTime, getOpenState, weekdayNames, zonedNow } from "@/lib/hours";
import type { OpeningHours, Weekday } from "@/types/content";

const weekOrder: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

function subscribeClock(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

const currentMinute = () => Math.floor(Date.now() / 60_000);

function formatDay(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

export function BusinessHours({ hours }: { hours: OpeningHours }) {
  const minute = useSyncExternalStore(subscribeClock, currentMinute, () => null);
  const now = minute === null ? null : new Date(minute * 60_000);
  const reliable = hours.status === "verified";
  const state = now && reliable ? getOpenState(hours, now) : null;
  const today = now ? zonedNow(hours.timezone, now) : null;
  const exceptions = hours.exceptions.filter((e) => !today || e.date >= today.date);

  return (
    <div>
      {state ? (
        <p
          className={cn(
            "mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium",
            state.open ? "bg-[#e3ecdc] text-[#2f4a26]" : "bg-espresso/8 text-espresso",
          )}
        >
          <span aria-hidden className={cn("size-2 rounded-full", state.open ? "bg-[#4f7a3f]" : "bg-caramel-deep")} />
          {state.open
            ? `Aberto agora, fecha às ${formatTime(state.closesAt)}`
            : `Fechado agora${state.next ? `, ${describeNext(state.next)}` : ""}`}
          {state.exception ? <span className="font-normal text-mocha">({state.exception})</span> : null}
        </p>
      ) : null}

      <table className="w-full text-[0.9375rem]">
        <caption className="sr-only">Horário de funcionamento</caption>
        <tbody className="divide-y divide-line">
          {weekOrder.map((day) => {
            const isToday = today?.weekday === day;
            return (
              <tr key={day} className={cn(isToday && "font-semibold")} aria-current={isToday ? "date" : undefined}>
                <th scope="row" className="py-2.5 pr-4 text-left font-normal text-mocha">
                  {weekdayNames[day]}
                  {isToday ? <span className="ml-2 text-xs text-caramel-deep uppercase">hoje</span> : null}
                </th>
                <td className="py-2.5 text-right text-espresso">{formatPeriods(hours.week[day])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {exceptions.length ? (
        <div className="mt-6 rounded-lg bg-cream-soft px-4 py-3 text-sm">
          <p className="font-semibold text-espresso">Datas especiais</p>
          <ul className="mt-2 space-y-1 text-mocha">
            {exceptions.map((e) => (
              <li key={e.date}>
                {formatDay(e.date)}, {e.label}: {formatPeriods(e.periods)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
