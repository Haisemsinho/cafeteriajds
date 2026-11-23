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
  const inReview = products.some((p) => p.dataStatus === "review");
  const unitPending = products.some((p) => p.unitStatus === "pending");

  return (
    <>
      <PageHero
        title="Cardápio"
        backdrop={getScenes().menu}
        compact
        draftLabel={inReview ? "Em conferência" : undefined}
        draftNote={
          inReview
            ? `Cardápio transcrito da foto enviada pela ${business.shortName}, em conferência. Preços, unidade e disponibilidade ainda não foram confirmados.`
            : hasDrafts
              ? `Itens, fotos ilustrativas e preços de exemplo. O cardápio oficial entra quando a ${business.shortName} confirmar produtos e preços.`
              : undefined
        }
      />
      {showDrafts ? (
        <MenuUnitBar
          note={
            unitPending
              ? "Ainda não sabemos de qual unidade é este cardápio. Até a confirmação, ele aparece igual nas duas."
              : "Na demonstração, as duas unidades usam o mesmo cardápio de exemplo."
          }
        />
      ) : null}
      <MenuBrowser
        categories={categories.map(({ id, name, description }) => ({ id, name, description }))}
        products={products}
        instagramUrl={getInstagram()?.url}
      />
    </>
  );
}
