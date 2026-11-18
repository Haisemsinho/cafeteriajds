"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { useSavedItems } from "@/hooks/useSavedItems";
import { setUrlParams, useUrlParam } from "@/hooks/useUrlParam";
import { cn } from "@/lib/cn";
import { normalize, plural } from "@/lib/format";
import type { MenuCategory, MenuProduct } from "@/types/content";
import { cardActionClass, ProductCard } from "./ProductCard";

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
  const query = queryParam ?? "";
  const deferredQuery = useDeferredValue(query);
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

  const results = useMemo(() => {
    const q = normalize(deferredQuery);
    return products.filter((p) => {
      if (category && p.categoryId !== category) return false;
      if (q && !normalize(`${p.name} ${p.description}`).includes(q)) return false;
      return filters.every((id) => filterDefs.find((f) => f.id === id)?.test(p, saved));
    });
  }, [products, category, deferredQuery, filters, saved]);

  const grouped = !deferredQuery && filters.length === 0;
  const sections = grouped
    ? categories
        .map((c) => ({ ...c, items: results.filter((p) => p.categoryId === c.id) }))
        .filter((s) => s.items.length)
    : [];

  const setQuery = (value: string) => setQueryParam(value || null);

  const toggleFilter = (id: FilterId) => {
    const next = filters.includes(id) ? filters.filter((f) => f !== id) : [...filters, id];
    setFiltersParam(next.length ? next.join(",") : null);
  };

  const resetAll = () => setUrlParams({ busca: null, filtros: null, categoria: null });

  const context = new URLSearchParams();
  if (category) context.set("categoria", category);
  if (query) context.set("busca", query);
  if (filtersParam) context.set("filtros", filtersParam);
  const from = context.toString();
  const detailHref = (slug: string) => (from ? `/cardapio/${slug}?de=${encodeURIComponent(from)}` : `/cardapio/${slug}`);

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
          Estamos preparando o cardápio para o site. Passe na JDS ou acompanhe as novidades pelo Instagram.
        </EmptyState>
      </div>
    );
  }

  const renderCard = (product: MenuProduct) => {
    const isSaved = saved.includes(product.id);
    return (
      <li key={product.id}>
        <ProductCard
          product={product}
          categoryName={grouped ? undefined : names.get(product.categoryId)}
          corner={
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={isSaved}
              aria-label={`Salvar ${product.name} na minha seleção`}
              className={cn(
                "grid size-11 place-items-center rounded-full bg-white/95 shadow-sm transition-colors duration-200",
                isSaved ? "text-caramel-deep" : "text-mocha hover:text-espresso",
              )}
            >
              <Icon name="heart" size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          }
          action={
            <Link href={detailHref(product.slug)} className={cardActionClass}>
              Ver detalhes
              <span className="sr-only"> de {product.name}</span>
            </Link>
          }
        />
      </li>
    );
  };

  const savedEmpty = filters.includes("salvos") && saved.length === 0;

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur-sm lg:top-[4.5rem]">
        <div className="page-x flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-6">
          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative md:w-72 md:shrink-0">
            <label htmlFor="busca-cardapio" className="sr-only">
              Buscar no cardápio
            </label>
            <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mocha" />
            <input
              id="busca-cardapio"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar pelo nome"
              autoComplete="off"
              enterKeyHint="search"
              className="h-11 w-full rounded-md border border-line-strong bg-paper pr-10 pl-10 text-[0.9375rem] text-espresso transition-colors placeholder:text-mocha/80 focus:border-caramel-deep focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-0.5 grid size-10 -translate-y-1/2 place-items-center rounded-md text-mocha hover:text-espresso"
                aria-label="Limpar busca"
              >
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </form>

          <nav aria-label="Categorias do cardápio" className="-mx-5 min-w-0 flex-1 sm:-mx-8 md:mx-0">
            <ul className="scrollbar-none flex gap-1.5 overflow-x-auto px-5 sm:px-8 md:px-0 xl:flex-wrap">
              <li className="shrink-0">
                <CategoryTab active={!category} onClick={() => setCategory(null)}>
                  Todas
                </CategoryTab>
              </li>
              {categories.map((c) => (
                <li key={c.id} className="shrink-0">
                  <CategoryTab active={category === c.id} onClick={() => setCategory(c.id)}>
                    {c.name}
                  </CategoryTab>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="page-x pt-8 pb-28 sm:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <fieldset className="scrollbar-none -mx-5 flex min-w-0 items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <legend className="sr-only">Filtros rápidos</legend>
            <span aria-hidden className="mr-1 hidden text-sm font-semibold text-espresso sm:inline">
              Filtrar:
            </span>
            {availableFilters.map((f) => {
              const active = filters.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFilter(f.id)}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
                    active
                      ? "border-caramel-deep bg-caramel-deep text-paper"
                      : "border-line-strong bg-paper text-mocha hover:border-espresso hover:text-espresso",
                  )}
                >
                  {active ? <Icon name="check" size={14} /> : null}
                  {f.id === "salvos" ? <Icon name="heart" size={14} fill={active ? "currentColor" : "none"} /> : null}
                  {f.label}
                  {f.id === "salvos" ? <span className="tabular-nums opacity-75">({saved.length})</span> : null}
                </button>
              );
            })}
          </fieldset>
          <p aria-live="polite" className="shrink-0 text-sm text-mocha">
            {plural(results.length, "item", "itens")}
            {deferredQuery ? ` para "${deferredQuery}"` : ""}
          </p>
        </div>

        <div>
          {results.length === 0 ? (
            <EmptyState
              className="mt-12"
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
            sections.map((section) => (
              <section key={section.id} aria-labelledby={`cat-${section.id}`} className="mt-12 sm:mt-14">
                <header className="flex items-baseline justify-between gap-6">
                  <h2 id={`cat-${section.id}`} className="text-h3 sm:text-xl">
                    {section.name}
                  </h2>
                  <span className="shrink-0 text-sm text-mocha">{plural(section.items.length, "item", "itens")}</span>
                </header>
                {section.description ? <p className="mt-2 max-w-2xl text-mocha">{section.description}</p> : null}
                <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{section.items.map(renderCard)}</ul>
              </section>
            ))
          ) : (
            <>
              <h2 className="sr-only">Resultados</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{results.map(renderCard)}</ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-10 items-center rounded-md px-3.5 text-[0.9375rem] whitespace-nowrap transition-colors duration-200",
        active ? "bg-night font-semibold text-white" : "text-mocha hover:bg-cream-soft hover:text-espresso",
      )}
    >
      {children}
    </button>
  );
}
