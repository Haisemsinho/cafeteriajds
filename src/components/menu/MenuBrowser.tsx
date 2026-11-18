"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { useSavedItems } from "@/hooks/useSavedItems";
import { setUrlParams, useUrlParam } from "@/hooks/useUrlParam";
import { cn } from "@/lib/cn";
import { normalize, plural } from "@/lib/format";
import type { MenuCategory, MenuProduct } from "@/types/content";
import { cardActionClass, ProductCard } from "./ProductCard";
import { MenuSearch } from "./MenuSearch";
import { business } from "@/content/business";

const URL_SYNC_MS = 300;

type FilterId = "destaques" | "quentes" | "gelados" | "disponiveis" | "salvos";

const filterIds = new Set<string>(["destaques", "quentes", "gelados", "disponiveis", "salvos"]);

const filterDefs: { id: FilterId; label: string; test: (p: MenuProduct, saved: string[]) => boolean }[] = [
  { id: "destaques", label: "Destaques", test: (p) => Boolean(p.featured || p.tags?.includes("destaque")) },
  { id: "quentes", label: "Quentes", test: (p) => p.temperature === "hot" || p.temperature === "both" },
  { id: "gelados", label: "Gelados", test: (p) => p.temperature === "iced" || p.temperature === "both" },
  { id: "disponiveis", label: "Disponíveis", test: (p) => p.availability === "available" },
  { id: "salvos", label: "Minha seleção", test: (p, saved) => saved.includes(p.id) },
];

type Props = {
  categories: Pick<MenuCategory, "id" | "name" | "description">[];
  products: MenuProduct[];
  instagramUrl?: string;
};

