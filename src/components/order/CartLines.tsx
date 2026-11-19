"use client";

import Link from "next/link";
import { ProductVisual } from "@/components/menu/ProductParts";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { describeSelection, lineTotal } from "@/lib/order/pricing";
import { removeLine, restoreLine, updateLine } from "@/lib/order/store";
import { showToast } from "@/lib/order/toast";
import type { ResolvedLine } from "./OrderContext";
import { QuantityStepper } from "./QuantityStepper";

export function CartLines({
  lines,
  compact,
  onNavigate,
}: {
  lines: ResolvedLine[];
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const remove = (line: ResolvedLine) => {
    const removed = removeLine(line.id);
    if (removed)
      showToast(`${line.product.name} removido do carrinho.`, {
        label: "Desfazer",
        onClick: () => restoreLine(removed),
      });
  };

  return (
    <ul className="divide-y divide-line">
      {lines.map((line) => {
        const details = describeSelection(line.product, line.selection);
        return (
          <li
            key={line.id}
            className={cn("grid grid-cols-[4.5rem_1fr] gap-4 py-5", !compact && "sm:grid-cols-[6.5rem_1fr] sm:gap-5")}
          >
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-oat",
                !line.available && "opacity-60",
              )}
            >
              <ProductVisual product={line.product} sizes="104px" idSuffix={`-c-${line.id}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base leading-snug font-semibold text-espresso">{line.product.name}</h3>
                  {details.length ? (
                    <ul className="mt-1 text-sm leading-relaxed text-mocha">
                      {details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ) : null}
                  {line.selection.note ? (
                    <p className="mt-1 text-sm break-words text-mocha">
                      <span className="font-semibold text-espresso">Observação:</span> {line.selection.note}
                    </p>
                  ) : null}
                  {!line.available ? (
                    <p className="mt-1 text-sm font-semibold text-alert">
                      Indisponível nesta unidade. Remova para continuar.
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-right text-base font-semibold text-espresso tabular-nums">
                  {formatPrice(lineTotal(line.unitCents, line.quantity))}
                  <span className="block text-xs font-normal text-mocha">{formatPrice(line.unitCents)} cada</span>
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                <QuantityStepper
                  value={line.quantity}
                  onChange={(n) => updateLine(line.id, { quantity: n })}
                  label={`Quantidade de ${line.product.name}`}
                />
                <Link
                  href={`/cardapio/${line.product.slug}?editar=${line.id}`}
                  onClick={onNavigate}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-caramel-deep hover:bg-cream-soft hover:text-caramel-dark"
                >
                  <Icon name="edit" size={17} />
                  Editar
                  <span className="sr-only"> {line.product.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => remove(line)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-mocha hover:bg-cream-soft hover:text-espresso"
                >
                  <Icon name="trash" size={17} />
                  Remover
                  <span className="sr-only"> {line.product.name}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function SummaryRows({
  rows,
  total,
}: {
  rows: { label: string; cents: number; note?: string }[];
  total: number;
}) {
  return (
    <dl className="space-y-2.5 text-[0.9375rem]">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4">
          <dt className="text-mocha">
            {r.label}
            {r.note ? <span className="block text-xs">{r.note}</span> : null}
          </dt>
          <dd className="tabular-nums">{r.cents ? formatPrice(r.cents) : "Grátis"}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-line pt-3 text-lg font-semibold">
        <dt>Total</dt>
        <dd className="text-caramel-deep tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-cream-soft text-caramel-deep">
        <Icon name="bag" size={36} strokeWidth={1.3} />
      </span>
      <h2 className="mt-5 font-sans text-xl font-semibold text-espresso">Seu carrinho está vazio</h2>
      <p className="mt-2 max-w-xs text-mocha">Escolha um café ou um doce no cardápio e ele aparece aqui.</p>
      <Link
        href="/cardapio"
        onClick={onNavigate}
        className="press mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-caramel-deep px-7 font-semibold text-white hover:bg-caramel-dark"
      >
        Explorar o cardápio
        <Icon name="arrowRight" size={18} />
      </Link>
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-cream-soft px-3 py-1 text-xs font-semibold text-caramel-deep",
        className,
      )}
    >
      <Icon name="info" size={14} />
      Pedido de demonstração
    </span>
  );
}
