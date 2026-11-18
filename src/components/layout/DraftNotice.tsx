"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function DraftNotice() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      role="note"
      className="fixed bottom-3 left-3 z-40 flex items-center gap-2.5 rounded-full border border-line bg-paper py-1 pr-1 pl-3.5 text-xs text-espresso shadow-[0_10px_30px_-14px_rgb(38_26_21/0.45)] sm:bottom-4 sm:left-4 sm:max-w-sm"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-caramel-deep" aria-hidden />
      <span>
        <strong className="font-semibold">Versão de apresentação</strong>
        <span className="hidden sm:inline">. Itens de exemplo ainda não são oficiais.</span>
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-cream-soft"
        aria-label="Fechar aviso de demonstração"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
