"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { normalize, plural } from "@/lib/format";
import type { MenuProduct } from "@/types/content";

type Suggestion = Pick<MenuProduct, "id" | "name" | "slug" | "description">;

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  products: Suggestion[];
  total: number;
  hrefFor: (slug: string) => string;
  onNavigate: () => void;
  onShowAll: () => void;
  className?: string;
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

export function MenuSearch({
  value,
  onChange,
  onClear,
  products,
  total,
  hrefFor,
  onNavigate,
  onShowAll,
  className,
}: Props) {
  const router = useRouter();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const q = normalize(value);

  const suggestions = useMemo(() => {
    if (!q) return [];
    return products
      .map((p) => {
        const inName = fold(p.name).out.indexOf(q);
        return { p, rank: inName === 0 ? 0 : inName > 0 ? 1 : fold(p.description).out.includes(q) ? 2 : -1 };
      })
      .filter((s) => s.rank >= 0)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, MAX_SUGGESTIONS)
      .map((s) => s.p);
  }, [products, q]);

  const showAll = q.length > 0 && total > 0;
  const count = suggestions.length + (showAll ? 1 : 0);
  const expanded = open && count > 0;
  const noMatch = open && q.length > 0 && total === 0;
  const optionId = (i: number) => `${listId}-${i}`;

  const go = (s: Suggestion) => {
    setOpen(false);
    onNavigate();
    router.push(hrefFor(s.slug));
  };

  const seeAll = () => {
    setOpen(false);
    setActive(-1);
    onShowAll();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!count) return;
      e.preventDefault();
      setOpen(true);
      if (e.key === "ArrowDown") setActive((i) => (i + 1) % count);
      else setActive((i) => (i <= 0 ? count - 1 : i - 1));
    } else if (e.key === "Enter") {
      const picked = expanded ? suggestions[active] : undefined;
      e.preventDefault();
      if (picked) go(picked);
      else if (showAll) seeAll();
      else setOpen(false);
    } else if (e.key === "Escape" && (expanded || noMatch)) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className={cn("relative", className)}>
      <label htmlFor="busca-cardapio" className="sr-only">
        Buscar no cardápio
      </label>
      <Icon
        name="search"
        size={20}
        className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-mocha"
      />
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
        placeholder="Buscar cafés, bebidas, doces..."
        autoComplete="off"
        enterKeyHint="search"
        className="h-14 w-full rounded-full border border-line-strong bg-paper pr-14 pl-13 text-base text-espresso shadow-[0_10px_30px_-22px_rgb(36_24_16/0.5)] transition-[border-color,box-shadow] duration-200 placeholder:text-mocha focus:border-caramel-deep focus:shadow-[0_0_0_4px_rgb(185_119_53/0.14)] focus:outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="press absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-mocha hover:bg-cream-soft hover:text-espresso"
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
        className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-line bg-white py-1 shadow-lg"
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
              "flex min-h-11 cursor-pointer items-center px-5 text-[0.9375rem] text-mocha",
              i === active && "bg-cream-soft text-espresso",
            )}
          >
            <span className="truncate">
              <Highlight text={s.name} query={q} />
            </span>
          </li>
        ))}
        {showAll ? (
          <li
            id={optionId(suggestions.length)}
            role="option"
            aria-selected={active === suggestions.length}
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setActive(suggestions.length)}
            onClick={seeAll}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2 border-t border-line px-5 text-sm font-semibold text-caramel-deep",
              active === suggestions.length && "bg-cream-soft",
            )}
          >
            {`Ver ${plural(total, "resultado", "resultados")} para "${value.trim()}"`}
            <Icon name="arrowRight" size={16} />
          </li>
        ) : null}
      </ul>
      {noMatch ? (
        <p className="absolute inset-x-0 top-full z-40 mt-2 rounded-2xl border border-line bg-white px-5 py-3 text-sm text-mocha shadow-lg">
          Nenhum produto encontrado.
        </p>
      ) : null}
    </form>
  );
}
