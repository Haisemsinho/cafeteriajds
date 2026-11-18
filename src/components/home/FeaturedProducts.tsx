import Link from "next/link";
import { cardActionClass, ProductCard } from "@/components/menu/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getFeaturedProducts, getInstagram } from "@/lib/content";

export function FeaturedProducts() {
  const featured = getFeaturedProducts(6);
  const instagram = getInstagram();
  const hasDrafts = featured.some((p) => p.dataStatus === "draft");

  return (
    <section aria-labelledby="destaques-title" className="bg-cream-soft py-20 sm:py-24">
      <div className="page-x">
        <SectionHeading
          id="destaques-title"
          eyebrow={home.featured.eyebrow}
          title={home.featured.title}
          intro={home.featured.subtitle}
          align="center"
        />
        {hasDrafts ? (
          <p className="mx-auto mt-6 flex w-fit max-w-full items-start gap-2 rounded-xl border border-caramel/30 bg-white px-4 py-2.5 text-left text-sm text-mocha sm:items-center sm:rounded-full">
            <Icon name="info" size={16} className="shrink-0 text-caramel-deep" />
            {home.featured.demoNotice}
          </p>
        ) : null}

        {featured.length ? (
          <>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {featured.map((product) => (
                <li key={product.id}>
                  <ProductCard
                    product={product}
                    categoryName={product.categoryName}
                    action={
                      <Link href={`/cardapio/${product.slug}`} className={cardActionClass}>
                        Ver detalhes
                        <span className="sr-only"> de {product.name}</span>
                      </Link>
                    }
                  />
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <ButtonLink href={home.featured.cta.href} variant="dark" icon="arrowRight">
                {home.featured.cta.label}
              </ButtonLink>
            </div>
          </>
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
