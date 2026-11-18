"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { normalize } from "@/lib/format";
import type { MenuProduct } from "@/types/content";

type Suggestion = Pick<MenuProduct, "id" | "name" | "slug">;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  products: Suggestion[];
  hrefFor: (slug: string) => string;
  onNavigate: () => void;
};

const MAX_SUGGESTIONS = 6;

function fold(text: string) {
  let out = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const piece = (text[i] ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    for (const ch of piece) {
      out += ch;
      map.push(i);
    }
  }
  return { out, map };
}

function Highlight({ text, query }: { text: string; query: string }) {
  const { out, map } = fold(text);
  const at = query ? out.indexOf(query) : -1;
  if (at < 0) return text;
  const from = map[at] ?? 0;
  const to = (map[at + query.length - 1] ?? from) + 1;
  return (
    <>
      {text.slice(0, from)}
      <mark className="bg-transparent font-semibold text-espresso">{text.slice(from, to)}</mark>
      {text.slice(to)}
    </>
  );
}

export function MenuSearch({ value, onChange, onClear, products, hrefFor, onNavigate }: Props) {
  const router = useRouter();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const q = normalize(value);

  const suggestions = useMemo(() => {
    if (!q) return [];
    return products
      .map((p) => ({ p, at: fold(p.name).out.indexOf(q) }))
      .filter((s) => s.at >= 0)
      .sort((a, b) => Number(a.at > 0) - Number(b.at > 0))
      .slice(0, MAX_SUGGESTIONS)
      .map((s) => s.p);
  }, [products, q]);

  const expanded = open && suggestions.length > 0;
  const noMatch = open && q.length > 0 && suggestions.length === 0;
  const optionId = (i: number) => `${listId}-${i}`;

  const go = (s: Suggestion) => {
    setOpen(false);
    onNavigate();
    router.push(hrefFor(s.slug));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = suggestions.length;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!n) return;
      e.preventDefault();
      setOpen(true);
      if (e.key === "ArrowDown") setActive((i) => (i + 1) % n);
      else setActive((i) => (i <= 0 ? n - 1 : i - 1));
    } else if (e.key === "Enter") {
      const picked = expanded ? suggestions[active] : undefined;
      if (picked) {
        e.preventDefault();
        go(picked);
      } else setOpen(false);
    } else if (e.key === "Escape" && (expanded || noMatch)) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="relative md:w-72 md:shrink-0">
      <label htmlFor="busca-cardapio" className="sr-only">
        Buscar no cardápio
      </label>
      <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mocha" />
      <input
        id="busca-cardapio"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Buscar pelo nome"
        autoComplete="off"
        enterKeyHint="search"
        className="h-11 w-full rounded-md border border-line-strong bg-paper pr-10 pl-10 text-[0.9375rem] text-espresso transition-colors placeholder:text-mocha/80 focus:border-caramel-deep focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-0.5 grid size-10 -translate-y-1/2 place-items-center rounded-md text-mocha hover:text-espresso"
          aria-label="Limpar busca"
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}

      <ul
        id={listId}
        role="listbox"
        aria-label="Sugestões de produtos"
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-md border border-line bg-white py-1 shadow-lg"
      >
        {suggestions.map((s, i) => (
          <li
            key={s.id}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(s)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center px-3.5 text-[0.9375rem] text-mocha",
              i === active && "bg-cream-soft text-espresso",
            )}
          >
            <span className="truncate">
              <Highlight text={s.name} query={q} />
            </span>
          </li>
        ))}
      </ul>
      {noMatch ? (
        <p className="absolute inset-x-0 top-full z-40 mt-1.5 rounded-md border border-line bg-white px-3.5 py-3 text-sm text-mocha shadow-lg">
          Nenhum produto com esse nome.
        </p>
      ) : null}
    </form>
  );
}
