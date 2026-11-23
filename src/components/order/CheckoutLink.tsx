"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ProductVisual } from "@/components/menu/ProductParts";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/format";
import { defaultSelection, needsChoice, orderTotals, unitPrice } from "@/lib/order/pricing";
import { addToCart, markSuggestionSeen, readSuggestionSeen } from "@/lib/order/store";
import { toCandidate, toCartItem } from "@/lib/recommend/adapter";
import { recommend, type Suggestion } from "@/lib/recommend/engine";
import { useOrderConfig, useResolvedCart } from "./OrderContext";

type Props = {
  className?: string;
  children: ReactNode;
  guard?: () => boolean;
  onIntercept?: () => void;
};

export function CheckoutLink({ className, children, guard, onIntercept }: Props) {
  const router = useRouter();
  const { catalog, pairings, requireConfirmedAvailability } = useOrderConfig();
  const { lines, unitId } = useResolvedCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [shown, setShown] = useState<Suggestion[]>([]);
  const titleId = useId();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const suggestions = useMemo(
    () =>
      recommend(
        lines.map(toCartItem),
        catalog.map(toCandidate),
        pairings,
        {
          unitId,
          statuses: requireConfirmedAvailability ? ["verified"] : ["verified", "draft", "review"],
          requireConfirmedAvailability,
        },
        3,
      ),
    [lines, catalog, pairings, unitId, requireConfirmedAvailability],
  );

  const current = shown[index] ?? shown[0];
  const product = current ? catalog.find((p) => p.id === current.productId) : undefined;
  const choose = product ? needsChoice(product) : false;
  const price = product ? unitPrice(product, defaultSelection(product)) : undefined;
  const fromPrice = Boolean(product?.variants?.some((v) => v.priceCents && v.priceCents !== price?.unitCents));
  const total = orderTotals(lines).subtotalCents;

  const onClick = (e: MouseEvent) => {
    if (guard && !guard()) {
      e.preventDefault();
      return;
    }
    if (!suggestions.length || readSuggestionSeen()) return;
    e.preventDefault();
    markSuggestionSeen();
    setShown(suggestions);
    setIndex(0);
    setAdded(false);
    onIntercept?.();
    dialog.current?.showModal();
  };

  const close = () => dialog.current?.close();

  const add = () => {
    if (!product) return;
    addToCart(product.id, defaultSelection(product), 1);
    setAdded(true);
  };

  const proceed = () => {
    close();
    router.push("/finalizar");
  };

  return (
    <>
      <Link href="/finalizar" onClick={onClick} className={className}>
        {children}
      </Link>

      {mounted
        ? createPortal(
            <dialog
              ref={dialog}
              aria-labelledby={titleId}
              className="crosssell"
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
              {product && price ? (
                <div className="crosssell-body grid md:grid-cols-[17rem_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-oat md:aspect-auto md:min-h-full">
                    <ProductVisual
                      product={product}
                      sizes="(min-width: 768px) 272px, 100vw"
                      idSuffix="-sugestao"
                      label
                    />
                  </div>

                  <div className="relative flex flex-col p-6 sm:p-8">
                    <button
                      type="button"
                      onClick={close}
                      className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-espresso hover:bg-cream"
                      aria-label="Fechar sugestão e voltar ao carrinho"
                    >
                      <Icon name="close" size={22} />
                    </button>

                    <h2 id={titleId} className="pr-10 text-[2rem] leading-[1.05] text-espresso sm:text-[2.25rem]">
                      Que tal algo para acompanhar?
                    </h2>
                    <p className="mt-2 text-[0.9375rem] text-mocha">
                      Selecionamos uma sugestão que combina com seu pedido.
                    </p>

                    <div className="mt-6 border-t border-line pt-5">
                      <p className="text-sm text-mocha">
                        {current?.source === "casa" ? "Sugestão da casa para acompanhar" : "Para acompanhar"}{" "}
                        <span className="font-semibold text-espresso">{current?.forName}</span>
                      </p>
                      <h3 className="mt-2 text-xl leading-snug font-semibold text-espresso">{product.name}</h3>
                      <p className="text-sm text-mocha">{product.categoryName}</p>
                      {product.description ? (
                        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-espresso">
                          {product.description}
                        </p>
                      ) : null}
                      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                        {fromPrice ? <span className="text-sm text-mocha">a partir de</span> : null}
                        <span className="text-2xl font-semibold text-caramel-deep tabular-nums">
                          {formatPrice(price.unitCents)}
                        </span>
                        {product.dataStatus !== "verified" ? (
                          <span className="text-xs font-semibold text-caramel-deep">
                            {product.dataStatus === "review" ? "preço a conferir" : "preço de exemplo"}
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-2" aria-live="polite">
                      {added ? (
                        <>
                          <p className="flex items-center gap-2 rounded-2xl bg-mint px-4 py-3 text-[0.9375rem] font-semibold text-forest">
                            <Icon name="checkCircle" size={20} />
                            Adicionado. Itens do pedido: {formatPrice(total)}
                          </p>
                          <button
                            type="button"
                            onClick={proceed}
                            className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-caramel-deep px-6 text-base font-semibold text-white hover:bg-caramel-dark"
                          >
                            Continuar para finalizar
                            <Icon name="arrowRight" size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={close}
                            className="press inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong px-6 font-semibold text-espresso hover:border-espresso"
                          >
                            Voltar ao carrinho
                          </button>
                        </>
                      ) : (
                        <>
                          {choose ? (
                            <>
                              <p className="text-sm text-mocha">
                                Este item pede uma escolha antes de ir para o carrinho.
                              </p>
                              <Link
                                href={`/cardapio/${product.slug}`}
                                onClick={close}
                                className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-caramel-deep px-6 text-base font-semibold text-white hover:bg-caramel-dark"
                              >
                                Escolher opções
                                <Icon name="arrowRight" size={18} />
                              </Link>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={add}
                              className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-caramel-deep px-6 text-base font-semibold text-white hover:bg-caramel-dark"
                            >
                              <Icon name="plus" size={20} />
                              Adicionar ao pedido
                              <span className="tabular-nums">{formatPrice(price.unitCents)}</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={proceed}
                            className="press inline-flex min-h-13 items-center justify-center rounded-full border border-line-strong px-6 font-semibold text-espresso hover:border-espresso"
                          >
                            Continuar sem adicionar
                          </button>
                          <div className="flex flex-wrap items-center justify-center gap-x-4">
                            {!choose ? (
                              <Link
                                href={`/cardapio/${product.slug}`}
                                onClick={close}
                                className="inline-flex min-h-11 items-center text-sm font-semibold text-caramel-deep underline-offset-4 hover:underline"
                              >
                                Ver detalhes
                              </Link>
                            ) : null}
                            {shown.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => setIndex((i) => (i + 1) % shown.length)}
                                className="inline-flex min-h-11 items-center text-sm font-semibold text-caramel-deep underline-offset-4 hover:underline"
                              >
                                Ver outra sugestão ({index + 1} de {shown.length})
                              </button>
                            ) : null}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
