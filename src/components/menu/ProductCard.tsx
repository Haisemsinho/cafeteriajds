import type { ReactNode } from "react";
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
        "lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        "hover:border-line-strong hover:shadow-[0_22px_44px_-24px_rgb(0_0_0/0.3)]",
        className,
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-oat sm:aspect-[4/3]", unavailable && "opacity-70 grayscale-[0.5]")}>
        <div className="absolute inset-0 transition-transform duration-500 ease-soft group-hover:scale-[1.04]">
          <ProductVisual product={product} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" />
        </div>
        {tag ? (
          <Tag tone={tag === "destaque" || tag === "novidade" ? "accent" : "dark"} className="absolute top-3 left-3">
            {tagLabels[tag]}
          </Tag>
        ) : null}
        {unavailable ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-night px-2.5 py-1 text-xs font-semibold text-white">
            {unavailable}
          </span>
        ) : null}
      </div>

      {corner ? <div className="absolute top-2 right-2 z-10">{corner}</div> : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {categoryName ? <p className="mb-1 text-[0.8125rem] font-medium text-mocha">{categoryName}</p> : null}
        <h3 className="text-lg leading-snug font-semibold tracking-[-0.01em] text-espresso">{product.name}</h3>
        <p className="mt-1.5 mb-5 line-clamp-2 text-[0.9375rem] leading-relaxed text-mocha">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <ProductPrice product={product} />
          {action}
        </div>
      </div>
    </article>
  );
}

export const cardActionClass =
  "inline-flex min-h-10 shrink-0 items-center gap-1 rounded-md bg-night px-3.5 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-caramel-deep after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-caramel-deep focus-visible:after:outline";
