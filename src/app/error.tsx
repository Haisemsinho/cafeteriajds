"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-x py-20 sm:py-24">
      <EmptyState
        icon="info"
        headingLevel={1}
        title="Algo não saiu como esperado"
        action={
          <div className="flex flex-col gap-3 xs:flex-row">
            <Button onClick={reset}>Tentar de novo</Button>
            <ButtonLink href="/" variant="outline">
              Ir para o início
            </ButtonLink>
          </div>
        }
      >
        Não conseguimos carregar esta parte do site. Tente de novo em alguns instantes.
      </EmptyState>
    </div>
  );
}
