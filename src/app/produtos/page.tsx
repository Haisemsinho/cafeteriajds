import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { ProductVisual } from "@/components/menu/ProductParts";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { EmptyState } from "@/components/ui/Feedback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DraftTag, Tag } from "@/components/ui/Tag";
import { photos } from "@/content/photos";
import { getHighlights, getInstagram, getMenu } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import type { Highlight } from "@/types/content";

export const metadata = pageMetadata({
  title: "Produtos e novidades",
  description: "Destaques, novidades e itens sazonais da JDS Cafeteria.",
  path: "/produtos",
});

const kindLabels: Record<Highlight["kind"], string> = {
  destaque: "Destaque",
  novidade: "Novidade",
  sazonal: "Sazonal",
  embalado: "Para levar",
  presente: "Presente",
  kit: "Kit",
};

const groups: { id: string; eyebrow: string; title: string; kinds: Highlight["kind"][] }[] = [
  { id: "novidades", eyebrow: "Destaques e novidades", title: "O que está em alta", kinds: ["destaque", "novidade", "sazonal"] },
  { id: "levar", eyebrow: "Para levar e presentear", title: "Um pouco da JDS para casa", kinds: ["embalado", "presente", "kit"] },
];

export default function ProdutosPage() {
  const highlights = getHighlights();
  const { products } = getMenu();
  const instagram = getInstagram();

  return (
    <>
      <PageHero
        eyebrow="Produtos e novidades"
        title="O que tem de novo na casa"
        intro="Lançamentos do cardápio, itens da estação e o que dá para levar para casa."
        photo={photos.diaDoCafe}
        photoRatio="4/5"
      />

      {highlights.length === 0 ? (
        <div className="page-x py-20">
          <EmptyState
            title="As novidades aparecem aqui"
            action={
              instagram ? (
                <ButtonLink href={instagram.url} external variant="outline" icon="arrowUpRight">
                  Acompanhar no Instagram
                </ButtonLink>
              ) : (
                <ButtonLink href="/cardapio" variant="outline">
                  Ver cardápio
                </ButtonLink>
              )
            }
          >
            Assim que a JDS lançar algo novo, você encontra nesta página.
          </EmptyState>
        </div>
      ) : (
        groups.map((group, gi) => {
          const items = highlights.filter((h) => group.kinds.includes(h.kind));
          if (!items.length) return null;
          return (
            <section
              key={group.id}
              aria-labelledby={`${group.id}-title`}
              className={gi % 2 ? "bg-cream-soft py-20 sm:py-24" : "py-20 sm:py-24"}
            >
              <div className="page-x">
                <SectionHeading id={`${group.id}-title`} eyebrow={group.eyebrow} title={group.title} />
                <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {items.map((item) => {
                    const product = item.productSlug ? products.find((p) => p.slug === item.productSlug) : undefined;
                    return (
                      <li key={item.id}>
                        <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:shadow-[0_22px_44px_-24px_rgb(0_0_0/0.3)]">
                          <div className="relative aspect-[4/3] bg-oat">
                            {item.image ? (
                              <Image
                                src={item.image.src}
                                alt={item.image.alt}
                                fill
                                placeholder="blur"
                                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                                className="object-cover"
                              />
                            ) : product ? (
                              <ProductVisual product={product} sizes="(min-width: 1024px) 24rem, 100vw" />
                            ) : null}
                            <span className="absolute top-3 left-3 flex gap-1.5">
                              <Tag tone="accent">{kindLabels[item.kind]}</Tag>
                              {item.status === "draft" ? <DraftTag /> : null}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="text-h3">{item.title}</h3>
                            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-mocha">{item.description}</p>
                            <div className="mt-auto pt-4">
                              {product ? (
                                <TextLink href={`/cardapio?item=${product.slug}`}>Ver no cardápio</TextLink>
                              ) : (
                                <TextLink href="/contato">Falar com a JDS</TextLink>
                              )}
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })
      )}

      <CtaBand
        title="Quer saber o que saiu hoje?"
        text="Siga a JDS para acompanhar lançamentos e itens da estação."
        primary={
          instagram
            ? { href: instagram.url, label: "Ver o Instagram", external: true }
            : { href: "/cardapio", label: "Ver cardápio" }
        }
        secondary={instagram ? { href: "/cardapio", label: "Cardápio completo" } : undefined}
      />
    </>
  );
}
