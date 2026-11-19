"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { orderTotals } from "@/lib/order/pricing";
import { CartLines, DemoBadge, EmptyCart } from "./CartLines";
import { useResolvedCart } from "./OrderContext";

export function CartButton({ className, compact }: { className?: string; compact?: boolean }) {
  const pathname = usePathname();
  const { lines, unit } = useResolvedCart();
  const totals = orderTotals(lines);
  const dialog = useRef<HTMLDialogElement>(null);
  const [bumpKey, setBumpKey] = useState(0);
  const lastCount = useRef(totals.itemCount);

  useEffect(() => {
    if (totals.itemCount > lastCount.current) setBumpKey((k) => k + 1);
    lastCount.current = totals.itemCount;
  }, [totals.itemCount]);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  const open = (e: MouseEvent) => {
    if (compact || pathname === "/carrinho" || pathname.startsWith("/finalizar")) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    e.preventDefault();
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <Link
        href="/carrinho"
        onClick={open}
        aria-haspopup={compact ? undefined : "dialog"}
        className={cn(
          "relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10",
          className,
        )}
      >
        <Icon name="bag" size={20} />
        <span className={compact ? "sr-only xs:not-sr-only" : "md:sr-only lg:not-sr-only"}>Carrinho</span>
        <span
          key={bumpKey}
          className={cn(
            "grid min-w-6 place-items-center rounded-full px-1.5 text-xs leading-6 font-bold tabular-nums",
            totals.itemCount ? "bg-caramel-light text-night" : "bg-white/15 text-white",
            bumpKey > 0 && "badge-bump",
          )}
        >
          {totals.itemCount}
          <span className="sr-only">{totals.itemCount === 1 ? " item" : " itens"}</span>
        </span>
      </Link>

      {compact ? null : (
        <dialog ref={dialog} aria-labelledby="carrinho-gaveta-titulo" className="cart-drawer">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 id="carrinho-gaveta-titulo" className="font-sans text-xl font-semibold text-espresso">
                  Seu carrinho
                </h2>
                <p className="text-sm text-mocha">{unit ? `Unidade ${unit.name}` : "Unidade ainda não escolhida"}</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="-mr-2 grid size-11 place-items-center rounded-full text-espresso hover:bg-cream"
                aria-label="Fechar carrinho"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length ? <CartLines lines={lines} compact onNavigate={close} /> : <EmptyCart onNavigate={close} />}
            </div>

            {lines.length ? (
              <div className="border-t border-line bg-white px-6 pt-4 pb-6">
                <DemoBadge />
                <div className="mt-3 flex items-baseline justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span className="text-caramel-deep tabular-nums">{formatPrice(totals.subtotalCents)}</span>
                </div>
                <p className="text-sm text-mocha">Embalagem e entrega são calculadas na finalização.</p>
                <div className="mt-4 grid gap-2">
                  <Link
                    href="/finalizar"
                    onClick={close}
                    className="press inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-caramel-deep px-6 font-semibold text-white hover:bg-caramel-dark"
                  >
                    Finalizar pedido
                    <Icon name="arrowRight" size={18} />
                  </Link>
                  <Link
                    href="/carrinho"
                    onClick={close}
                    className="press inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong px-6 font-semibold text-espresso hover:border-espresso"
                  >
                    Ver carrinho completo
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </dialog>
      )}
    </>
  );
}
