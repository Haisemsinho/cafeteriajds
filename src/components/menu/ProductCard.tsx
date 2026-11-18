import type { ReactNode } from "react";
import { PhotoBadge } from "@/components/ui/PhotoCredit";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { MenuProduct } from "@/types/content";
import { availabilityLabel, ProductPrice, ProductVisual, tagLabels } from "./ProductParts";

type Props = {
  product: MenuProduct;
  categoryName?: string;
  action: ReactNode;
  corner?: ReactNode;
  className?: string;
};

export function ProductCard({ product, categoryName, action, corner, className }: Props) {
  const unavailable = availabilityLabel(product);
  const tag = product.tags?.[0];

  return (
    <article
      className={cn(
        "lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        "hover:border-transparent hover:shadow-[0_30px_60px_-30px_rgb(36_24_16/0.45)]",
        className,
      )}
    >
      <div
        className={cn(
          "zoom-frame relative m-2 mb-0 aspect-[5/4] rounded-[1.1rem] bg-oat",
          unavailable && "opacity-70 grayscale-[0.5]",
        )}
      >
        <ProductVisual
          product={product}
          sizes="(min-width: 1280px) 26rem, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
        />
        {product.image ? <PhotoBadge photo={product.image} className="right-3 bottom-3" /> : null}
        {tag ? (
          <Tag tone={tag === "destaque" || tag === "novidade" ? "accent" : "dark"} className="absolute top-3 left-3">
            {tagLabels[tag]}
          </Tag>
        ) : null}
        {unavailable ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-night px-2.5 py-1 text-xs font-semibold text-white">
            {unavailable}
          </span>
        ) : null}
      </div>

      {corner ? <div className="absolute top-4 right-4 z-10">{corner}</div> : null}

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5 sm:px-6 sm:pb-6">
        {categoryName ? <p className="eyebrow mb-2 text-[0.6875rem] text-mocha">{categoryName}</p> : null}
        <h3 className="font-display text-[1.75rem] leading-[1.05] font-normal tracking-[-0.01em] text-espresso">
          {product.name}
        </h3>
        <p className="mt-2 mb-5 line-clamp-2 text-[0.9375rem] leading-relaxed text-mocha">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <ProductPrice product={product} />
          {action}
        </div>
      </div>
    </article>
  );
}

export const cardActionClass =
  "inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full bg-night px-4 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-caramel-deep after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-caramel-deep focus-visible:after:outline";
