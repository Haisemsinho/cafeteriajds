import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cardActionClass, ProductCard } from "@/components/menu/ProductCard";
import { availabilityLabel, ProductVisual, tagLabels, temperatureInfo } from "@/components/menu/ProductParts";
import { BackToMenu } from "@/components/product/BackToMenu";
import { ProductGallery } from "@/components/product/ProductGallery";
import { JsonLd } from "@/components/layout/BusinessJsonLd";
import { ProductOptions } from "@/components/product/ProductOptions";
import { Notice } from "@/components/ui/Feedback";
import { delay } from "@/lib/cn";
import { Tag } from "@/components/ui/Tag";
import { getBusiness, getMenu, getProduct, getRelatedProducts } from "@/lib/content";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return getMenu().products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} | Cardápio`,
    description: product.description,
    alternates: { canonical: `/cardapio/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${getBusiness().name}`,
      description: product.description,
      url: `/cardapio/${product.slug}`,
      ...(product.image ? { images: [{ url: product.image.src.src, alt: product.image.alt }] } : {}),
    },
  };
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const { contact } = getBusiness();
  const photos = product.images?.length ? product.images : product.image ? [product.image] : [];
  const unavailable = availabilityLabel(product);
  const tag = product.tags?.[0];

  const details = [
    product.ingredients?.length ? { label: "Ingredientes", value: product.ingredients.join(", ") } : null,
    product.variants?.some((v) => v.volume)
      ? {
          label: "Tamanhos",
          value: product.variants.map((v) => (v.volume ? `${v.label}, ${v.volume}` : v.label)).join(" · "),
        }
      : null,
    product.temperature ? { label: "Temperatura", value: temperatureInfo[product.temperature].label } : null,
    {
      label: "Alergênicos",
      value: product.allergens
        ? `Contém ${product.allergens.contains.join(", ")}. Informação revisada em ${formatDate(product.allergens.checkedAt)}.`
        : "Tem alguma alergia ou restrição? Fale com a equipe antes de pedir.",
    },
    { label: "Disponibilidade", value: unavailable ?? "Disponível" },
  ].filter((d): d is { label: string; value: string } => d !== null);

  const price = product.priceCents ?? product.variants?.find((v) => v.priceCents)?.priceCents;
  const structured =
    product.dataStatus === "verified"
      ? {
          "@context": "https://schema.org",
          "@type": "MenuItem",
          name: product.name,
          description: product.description,
          url: `${siteUrl}/cardapio/${product.slug}`,
          ...(product.image ? { image: `${siteUrl}${product.image.src.src}` } : {}),
          ...(price ? { offers: { "@type": "Offer", price: (price / 100).toFixed(2), priceCurrency: "BRL" } } : {}),
        }
      : null;

  return (
    <>
      {structured ? <JsonLd data={structured} /> : null}
      <div className="page-x pt-6 pb-16 sm:pt-8 sm:pb-24">
        <BackToMenu />

        <div className="mt-4 grid gap-8 md:mt-6 md:grid-cols-2 md:gap-10 lg:gap-16">
          <div className="hero-in md:sticky md:top-28 md:self-start">
            {photos.length ? (
              <ProductGallery images={photos} name={product.name} />
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-oat md:aspect-[4/5]">
                <ProductVisual product={product} sizes="(min-width: 768px) 45vw, 100vw" label />
              </div>
            )}
          </div>

          <div className="hero-in md:pt-6" style={delay(1)}>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/cardapio?categoria=${product.categoryId}`}
                className="inline-flex min-h-8 items-center text-sm font-semibold text-caramel-deep hover:text-caramel-dark hover:underline"
              >
                {product.categoryName}
              </Link>
              {tag ? (
                <Tag tone={tag === "destaque" || tag === "novidade" ? "accent" : "dark"}>{tagLabels[tag]}</Tag>
              ) : null}
            </div>
            <h1 className="mt-3 text-h1 text-espresso">{product.name}</h1>

            <ProductOptions
              product={product}
              whatsapp={contact.whatsapp}
              greeting={`Olá, ${getBusiness().shortName}!`}
              intro={
                <>
                  <p className="mt-5 text-lede text-mocha">{product.description}</p>
                  {product.dataStatus === "draft" ? (
                    <Notice tone="setup" title="Produto de exemplo" className="mt-5">
                      Nome, descrição, imagem e preço servem só para apresentação. O cardápio oficial será confirmado
                      pela {getBusiness().shortName}.
                    </Notice>
                  ) : null}
                </>
              }
              details={
                <dl className="mt-10 divide-y divide-line border-y border-line">
                  {details.map((d) => (
                    <div key={d.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <dt className="text-sm font-semibold text-espresso">{d.label}</dt>
                      <dd className={unavailable && d.label === "Disponibilidade" ? "text-caramel-deep" : "text-mocha"}>
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              }
            />
          </div>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="relacionados-title" className="bg-cream-soft py-24 sm:py-32">
          <div className="page-x">
            <h2 id="relacionados-title" className="text-h2">
              Você também pode gostar
            </h2>
            <ul className="scrollbar-none -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
              {related.map((item) => (
                <li
                  key={item.id}

                  className="w-[80%] shrink-0 snap-start xs:w-[70%] sm:w-auto"
                >
                  <ProductCard
                    product={item}
                    categoryName={item.categoryName}
                    action={
                      <Link href={`/cardapio/${item.slug}`} className={cardActionClass}>
                        Ver detalhes
                        <span className="sr-only"> de {item.name}</span>
                      </Link>
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