export function MenuBrowser({ categories, products, instagramUrl }: Props) {
  const router = useRouter();
  const [categoryParam, setCategory] = useUrlParam("categoria");
  const [itemParam] = useUrlParam("item");
  const [queryParam, setQueryParam] = useUrlParam("busca");
  const [filtersParam, setFiltersParam] = useUrlParam("filtros");
  const { ids: saved, toggle } = useSavedItems();
  const [typed, setTyped] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const query = typed ?? queryParam ?? "";
  const deferredQuery = useDeferredValue(query);

  useEffect(() => () => clearTimeout(syncTimer.current), []);

  const strip = useRef<HTMLUListElement>(null);
  useEffect(() => {
    strip.current
      ?.querySelector<HTMLElement>("[aria-pressed='true']")
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [categoryParam]);
  const filters = useMemo(
    () => (filtersParam ?? "").split(",").filter((f): f is FilterId => filterIds.has(f)),
    [filtersParam],
  );

  useEffect(() => {
    if (itemParam && products.some((p) => p.slug === itemParam)) router.replace(`/cardapio/${itemParam}`);
  }, [itemParam, products, router]);

  const category = categories.some((c) => c.id === categoryParam) ? categoryParam : null;
  const names = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);

  const availableFilters = filterDefs.filter((f) => f.id === "salvos" || products.some((p) => f.test(p, saved)));

  const baseResults = useMemo(() => {
    const q = normalize(deferredQuery);
    return products.filter((p) => {
      if (q && !normalize(`${p.name} ${p.description}`).includes(q)) return false;
      return filters.every((id) => filterDefs.find((f) => f.id === id)?.test(p, saved));
    });
  }, [products, deferredQuery, filters, saved]);

  const results = useMemo(
    () => (category ? baseResults.filter((p) => p.categoryId === category) : baseResults),
    [baseResults, category],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of baseResults) map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
    return map;
  }, [baseResults]);

  const grouped = !deferredQuery && filters.length === 0;
  const sections = grouped
    ? categories
        .map((c) => ({ ...c, items: results.filter((p) => p.categoryId === c.id) }))
        .filter((s) => s.items.length)
    : [];

  const commitQuery = (value: string) => {
    clearTimeout(syncTimer.current);
    syncTimer.current = undefined;
    setQueryParam(value || null);
    setTyped(null);
  };

  const setQuery = (value: string) => {
    setTyped(value);
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => commitQuery(value), URL_SYNC_MS);
  };

  const flushQuery = () => {
    if (syncTimer.current) commitQuery(query);
  };

  const toggleFilter = (id: FilterId) => {
    const next = filters.includes(id) ? filters.filter((f) => f !== id) : [...filters, id];
    setFiltersParam(next.length ? next.join(",") : null);
  };

  const resetAll = () => {
    clearTimeout(syncTimer.current);
    syncTimer.current = undefined;
    setTyped(null);
    setUrlParams({ busca: null, filtros: null, categoria: null });
  };

  const context = new URLSearchParams();
  if (category) context.set("categoria", category);
  if (query) context.set("busca", query);
  if (filtersParam) context.set("filtros", filtersParam);
  const from = context.toString();
  const detailHref = (slug: string) =>
    from ? `/cardapio/${slug}?de=${encodeURIComponent(from)}` : `/cardapio/${slug}`;

  if (products.length === 0) {
    return (
      <div className="page-x py-20">
        <EmptyState
          title="Cardápio em atualização"
          action={
            instagramUrl ? (
              <ButtonLink href={instagramUrl} external variant="outline" icon="arrowUpRight">
                Ver novidades no Instagram
              </ButtonLink>
            ) : undefined
          }
        >
          Estamos preparando o cardápio para o site. Passe na {business.shortName} ou acompanhe as novidades pelo
          Instagram.
        </EmptyState>
      </div>
    );
  }

  const renderCard = (product: MenuProduct) => {
    const isSaved = saved.includes(product.id);
    return (
      <li key={product.id}>
        <ProductCard
          variant="auto"
          product={product}
          categoryName={grouped ? undefined : names.get(product.categoryId)}
          corner={
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={isSaved}
              aria-label={`Salvar ${product.name} na minha seleção`}
              className={cn(
                "press grid size-11 place-items-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-colors duration-300",
                isSaved ? "text-caramel-deep" : "text-mocha hover:text-espresso",
              )}
            >
              <Icon name="heart" size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          }
          action={
            <Link href={detailHref(product.slug)} onClick={flushQuery} className={cardActionClass}>
              Ver detalhes
              <span className="sr-only"> de {product.name}</span>
            </Link>
          }
        />
      </li>
    );
  };

  const showResults = () => {
    const target = document.getElementById("produtos");
    if (!target) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    target.focus({ preventScroll: true });
  };

  const savedEmpty = filters.includes("salvos") && saved.length === 0;
  const activeFilters = filters.length;

  const categoryList = (compact: boolean) => (
    <ul
      ref={compact ? strip : undefined}
      className={compact ? "scrollbar-none flex gap-1.5 overflow-x-auto pr-8" : "mt-3 space-y-0.5"}
    >
      {[{ id: null as string | null, name: "Todas" }, ...categories].map((c) => {
        const active = category === c.id;
        const count = c.id ? (counts.get(c.id) ?? 0) : baseResults.length;
        return (
          <li key={c.id ?? "todas"} className={compact ? "shrink-0" : undefined}>
            <button
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={cn(
                "press flex items-center gap-3 transition-colors duration-200",
                compact
                  ? "min-h-11 rounded-full px-4 text-[0.9375rem] whitespace-nowrap"
                  : "min-h-11 w-full justify-between rounded-xl px-3.5 text-left text-[0.9375rem]",
                active ? "bg-night font-semibold text-white" : "text-mocha hover:bg-cream-soft hover:text-espresso",
              )}
            >
              {c.name}
              {compact ? null : (
                <span className={cn("text-xs tabular-nums", active ? "text-white/80" : "text-mocha")}>
                  <span className="sr-only">, </span>
                  {count}
                  <span className="sr-only">{count === 1 ? " item" : " itens"}</span>
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const filterList = (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Filtros rápidos</legend>
      {availableFilters.map((f) => {
        const active = filters.includes(f.id);
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={active}
            onClick={() => toggleFilter(f.id)}
            className={cn(
              "press inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm whitespace-nowrap transition-colors duration-200",
              active
                ? "border-caramel-deep bg-caramel-deep text-paper"
                : "border-line-strong bg-paper text-mocha hover:border-espresso hover:text-espresso",
            )}
          >
            {active ? <Icon name="check" size={14} /> : null}
            {f.id === "salvos" ? <Icon name="heart" size={14} fill={active ? "currentColor" : "none"} /> : null}
            {f.label}
            {f.id === "salvos" ? <span className="tabular-nums">({saved.length})</span> : null}
          </button>
        );
      })}
    </fieldset>
  );

  return (
    <div className="page-x pb-28">
      <div className="sticky top-16 z-30 -mx-5 border-b border-line bg-porcelain/95 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-10 lg:pb-0 lg:backdrop-blur-none">
        <MenuSearch
          value={query}
          onChange={setQuery}
          onClear={() => commitQuery("")}
          products={products}
          hrefFor={detailHref}
          onNavigate={flushQuery}
          total={results.length}
          onShowAll={showResults}
          className="lg:ml-[calc(15rem+3rem)] lg:max-w-2xl xl:ml-[calc(16rem+3rem)]"
        />
        <div className="mt-3 flex items-center gap-2 lg:hidden">
          <div
            role="group"
            aria-label="Categorias do cardápio"
            className="min-w-0 flex-1 [mask-image:linear-gradient(to_right,black_85%,transparent)]"
          >
            {categoryList(true)}
          </div>
          <button
            type="button"
            onClick={() => toggleFilter("salvos")}
            aria-pressed={filters.includes("salvos")}
            aria-label={`Minha seleção (${saved.length})`}
            className={cn(
              "press relative grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-200",
              filters.includes("salvos")
                ? "border-caramel-deep bg-caramel-deep text-paper"
                : "border-line-strong bg-paper text-espresso",
            )}
          >
            <Icon name="heart" size={18} fill={filters.includes("salvos") ? "currentColor" : "none"} />
            {saved.length ? (
              <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-night text-[0.6875rem] font-semibold text-white tabular-nums">
                {saved.length}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => {
              setFiltersOpen(true);
              filterDialog.current?.showModal();
            }}
            aria-haspopup="dialog"
            className="press inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong bg-paper px-4 text-sm font-semibold text-espresso"
          >
            Filtros
            {activeFilters ? (
              <span className="grid size-5 place-items-center rounded-full bg-caramel-deep text-xs text-white tabular-nums">
                {activeFilters}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <dialog
        ref={filterDialog}
        aria-label="Filtros do cardápio"
        onClose={() => setFiltersOpen(false)}
        className="drawer lg:hidden"
      >
        <div className="px-5 pt-3 pb-6">
          <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-sand" />
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-[2rem] leading-none">Filtros</h2>
            <button
              type="button"
              onClick={() => filterDialog.current?.close()}
              className="press -mr-2 grid size-11 place-items-center rounded-full hover:bg-cream-soft"
              aria-label="Fechar filtros"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="mt-5">{filtersOpen ? filterList : null}</div>
          <Button className="mt-8 w-full" onClick={() => filterDialog.current?.close()}>
            {`Ver ${plural(results.length, "item", "itens")}`}
          </Button>
        </div>
      </dialog>

      <a
        href="#produtos"
        className="sr-only focus:not-sr-only focus:mt-4 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-night focus:px-4 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para os produtos
      </a>

      <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="scrollbar-none sticky top-[6.5rem] max-h-[calc(100svh-8rem)] overflow-y-auto pb-6">
            <h2 className="font-sans text-sm font-semibold text-espresso">Categorias</h2>
            <div role="group" aria-label="Categorias do cardápio">
              {categoryList(false)}
            </div>
            <h2 className="mt-9 font-sans text-sm font-semibold text-espresso">Filtros</h2>
            <div className="mt-3">{filterList}</div>
          </div>
        </aside>

        <div id="produtos" tabIndex={-1} className="min-w-0 scroll-mt-40 outline-none lg:scroll-mt-28">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p aria-live="polite" className="text-sm text-mocha">
              {plural(results.length, "item", "itens")}
              {deferredQuery ? ` para "${deferredQuery}"` : ""}
              {category ? ` em ${names.get(category)}` : ""}
            </p>
            {category || activeFilters || query ? (
              <button
                type="button"
                onClick={resetAll}
                className="press inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-caramel-deep hover:text-caramel-dark"
              >
                <Icon name="close" size={14} />
                Limpar tudo
              </button>
            ) : null}
          </div>

          <div key={`${category ?? "todas"}|${filtersParam ?? ""}`} className="results-enter">
            {results.length === 0 ? (
              <EmptyState
                className="mt-8"
                icon={savedEmpty ? "heart" : "search"}
                title={savedEmpty ? "Sua seleção ainda está vazia" : "Nada encontrado por aqui"}
                action={
                  <Button variant="outline" onClick={resetAll}>
                    Limpar busca e filtros
                  </Button>
                }
              >
                {savedEmpty
                  ? "Toque no coração dos itens que quiser lembrar. A seleção fica guardada só neste aparelho."
                  : "Tente outro nome ou tire algum filtro."}
              </EmptyState>
            ) : grouped ? (
              sections.map((section, i) => (
                <section key={section.id} aria-labelledby={`cat-${section.id}`} className={i ? "mt-16" : "mt-6"}>
                  <header className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
                    <h2
                      id={`cat-${section.id}`}
                      className="text-[2rem] leading-none tracking-[-0.01em] sm:text-[2.5rem]"
                    >
                      {section.name}
                    </h2>
                    <span className="shrink-0 text-sm text-mocha tabular-nums">
                      {plural(section.items.length, "item", "itens")}
                    </span>
                  </header>
                  {section.description ? <p className="mt-3 max-w-2xl text-mocha">{section.description}</p> : null}
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{section.items.map(renderCard)}</ul>
                </section>
              ))
            ) : (
              <>
                <h2 className="sr-only">Resultados</h2>
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.map(renderCard)}</ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
