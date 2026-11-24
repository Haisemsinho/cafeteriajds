"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function DraftNotice({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div role="note" className="relative z-[60] border-b border-line-dark bg-roast text-sand">
      <div className="page-x flex min-h-9 items-center justify-between gap-3 text-xs">
        <p>
          <strong className="font-semibold text-caramel-light">Versão de apresentação.</strong> <span>{message}</span>
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="-my-1 -mr-3 grid size-11 shrink-0 place-items-center rounded-full text-sand hover:bg-white/10 hover:text-white"
          aria-label="Fechar aviso de demonstração"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
