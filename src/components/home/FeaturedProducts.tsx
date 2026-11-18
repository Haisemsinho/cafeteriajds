import Link from "next/link";
import { cardActionClass, ProductCard } from "@/components/menu/ProductCard";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
          eyebrow="Do nosso cardápio"
          title="Produtos em destaque"
          intro={
            hasDrafts
              ? "Itens, ilustrações e preços de exemplo, só para apresentar o layout. O cardápio oficial entra quando a JDS confirmar."
              : "Alguns dos favoritos da casa."
          }
          action={featured.length ? <TextLink href="/cardapio">Ver cardápio completo</TextLink> : undefined}
        />

        {featured.length ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featured.map((product) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  categoryName={product.categoryName}
                  action={
                    <Link href={`/cardapio?item=${product.slug}`} className={cardActionClass}>
                      Ver detalhes
                      <Icon name="arrowRight" size={16} />
                      <span className="sr-only"> de {product.name}</span>
                    </Link>
                  }
                />
              </li>
            ))}
          </ul>
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
