"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useUrlParam } from "@/hooks/useUrlParam";
import { formatPrice } from "@/lib/format";
import { useOrders } from "@/lib/order/store";
import { useOrderConfig } from "./OrderContext";

export function OrderConfirmation() {
  const [number] = useUrlParam("pedido");
  const orders = useOrders();
  const { units, shopName } = useOrderConfig();
  const order = orders.find((o) => o.number === number);
  const unit = units.find((u) => u.id === order?.unitId);

  if (!order) {
    return (
      <section className="page-x py-20 text-center">
        <h1 className="font-sans text-2xl font-semibold text-espresso">Pedido não encontrado</h1>
        <p className="mt-2 text-mocha">
          Os pedidos de demonstração ficam guardados só enquanto esta aba estiver aberta.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/minhas-compras"
            className="press inline-flex min-h-13 items-center justify-center rounded-full bg-night px-7 font-semibold text-white"
          >
            Minhas compras
          </Link>
          <Link
            href="/cardapio"
            className="press inline-flex min-h-13 items-center justify-center rounded-full border border-line-strong px-7 font-semibold text-espresso"
          >
            Voltar ao cardápio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="confirmado-title" className="bg-forest text-white">
      <div className="page-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_24rem] lg:items-start lg:gap-16 lg:py-24">
        <div>
          <svg width="88" height="88" viewBox="0 0 64 64" fill="none" aria-hidden className="text-mint">
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="currentColor"
              strokeWidth="3"
              className="check-ring"
              pathLength={160}
            />
            <path
              d="M21 33l8 8 15-17"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-mark"
              pathLength={40}
            />
          </svg>
          <h1 id="confirmado-title" className="mt-6 max-w-xl text-h1 text-white">
            Seu pedido de demonstração foi registrado!
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
            Este é um pedido simulado: a {shopName} não recebeu este pedido e nada foi cobrado. Ele serve para mostrar
            como o cliente acompanharia a compra.
          </p>
          <p className="mt-8 inline-flex flex-col rounded-2xl bg-white/10 px-5 py-4">
            <span className="text-sm text-white/75">Número do pedido de demonstração</span>
            <span className="text-2xl font-semibold tracking-wide tabular-nums">{order.number}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/minhas-compras?pedido=${order.number}`}
              className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-forest hover:bg-mint"
            >
              <Icon name="truck" size={20} />
              Acompanhar pedido
            </Link>
            <Link
              href="/cardapio"
              className="press inline-flex min-h-14 items-center justify-center rounded-full border border-white/60 px-7 text-base font-semibold text-white hover:bg-white hover:text-forest"
            >
              Voltar ao cardápio
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-porcelain p-6 text-espresso">
          <h2 className="font-sans text-lg font-semibold">Resumo</h2>
          <p className="mt-1 flex items-center gap-2 text-[0.9375rem] text-mocha">
            <Icon name="store" size={18} className="text-caramel-deep" />
            Unidade {unit?.name}
          </p>
          <ul className="mt-4 space-y-3 border-y border-line py-4 text-[0.9375rem]">
            {order.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>
                  <span className="font-semibold">
                    {l.quantity} × {l.name}
                  </span>
                  {l.details.length ? <span className="block text-sm text-mocha">{l.details.join(" · ")}</span> : null}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.unitCents * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between text-lg font-semibold">
            <span>Total simulado</span>
            <span className="tabular-nums text-caramel-deep">{formatPrice(order.totalCents)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
