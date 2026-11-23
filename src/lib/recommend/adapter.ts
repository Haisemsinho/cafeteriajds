import type { CatalogItem } from "@/lib/order/catalog";
import { orderBlock } from "@/lib/order/rules";
import type { Selection } from "@/lib/order/pricing";
import type { Candidate, CartItem } from "./engine";

export function toCandidate(p: CatalogItem): Candidate {
  return {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    roles: p.roles,
    unitIds: p.unitIds,
    order: p.order,
    featured: p.featured,
    status: p.dataStatus,
    blocked: orderBlock(p) !== null,
    availabilityConfirmed: p.availability === "available",
    hasPrice: p.priceCents !== undefined || Boolean(p.variants?.some((v) => v.priceCents)),
  };
}

export function toCartItem(line: { product: CatalogItem; selection: Selection }): CartItem {
  return {
    productId: line.product.id,
    name: line.product.name,
    roles: line.product.roles,
    temperature: line.selection.choices.temperatura?.[0],
  };
}

