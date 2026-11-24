import Link from "next/link";
import { cardActionClass, ProductCard } from "@/components/menu/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getFeaturedProducts, getInstagram, getMenu } from "@/lib/content";

export function FeaturedProducts() {
  const featured = getFeaturedProducts(4);
  const { categories } = getMenu();
  const [lead, ...rest] = featured;
  const instagram = getInstagram();
  const hasDrafts = featured.some((p) => p.dataStatus === "draft");

  const action = (slug: string, name: string) => (
    <Link href={`/cardapio/${slug}`} className={cardActionClass}>
      Ver detalhes
      <span className="sr-only"> de {name}</span>
    </Link>
  );

  return (
    <section aria-labelledby="destaques-title" className="bg-cream-soft py-24 sm:py-32">
      <div className="page-x">
        <SectionHeading
          id="destaques-title"
          title={home.featured.title}
          intro={home.featured.subtitle}
          action={
            featured.length ? (
              <ButtonLink href={home.featured.cta.href} variant="outline" icon="arrowRight">
                {home.featured.cta.label}
              </ButtonLink>
            ) : undefined
          }
        />
        {hasDrafts ? (
          <p className="mt-8 flex w-fit max-w-full items-start gap-2 rounded-2xl border border-caramel/30 bg-white px-4 py-2.5 text-sm text-mocha sm:items-center sm:rounded-full">
            <Icon name="info" size={16} className="shrink-0 text-caramel-deep" />
            {home.featured.demoNotice}
          </p>
        ) : null}

        {lead ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <ProductCard
                product={lead}
                categoryName={lead.categoryName}
                variant="feature"
                action={action(lead.slug, lead.name)}
              />
            </div>
            {rest.length ? (
              <ul className="grid gap-6 lg:col-span-5 lg:grid-rows-3">
                {rest.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      categoryName={product.categoryName}
                      variant="row"
                      action={action(product.slug, product.name)}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : categories.length ? (
          <EmptyState
            className="mt-10"
            icon="cup"
            title="Conheça o cardápio da casa"
            action={<ButtonLink href="/cardapio">Ver o cardápio</ButtonLink>}
          >
            {categories.map((c) => c.name).join(", ")}.
          </EmptyState>
        ) : (
          <EmptyState
            className="mt-10"
            title="O cardápio está sendo preparado"
            action={
              instagram ? (
                <ButtonLink href={instagram.url} external variant="outline" icon="arrowUpRight">
                  Ver novidades no Instagram
                </ButtonLink>
              ) : undefined
            }
          >
            Em breve, os cafés e as delícias da casa aparecem aqui.
          </EmptyState>
        )}
      </div>
    </section>
  );
}
