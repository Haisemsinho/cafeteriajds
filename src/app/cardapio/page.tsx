import { PageHero } from "@/components/layout/PageHero";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { getInstagram, getMenu } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Cardápio",
  description: "Cafés, bebidas geladas, salgados e doces da JDS Cafeteria. Busque por nome e filtre por categoria.",
  path: "/cardapio",
});

export default function CardapioPage() {
  const { categories, products } = getMenu();
  const hasDrafts = products.some((p) => p.dataStatus === "draft");

  return (
    <>
      <PageHero
        eyebrow="JDS Cafeteria"
        title="Cardápio"
        intro="Feito para acompanhar seus melhores momentos. Busque pelo nome, filtre por categoria e toque em um item para ver os detalhes."
        draftNote={
          hasDrafts
            ? "Itens, ilustrações e preços de exemplo. O cardápio oficial entra quando a JDS confirmar produtos e preços."
            : undefined
        }
      />
      <MenuBrowser
        categories={categories.map(({ id, name, description }) => ({ id, name, description }))}
        products={products}
        instagramUrl={getInstagram()?.url}
      />
    </>
  );
}
