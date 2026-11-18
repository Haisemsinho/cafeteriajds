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
  variant?: "stack" | "feature" | "row" | "auto";
  className?: string;
};

const visualSizes = {
  stack: "(min-width: 1280px) 26rem, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw",
  feature: "(min-width: 1024px) 44rem, 100vw",
  row: "(min-width: 1024px) 14rem, 40vw",
  auto: "(min-width: 1280px) 26rem, (min-width: 640px) 48vw, 36vw",
};

export function ProductCard({ product, categoryName, action, corner, variant = "stack", className }: Props) {
  const unavailable = availabilityLabel(product);
  const tag = product.tags?.[0];
  const row = variant === "row";
  const auto = variant === "auto";

  return (
    <article
      className={cn(
        "lift group relative flex h-full overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        row ? "flex-row" : auto ? "flex-row sm:flex-col" : "flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "zoom-frame relative shrink-0 rounded-[1.1rem] bg-oat",
          row
            ? "m-2 w-[38%] self-stretch"
            : auto
              ? "m-2 w-[36%] self-stretch sm:mb-0 sm:w-auto sm:self-auto"
              : "m-2 mb-0",
          variant === "stack" && "aspect-[5/4]",
          auto && "min-h-36 sm:aspect-[5/4] sm:min-h-0",
          variant === "feature" && "aspect-[4/3] lg:aspect-auto lg:flex-1",
          row && "min-h-36",
          unavailable && "opacity-70 grayscale-[0.5]",
        )}
      >
        <ProductVisual product={product} sizes={visualSizes[variant]} />
        {product.image ? <PhotoBadge photo={product.image} className="right-3 bottom-3" /> : null}
        {tag && !row ? (
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

      <div
        className={cn(
          variant === "feature" ? "flex flex-none flex-col" : "flex flex-1 flex-col",
          row ? "py-4 pr-5 pl-3" : auto ? "py-4 pr-4 pl-2 sm:px-6 sm:pt-5 sm:pb-6" : "px-5 pt-5 pb-5 sm:px-6 sm:pb-6",
        )}
      >
        <h3
          className={cn(
            "font-display leading-[1.05] font-normal tracking-[-0.01em] break-words hyphens-auto text-espresso",
            variant === "feature"
              ? "text-[2rem] sm:text-[2.75rem]"
              : row
                ? "text-[1.5rem]"
                : auto
                  ? "pr-10 text-[1.5rem] sm:pr-0 sm:text-[1.75rem]"
                  : "text-[1.75rem]",
          )}
        >
          {product.name}
        </h3>
        {categoryName ? <p className="mt-1 text-sm text-mocha">{categoryName}</p> : null}
        <p
          className={cn(
            "mt-2 text-[0.9375rem] leading-relaxed text-mocha",
            row
              ? "mb-4 line-clamp-2 max-sm:hidden"
              : auto
                ? "mb-4 line-clamp-2 max-sm:hidden sm:mb-5"
                : "mb-5 line-clamp-2",
          )}
        >
          {product.description}
        </p>
        <div
          className={cn(
            "mt-auto flex items-end justify-between gap-3 border-t border-line pt-4",
            row && "flex-wrap gap-y-3",
            auto && "max-sm:flex-wrap max-sm:gap-y-3",
          )}
        >
          <ProductPrice product={product} />
          {action}
        </div>
      </div>
    </article>
  );
}

export const cardActionClass =
  "press inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-night px-4 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-caramel-deep after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-caramel-deep focus-visible:after:outline";
