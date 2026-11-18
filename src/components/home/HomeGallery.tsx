import { Gallery } from "@/components/gallery/Gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/home";
import { getGallery } from "@/lib/content";

const preferred = ["fachada", "varanda", "prateleiras", "balcao", "dia-do-cafe"];

function rank(id: string) {
  const i = preferred.indexOf(id);
  return i === -1 ? preferred.length : i;
}

export function HomeGallery() {
  const images = getGallery()
    .filter((g) => preferred.includes(g.id))
    .sort((a, b) => rank(a.id) - rank(b.id));
  if (!images.length) return null;

  return (
    <section aria-labelledby="galeria-title" className="bg-cream-soft py-24 lg:py-32">
      <div className="page-x">
        <SectionHeading id="galeria-title" title={home.gallery.title} intro={home.gallery.intro} align="center" />
        <div className="mt-12">
          <Gallery images={images} layout={images.length === 5 ? "feature" : "grid"} />
        </div>
      </div>
    </section>
  );
}
