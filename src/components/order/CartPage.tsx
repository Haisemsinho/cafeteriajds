"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatPrice, plural } from "@/lib/format";
import { orderTotals } from "@/lib/order/pricing";
import { CartLines, DemoBadge, EmptyCart, SummaryRows } from "./CartLines";
import { useResolvedCart } from "./OrderContext";
import { CheckoutLink } from "./CheckoutLink";
import { UnitPicker } from "./UnitPicker";

export function CartPage() {
  const { lines, unitId } = useResolvedCart();
  const totals = orderTotals(lines);
  const blocked = lines.some((l) => !l.available);
  const [tried, setTried] = useState(false);
  const canContinue = Boolean(unitId) && !blocked;

  return (
    <div className="page-x pt-8 pb-16 sm:pt-12 sm:pb-24">
      <Link
        href="/cardapio"
        className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-espresso hover:text-caramel-deep"
      >
        <Icon name="chevronLeft" size={18} />
        Continuar comprando
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-h2 text-espresso">Seu carrinho</h1>
        <DemoBadge />
      </div>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-line bg-white">
          <EmptyCart />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div>
            <UnitPicker
              title="Unidade do pedido"
              invalid={tried}
              className="rounded-3xl border border-line bg-white p-5 sm:p-6"
            />
            <section
              aria-labelledby="itens-title"
              className="mt-6 rounded-3xl border border-line bg-white px-5 sm:px-6"
            >
              <h2 id="itens-title" className="pt-5 font-sans text-lg font-semibold text-espresso">
                {plural(totals.itemCount, "item", "itens")}
              </h2>
              <CartLines lines={lines} />
            </section>
          </div>

          <aside aria-labelledby="resumo-title" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
              <h2 id="resumo-title" className="font-sans text-lg font-semibold text-espresso">
                Resumo
              </h2>
              <div className="mt-4">
                <SummaryRows
                  rows={[{ label: "Subtotal dos itens", cents: totals.subtotalCents }]}
                  total={totals.subtotalCents}
                />
              </div>
              <p className="mt-3 text-sm text-mocha">Embalagem e entrega aparecem na próxima etapa.</p>
            </div>

            <div className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-line bg-porcelain/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              {tried && !canContinue ? (
                <p role="alert" className="mb-2 text-sm font-medium text-alert">
                  {!unitId
                    ? "Escolha a unidade do pedido para continuar."
                    : "Remova os itens indisponíveis para continuar."}
                </p>
              ) : null}
              <CheckoutLink
                guard={() => {
                  if (canContinue) return true;
                  setTried(true);
                  document.getElementById("unidade")?.scrollIntoView({ block: "center", behavior: "smooth" });
                  return false;
                }}
                className="press flex min-h-14 w-full items-center justify-between gap-3 rounded-full bg-caramel-deep px-6 text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgb(156_95_34/0.8)] hover:bg-caramel-dark"
              >
                <span className="flex items-center gap-2">
                  Finalizar pedido
                  <Icon name="arrowRight" size={18} />
                </span>
                <span className="tabular-nums">{formatPrice(totals.subtotalCents)}</span>
              </CheckoutLink>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
