"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { setUrlParams, useUrlParam } from "@/hooks/useUrlParam";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { lastStep, orderSteps } from "@/lib/order/status";
import { addToCart, advanceOrder, resetOrderStatus, setUnit, useOrders, type DemoOrder } from "@/lib/order/store";
import { showToast } from "@/lib/order/toast";
import { DemoBadge } from "./CartLines";
import { useOrderConfig } from "./OrderContext";
import { OrderTimeline } from "./OrderTimeline";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function MyOrders() {
  const orders = useOrders();
  const [openParam] = useUrlParam("pedido");
  const { units, catalog } = useOrderConfig();
  const open = openParam ?? (orders.length === 1 ? orders[0]?.number : null);

  const repeat = (order: DemoOrder) => {
    let added = 0;
    for (const l of order.lines) {
      const product = catalog.find((p) => p.id === l.productId && p.availability === "available");
      if (!product) continue;
      addToCart(product.id, l.selection, l.quantity);
      added += l.quantity;
    }
    setUnit(order.unitId);
    if (added) {
      showToast(added === 1 ? "1 item voltou para o carrinho." : `${added} itens voltaram para o carrinho.`, {
        label: "Ver carrinho",
        href: "/carrinho",
      });
    } else showToast("Os itens deste pedido não estão disponíveis agora.");
  };

  return (
    <div className="page-x pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-h2 text-espresso">Minhas compras</h1>
        <DemoBadge />
      </div>
      <p className="mt-3 max-w-2xl text-[0.9375rem] text-mocha">
        Pedidos de demonstração feitos neste aparelho. Eles ficam guardados só enquanto esta aba estiver aberta e não
        chegam à cafeteria.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-line bg-white px-6 py-14 text-center">
          <span className="grid size-20 place-items-center rounded-full bg-cream-soft text-caramel-deep">
            <Icon name="receipt" size={36} strokeWidth={1.3} />
          </span>
          <h2 className="mt-5 font-sans text-xl font-semibold text-espresso">Nenhuma compra por aqui ainda</h2>
          <p className="mt-2 max-w-sm text-mocha">
            Quando você finalizar um pedido de demonstração, ele aparece nesta página.
          </p>
          <Link
            href="/cardapio"
            className="press mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-caramel-deep px-7 font-semibold text-white hover:bg-caramel-dark"
          >
            Explorar o cardápio
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => {
            const unit = units.find((u) => u.id === order.unitId);
            const expanded = open === order.number;
            const current = orderSteps[order.status];
            const done = order.status >= lastStep;
            const next = orderSteps[Math.min(lastStep, order.status + 1)];
            return (
              <li key={order.number} className="rounded-3xl border border-line bg-white">
                <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="font-sans text-lg font-semibold text-espresso">Pedido {order.number}</h2>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                          done ? "bg-forest text-white" : "bg-mint text-forest",
                        )}
                      >
                        <Icon name={done ? "check" : (current?.icon ?? "clipboard")} size={15} strokeWidth={2} />
                        {current?.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.9375rem] text-mocha">
                      {dateFormat.format(new Date(order.createdAt))} · Unidade {unit?.name}
                    </p>
                    <p className="mt-2 text-[0.9375rem] text-espresso">
                      {order.lines.map((l) => `${l.quantity} × ${l.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="text-lg font-semibold text-caramel-deep tabular-nums">
                      {formatPrice(order.totalCents)}
                    </span>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`pedido-${order.number}`}
                      onClick={() => setUrlParams({ pedido: expanded ? "nenhum" : order.number })}
                      className="press inline-flex min-h-12 items-center gap-2 rounded-full bg-night px-5 font-semibold text-white hover:bg-walnut"
                    >
                      {expanded ? "Fechar detalhes" : "Ver detalhes"}
                      <span className="sr-only"> do pedido {order.number}</span>
                      <Icon
                        name="chevronRight"
                        size={16}
                        className={cn("transition-transform", expanded ? "-rotate-90" : "rotate-90")}
                      />
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <div
                    id={`pedido-${order.number}`}
                    className="grid gap-8 border-t border-line p-5 sm:p-6 lg:grid-cols-2 lg:gap-12"
                  >
                    <section aria-label="Andamento do pedido">
                      <h3 className="text-base font-semibold text-espresso">Andamento</h3>
                      <div className="mt-4">
                        <OrderTimeline status={order.status} />
                      </div>
                    </section>
                    <section aria-label="Itens do pedido">
                      <h3 className="text-base font-semibold text-espresso">Itens</h3>
                      <ul className="mt-3 space-y-3 text-[0.9375rem]">
                        {order.lines.map((l, i) => (
                          <li key={i} className="flex justify-between gap-3">
                            <span>
                              <span className="font-semibold">
                                {l.quantity} × {l.name}
                              </span>
                              {l.details.length ? (
                                <span className="block text-sm text-mocha">{l.details.join(" · ")}</span>
                              ) : null}
                            </span>
                            <span className="shrink-0 tabular-nums">{formatPrice(l.unitCents * l.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[0.9375rem]">
                        <div className="flex justify-between">
                          <dt className="text-mocha">Itens</dt>
                          <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-mocha">{order.packaging}</dt>
                          <dd className="tabular-nums">
                            {order.packagingCents ? formatPrice(order.packagingCents) : "Sem custo"}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-mocha">Entrega (exemplo)</dt>
                          <dd className="tabular-nums">{formatPrice(order.deliveryCents)}</dd>
                        </div>
                        <div className="flex justify-between text-base font-semibold">
                          <dt>Total simulado</dt>
                          <dd className="tabular-nums">{formatPrice(order.totalCents)}</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-sm text-mocha">
                        Entrega para {order.recipientFirstName}
                        {order.place ? `, ${order.place}` : ""}.{order.isGift ? " Para presente." : ""} Pagamento
                        simulado por {order.payment === "pix" ? "Pix" : "cartão"}.
                      </p>
                      <button
                        type="button"
                        onClick={() => repeat(order)}
                        className="press mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 font-semibold text-espresso hover:border-espresso"
                      >
                        <Icon name="bag" size={18} />
                        Repetir pedido
                      </button>
                    </section>

                    <section
                      aria-label="Área de testes da demonstração"
                      className="rounded-2xl border border-dashed border-line-strong bg-cream-soft p-4 lg:col-span-2"
                    >
                      <p className="text-sm font-semibold text-espresso">Área de testes da demonstração</p>
                      <p className="mt-0.5 text-sm text-mocha">
                        Não aparece para clientes. Na versão real, o andamento vem da operação da cafeteria.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={done}
                          onClick={() => {
                            advanceOrder(order.number, lastStep);
                            showToast(`Status: ${next?.label}.`);
                          }}
                          className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-deep disabled:opacity-50"
                        >
                          Avançar status
                          <Icon name="arrowRight" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => resetOrderStatus(order.number)}
                          className="press inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white px-4 text-sm font-semibold text-espresso"
                        >
                          Voltar ao início
                        </button>
                      </div>
                    </section>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
