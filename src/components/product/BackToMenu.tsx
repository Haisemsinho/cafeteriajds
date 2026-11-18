"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useUrlParam } from "@/hooks/useUrlParam";

export function BackToMenu() {
  const [from] = useUrlParam("de");
  const href = from ? `/cardapio?${from}` : "/cardapio";

  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 rounded-md text-[0.9375rem] font-semibold text-mocha transition-colors hover:text-espresso"
    >
      <Icon name="arrowRight" size={18} className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
      Voltar ao cardápio
    </Link>
  );
}
