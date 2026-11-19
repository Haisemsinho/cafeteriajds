"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { dismissToast, holdToast, useToast } from "@/lib/order/toast";

export function Toaster() {
  const toast = useToast();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 lg:top-24"
      role="status"
      aria-live="polite"
    >
      {toast ? (
        <div
          key={toast.id}
          className="toast pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-night py-3 pr-2 pl-4 text-white shadow-[0_20px_40px_-20px_rgb(0_0_0/0.6)]"
          onMouseEnter={() => holdToast(true)}
          onMouseLeave={() => holdToast(false)}
          onFocus={() => holdToast(true)}
          onBlur={() => holdToast(false)}
        >
          <Icon name="checkCircle" size={22} className="shrink-0 text-caramel-light" />
          <p className="flex-1 text-[0.9375rem] font-medium">{toast.message}</p>
          {toast.action?.onClick ? (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick?.();
                dismissToast();
              }}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold text-night hover:bg-cream-soft"
            >
              {toast.action.label}
            </button>
          ) : toast.action?.href ? (
            <Link
              href={toast.action.href}
              onClick={dismissToast}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-white px-4 text-sm font-semibold text-night hover:bg-cream-soft"
            >
              {toast.action.label}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={dismissToast}
            className="grid size-11 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Fechar aviso"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
