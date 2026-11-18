import { Gallery } from "@/components/gallery/Gallery";
import { TextLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGallery } from "@/lib/content";

const preferred = ["varanda", "prateleiras", "balcao", "dia-do-cafe", "fachada", "xicara"];

function rank(id: string) {
  const i = preferred.indexOf(id);
  return i === -1 ? preferred.length : i;
}

export function HomeGallery() {
  const images = [...getGallery()].sort((a, b) => rank(a.id) - rank(b.id)).slice(0, 6);
  if (!images.length) return null;

  return (
    <section aria-labelledby="galeria-title" className="bg-cream-soft py-20 sm:py-24">
      <div className="page-x">
        <SectionHeading
          id="galeria-title"
          eyebrow="Galeria"
          title="Nosso espaço"
          intro="Um pouco da casa. Toque em uma foto para ampliar."
          action={<TextLink href="/experiencia">Ver mais do espaço</TextLink>}
        />
        <div className="mt-10">
          <Gallery images={images} />
        </div>
      </div>
    </section>
  );
}
