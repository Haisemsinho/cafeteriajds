"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { MenuProduct } from "@/types/content";
import { availabilityLabel, ProductPrice, ProductTags, ProductVisual, temperatureInfo } from "./ProductParts";

type Props = {
  product?: MenuProduct;
  categoryName?: string;
  open: boolean;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function ProductDialog({ product, categoryName, open, saved, onToggleSave, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("#produto-titulo")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, product]);

  const unavailable = product ? availabilityLabel(product) : undefined;
  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="produto-titulo"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="modal"
    >
      {product ? (
        <div className="md:grid md:grid-cols-[1fr_1.15fr]">
          <div className="relative aspect-[4/3] bg-oat md:aspect-auto md:min-h-[28rem]">
            <ProductVisual product={product} sizes="(min-width: 768px) 24rem, 100vw" idSuffix="-modal" label />
          </div>

          <div className="relative flex flex-col p-6 sm:p-8">
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-mocha transition-colors hover:bg-cream-soft hover:text-espresso"
              aria-label="Fechar detalhes"
            >
              <Icon name="close" size={20} />
            </button>

            {categoryName ? <p className="eyebrow pr-12">{categoryName}</p> : null}
            <h2 id="produto-titulo" tabIndex={-1} className="mt-1.5 pr-10 text-h2 text-espresso focus:outline-none">
              {product.name}
            </h2>
            <ProductTags product={product} className="mt-3" />
            <p className="mt-4 text-lede text-mocha">{product.description}</p>

            <div className="mt-6">
              <ProductPrice product={product} large />
            </div>

            {product.variants?.length ? (
              <ul className="mt-4 divide-y divide-line rounded-lg border border-line text-[0.9375rem]">
                {product.variants.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="text-espresso">{v.label}</span>
                    <span className="font-medium tabular-nums text-espresso">
                      {v.priceCents ? formatPrice(v.priceCents) : "a confirmar"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-sm">
              {product.temperature ? (
                <div>
                  <dt className="text-xs font-semibold text-mocha">Temperatura</dt>
                  <dd className="mt-1 inline-flex items-center gap-1.5 text-espresso">
                    <Icon name={temperatureInfo[product.temperature].icon} size={16} />
                    {temperatureInfo[product.temperature].label}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold text-mocha">Disponibilidade</dt>
                <dd className={cn("mt-1", unavailable ? "text-caramel-deep" : "text-espresso")}>{unavailable ?? "Disponível"}</dd>
              </div>
              {product.ingredients?.length ? (
                <div className="col-span-2">
                  <dt className="text-xs font-semibold text-mocha">Ingredientes</dt>
                  <dd className="mt-1 text-espresso">{product.ingredients.join(", ")}</dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-5 text-xs leading-relaxed text-mocha">
              {product.allergens ? (
                <>
                  <strong className="font-semibold text-espresso">Contém:</strong> {product.allergens.contains.join(", ")}.
                  Informação revisada em {formatDate(product.allergens.checkedAt)}.
                </>
              ) : (
                <>Tem alguma alergia ou restrição? Fale com a equipe no balcão antes de pedir.</>
              )}
            </p>

            {product.dataStatus === "draft" ? (
              <Notice tone="setup" className="mt-5" title="Item de exemplo">
                Nome, descrição, ilustração e preço servem só para apresentação. O cardápio oficial será confirmado pela JDS.
              </Notice>
            ) : null}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button
                variant={saved ? "primary" : "outline"}
                onClick={() => onToggleSave(product.id)}
                aria-pressed={saved}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon name="heart" size={16} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Na seleção" : "Salvar"}
                </span>
              </Button>
              <Button variant={saved ? "outline" : "primary"} onClick={close}>
                Voltar ao cardápio
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
