"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CatalogItem, OrderConfig } from "@/lib/order/catalog";
import { unitPrice } from "@/lib/order/pricing";
import { orderBlock } from "@/lib/order/rules";
import { useCart, useUnit, type CartLine } from "@/lib/order/store";

const OrderContext = createContext<OrderConfig | null>(null);

export function OrderProvider({ config, children }: { config: OrderConfig; children: ReactNode }) {
  return <OrderContext.Provider value={config}>{children}</OrderContext.Provider>;
}

export function useOrderConfig() {
  const config = useContext(OrderContext);
  if (!config) throw new Error("OrderProvider ausente");
  return config;
}

export type ResolvedLine = CartLine & { product: CatalogItem; unitCents: number; available: boolean };

export function useResolvedCart() {
  const { catalog, units } = useOrderConfig();
  const lines = useCart();
  const unitId = useUnit();
  const unit = units.find((u) => u.id === unitId);

  const resolved = useMemo(() => {
    const out: ResolvedLine[] = [];
    for (const line of lines) {
      const product = catalog.find((p) => p.id === line.productId);
      if (!product) continue;
      out.push({
        ...line,
        product,
        unitCents: unitPrice(product, line.selection).unitCents,
        available: !orderBlock(product) && (!unitId || product.unitIds.includes(unitId)),
      });
    }
    return out;
  }, [lines, catalog, unitId]);

  return { lines: resolved, unit, unitId };
}
