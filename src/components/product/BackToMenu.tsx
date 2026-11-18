"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useUrlParam } from "@/hooks/useUrlParam";

const allowed = ["categoria", "busca", "filtros"];

function menuHref(from: string | null) {
  if (!from) return "/cardapio";
  const source = new URLSearchParams(from);
  const clean = new URLSearchParams();
  for (const key of allowed) {
    const value = source.get(key);
    if (value) clean.set(key, value.slice(0, 80));
  }
  const query = clean.toString();
  return query ? `/cardapio?${query}` : "/cardapio";
}

export function BackToMenu() {
  const [from] = useUrlParam("de");
  const href = menuHref(from);

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
