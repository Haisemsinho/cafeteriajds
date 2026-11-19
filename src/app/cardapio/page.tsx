import { PageHero } from "@/components/layout/PageHero";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { getInstagram, getMenu, getScenes } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { business } from "@/content/business";
import { MenuUnitBar } from "@/components/order/MenuUnitBar";
import { showDrafts } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Cardápio",
  description: `Cafés, bebidas geladas, salgados e doces da ${business.name}. Busque por nome e filtre por categoria.`,
  path: "/cardapio",
});

export default function CardapioPage() {
  const { categories, products } = getMenu();
  const hasDrafts = products.some((p) => p.dataStatus === "draft");

  return (
    <>
      <PageHero
        title="Cardápio"
        backdrop={getScenes().menu}
        compact
        draftNote={
          hasDrafts
            ? `Itens, fotos ilustrativas e preços de exemplo. O cardápio oficial entra quando a ${business.shortName} confirmar produtos e preços.`
            : undefined
        }
      />
      {showDrafts ? <MenuUnitBar /> : null}
      <MenuBrowser
        categories={categories.map(({ id, name, description }) => ({ id, name, description }))}
        products={products}
        instagramUrl={getInstagram()?.url}
      />
    </>
  );
}
