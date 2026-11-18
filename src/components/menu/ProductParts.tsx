import Image from "next/image";
import { Icon, type IconName } from "@/components/ui/Icon";
import { DraftTag, Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { MenuProduct, ProductTag } from "@/types/content";
import { ProductIllustration } from "./ProductIllustration";

export const tagLabels: Record<ProductTag, string> = {
  destaque: "Destaque",
  novidade: "Novidade",
  sazonal: "Sazonal",
  "da-casa": "Da casa",
};

export const temperatureInfo: Record<NonNullable<MenuProduct["temperature"]>, { label: string; icon: IconName }> = {
  hot: { label: "Quente", icon: "cup" },
  iced: { label: "Gelado", icon: "iced" },
  both: { label: "Quente ou gelado", icon: "cup" },
};

type VisualProps = { product: MenuProduct; sizes: string; className?: string; idSuffix?: string };

export function ProductVisual({ product, sizes, className, idSuffix = "" }: VisualProps) {
  if (product.image) {
    return (
      <Image src={product.image.src} alt={product.image.alt} fill placeholder="blur" sizes={sizes} className={cn("object-cover", className)} />
    );
  }
  if (product.illustration) {
    return (
      <>
        <ProductIllustration kind={product.illustration} uid={product.id + idSuffix} className={cn("absolute inset-0 size-full", className)} />
        <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-2 py-0.5 text-[0.6875rem] font-medium text-mocha">
          Ilustração
        </span>
      </>
    );
  }
  return (
    <span className="absolute inset-0 grid place-items-center text-latte">
      <Icon name={product.temperature === "iced" ? "iced" : "cup"} size={40} strokeWidth={1.2} />
    </span>
  );
}

export function ProductTags({ product, className, draft = true }: { product: MenuProduct; className?: string; draft?: boolean }) {
  const showDraft = draft && product.dataStatus === "draft";
  if (!showDraft && !product.tags?.length) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {product.tags?.map((tag) => (
        <Tag key={tag} tone={tag === "destaque" || tag === "novidade" ? "accent" : "dark"}>
          {tagLabels[tag]}
        </Tag>
      ))}
      {showDraft ? <DraftTag /> : null}
    </span>
  );
}

function lowestPrice(product: MenuProduct) {
  const prices = [product.priceCents, ...(product.variants?.map((v) => v.priceCents) ?? [])].filter(
    (p): p is number => typeof p === "number",
  );
  return prices.length ? Math.min(...prices) : undefined;
}

export function ProductPrice({ product, className, large }: { product: MenuProduct; className?: string; large?: boolean }) {
  const price = lowestPrice(product);
  if (price === undefined) {
    return <span className={cn("text-sm whitespace-nowrap text-mocha", className)}>Preço a confirmar</span>;
  }
  const hasRange = Boolean(product.variants?.some((v) => v.priceCents && v.priceCents !== price));
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 text-espresso", className)}>
      {hasRange ? <span className="text-sm text-mocha">a partir de</span> : null}
      <span className={cn("font-semibold tabular-nums", large ? "text-2xl" : "text-[1.0625rem]")}>{formatPrice(price)}</span>
      {product.dataStatus === "draft" ? <span className="text-xs font-medium text-caramel-deep">preço de exemplo</span> : null}
    </span>
  );
}

export function availabilityLabel(product: MenuProduct) {
  if (product.availability === "unavailable") return product.availabilityNote ?? "Indisponível no momento";
  if (product.availability === "coming-soon") return product.availabilityNote ?? "Em breve";
  return undefined;
}
