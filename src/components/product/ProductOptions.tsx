"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/links";
import type { MenuProduct } from "@/types/content";

type Props = {
  product: Pick<MenuProduct, "name" | "priceCents" | "variants" | "temperature" | "dataStatus" | "availability">;
  whatsapp?: string;
  greeting: string;
  intro: ReactNode;
  details: ReactNode;
};

const temperatures = [
  { id: "quente", label: "Quente" },
  { id: "gelado", label: "Gelado" },
];

const optionClass = cn(
  "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-white px-5 text-[0.9375rem] font-medium text-espresso transition-colors duration-300 press",
  "hover:border-espresso has-checked:border-night has-checked:bg-night has-checked:text-white",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel-deep",
);

export function ProductOptions({ product, whatsapp, greeting, intro, details }: Props) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [temperature, setTemperature] = useState("quente");

  const variant = variants.find((v) => v.id === variantId);
  const price = variant?.priceCents ?? product.priceCents;
  const choosesTemperature = product.temperature === "both";

  const choices = [
    variant?.label,
    choosesTemperature ? temperatures.find((t) => t.id === temperature)?.label : undefined,
  ]
    .filter(Boolean)
    .map((c) => c?.toLowerCase());
  const message = `${greeting} Gostaria de saber mais sobre ${product.name}${choices.length ? ` (${choices.join(", ")})` : ""}.`;

  return (
    <>
      <div className="mt-5" aria-live="polite">
        {price ? (
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[2rem] leading-none font-semibold tracking-[-0.02em] text-caramel-deep tabular-nums">
              {formatPrice(price)}
            </span>
            {variant ? <span className="text-sm text-mocha">{variant.label}</span> : null}
            {product.dataStatus === "draft" ? (
              <span className="rounded-full bg-cream-soft px-2.5 py-1 text-xs font-semibold text-caramel-deep">
                preço de exemplo
              </span>
            ) : null}
          </p>
        ) : (
          <p className="text-lg font-semibold text-mocha">Preço a confirmar</p>
        )}
      </div>

      {intro}

      {variants.length || choosesTemperature ? (
        <div className="mt-8 space-y-6 border-t border-line pt-6">
          {variants.length ? (
            <fieldset>
              <legend className="text-sm font-semibold text-espresso">Tamanho</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <label key={v.id} className={optionClass}>
                    <input
                      type="radio"
                      name="tamanho"
                      value={v.id}
                      checked={variantId === v.id}
                      onChange={() => setVariantId(v.id)}
                      className="sr-only"
                    />
                    {v.label}
                    {v.volume ? <span className="text-xs opacity-75">{v.volume}</span> : null}
                    {v.priceCents ? (
                      <span className="text-xs opacity-75 tabular-nums">{formatPrice(v.priceCents)}</span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {choosesTemperature ? (
            <fieldset>
              <legend className="text-sm font-semibold text-espresso">Temperatura</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {temperatures.map((t) => (
                  <label key={t.id} className={optionClass}>
                    <input
                      type="radio"
                      name="temperatura"
                      value={t.id}
                      checked={temperature === t.id}
                      onChange={() => setTemperature(t.id)}
                      className="sr-only"
                    />
                    <Icon name={t.id === "gelado" ? "iced" : "cup"} size={18} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {whatsapp ? (
          <a
            href={whatsappUrl(whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-caramel-deep press px-6 text-[0.9375rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(156_95_34/0.7)] transition-colors hover:bg-caramel-dark"
          >
            <Icon name="chat" size={20} />
            Consultar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : (
          <Link
            href="/contato"
            className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-caramel-deep press px-6 text-[0.9375rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(156_95_34/0.7)] transition-colors hover:bg-caramel-dark"
          >
            Como visitar
            <Icon name="arrowRight" size={18} />
          </Link>
        )}
        <Link
          href="/cardapio"
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-6 press text-[0.9375rem] font-semibold text-espresso transition-colors hover:border-espresso sm:flex-none"
        >
          Ver outros produtos
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>

      {details}
    </>
  );
}
