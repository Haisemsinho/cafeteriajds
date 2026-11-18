import { Gallery } from "@/components/gallery/Gallery";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/photos";
import { cn } from "@/lib/cn";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experiência",
  description: "A fachada de ripas, a varanda, o salão e os detalhes da JDS Cafeteria em fotos.",
  path: "/experiencia",
});

const spaces = [
  {
    title: "A fachada",
    text: "Ripas verticais em madeira avermelhada dão ritmo à fachada e emolduram o letreiro da casa. Logo abaixo, portas de vidro deixam ver o salão desde a calçada.",
    photo: photos.letreiro,
  },
  {
    title: "A varanda",
    text: "Na entrada, um deck de madeira recebe uma mesa alta com banquetas, encostada no vidro. Um cantinho para quem gosta de ver a rua passar.",
    photo: photos.varanda,
  },
  {
    title: "O salão",
    text: "Prateleiras em madeira clara encostadas no tijolo aparente, plantas pendentes e o balcão em pedra, com seus detalhes artesanais.",
    photo: photos.prateleiras,
  },
];

export default function ExperienciaPage() {
  const images = getGallery();

  return (
    <>
      <PageHero
        eyebrow="Experiência JDS"
        title="Entre a madeira e a luz"
        intro="Um passeio pelos cantos da casa: a fachada de ripas, a varanda de entrada, o salão e os detalhes do balcão."
        photo={photos.interior}
      />

      <section aria-labelledby="ambientes-title" className="page-x py-20 sm:py-24">
        <SectionHeading id="ambientes-title" eyebrow="Ambientes" title="Cada canto tem seu clima" />
        <div className="mt-12 space-y-16 sm:space-y-20">
          {spaces.map((space, i) => (
            <article key={space.title} className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
              <PhotoFrame
                photo={space.photo}
                ratio="4/3"
                sizes="(min-width: 768px) 45vw, 100vw"
                className={cn(i % 2 === 1 && "md:order-2")}
              />
              <div className={cn(i % 2 === 1 && "md:order-1")}>
                <h3 className="text-2xl tracking-[-0.02em]">{space.title}</h3>
                <p className="mt-4 max-w-md text-lede text-mocha">{space.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="galeria-title" className="bg-cream-soft py-20 sm:py-24">
        <div className="page-x">
          <SectionHeading
            id="galeria-title"
            eyebrow="Galeria"
            title="Detalhes de perto"
            intro="Toque em uma foto para ampliar. Use as setas do teclado ou deslize para navegar."
          />
          <div className="mt-10">
            <Gallery images={images} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Venha sentir de perto"
        text="Foto nenhuma substitui o cheiro do café na xícara."
        primary={{ href: "/contato", label: "Como visitar" }}
        secondary={{ href: "/cardapio", label: "Ver cardápio" }}
      />
    </>
  );
}
