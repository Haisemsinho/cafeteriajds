"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/Feedback";
import { ButtonLink } from "@/components/ui/Button";
import { useOrderConfig } from "./OrderContext";

export function OrderGate({ children }: { children: ReactNode }) {
  const { enabled } = useOrderConfig();
  if (enabled) return <>{children}</>;
  return (
    <div className="page-x py-20">
      <EmptyState
        icon="info"
        headingLevel={1}
        title="Pedidos pelo site ainda não estão disponíveis"
        action={<ButtonLink href="/cardapio">Ver o cardápio</ButtonLink>}
      >
        Por enquanto, faça seu pedido direto na cafeteria.
      </EmptyState>
    </div>
  );
}
