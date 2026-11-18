import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { MenuProduct } from "@/types/content";
import { availabilityLabel, ProductPrice, ProductTags, ProductVisual } from "./ProductParts";

type Props = {
  product: MenuProduct;
  categoryName?: string;
  action: ReactNode;
  corner?: ReactNode;
  className?: string;
};

export function ProductCard({ product, categoryName, action, corner, className }: Props) {
  const unavailable = availabilityLabel(product);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper transition-[border-color,box-shadow] duration-200",
        "hover:border-line-strong hover:shadow-[0_14px_32px_-22px_rgb(38_26_21/0.4)] focus-within:border-line-strong",
        className,
      )}
    >
      <div className={cn("relative aspect-[16/10] bg-oat sm:aspect-[4/3]", unavailable && "opacity-70 grayscale-[0.5]")}>
        <ProductVisual product={product} sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" />
        <ProductTags product={product} className="absolute top-3 left-3" />
        {unavailable ? (
          <span className="absolute right-3 bottom-3 rounded-full bg-espresso px-2.5 py-1 text-xs font-semibold text-paper">
            {unavailable}
          </span>
        ) : null}
      </div>

      {corner ? <div className="absolute top-2 right-2 z-10">{corner}</div> : null}

      <div className="flex flex-1 flex-col p-5">
        {categoryName ? <p className="mb-1 text-sm text-mocha">{categoryName}</p> : null}
        <h3 className="text-h3 text-espresso">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[0.9375rem] leading-relaxed text-mocha">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <ProductPrice product={product} />
          {action}
        </div>
      </div>
    </article>
  );
}

export const cardActionClass =
  "inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-caramel-deep after:absolute after:inset-0 after:rounded-xl after:content-[''] group-hover:text-walnut focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-caramel-deep focus-visible:after:outline";
