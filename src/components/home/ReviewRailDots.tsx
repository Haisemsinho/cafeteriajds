"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function ReviewRailDots({ count, listId }: { count: number; listId: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>("[data-review-item]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(items.indexOf(entry.target as HTMLElement));
        }
      },
      { root: list, threshold: 0.6 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [listId]);

  const go = (i: number) => {
    const list = document.getElementById(listId);
    const item = list?.querySelectorAll<HTMLElement>("[data-review-item]")[i];
    if (!list || !item) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({
      left: item.offsetLeft - list.offsetLeft - parseFloat(getComputedStyle(list).scrollPaddingLeft || "0"),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-1 md:hidden">
      <span className="sr-only" aria-live="polite">
        Avaliação {current + 1} de {count}
      </span>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => go(i)}
          aria-label={`Ir para a avaliação ${i + 1} de ${count}`}
          aria-current={i === current ? "true" : undefined}
          className="group grid size-11 place-items-center"
        >
          <span
            className={cn(
              "block h-2 rounded-full",
              i === current ? "w-6 bg-caramel-deep" : "w-2 bg-sand group-hover:bg-latte",
            )}
          />
        </button>
      ))}
    </div>
  );
}
