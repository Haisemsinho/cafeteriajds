import { Gallery } from "@/components/gallery/Gallery";
import { CtaBand } from "@/components/ui/CtaBand";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/photos";
import { cn, delay } from "@/lib/cn";
import { getGallery } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { business } from "@/content/business";

export const metadata = pageMetadata({
  title: "Experiência",
  description: `A fachada de ripas, a varanda, o salão e os detalhes da ${business.name} em fotos.`,
  path: "/experiencia",
});

const spaces = [
  {
    title: "A fachada",
    text: "Ripas verticais em madeira avermelhada dão ritmo à fachada e emolduram o letreiro da casa. Portas de vidro deixam ver o salão desde a calçada.",
    photo: photos.letreiro,
    ratio: "4/3",
    span: "lg:col-span-5",
  },
  {
    title: "A varanda",
    text: "Um deck de madeira com mesa alta e banquetas, encostado no vidro. Um cantinho para ver a rua passar.",
    photo: photos.varanda,
    ratio: "3/4",
    span: "lg:col-span-3",
  },
  {
    title: "O salão",
    text: "Prateleiras em madeira clara junto ao tijolo aparente, plantas pendentes e o balcão em pedra.",
    photo: photos.prateleiras,
    ratio: "3/4",
    span: "lg:col-span-4",
  },
];

export default function ExperienciaPage() {
  const order = ["xicara", "fachada", "dia-do-cafe", "balcao"];
  const details = getGallery()
    .filter((g) => order.includes(g.id))
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return (
    <>
      <section className="border-b border-line bg-cream-soft">
        <div className="page-x grid items-end gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-7">
            <h1 className="hero-in text-display text-espresso">Entre a madeira e a luz</h1>
            <p className="hero-in mt-6 max-w-md text-lede text-mocha" style={delay(1)}>
              A fachada de ripas, a varanda de entrada, o salão e os detalhes do balcão, nas fotos da casa.
            </p>
          </div>
          <PhotoFrame
            photo={photos.interior}
            ratio="9/14"
            rounded="rounded-[1.75rem]"
            priority
            sizes="(min-width: 1024px) 20rem, 60vw"
            className="hero-in w-3/5 max-w-xs justify-self-end lg:col-span-4 lg:col-start-9 lg:w-full"
          />
        </div>
      </section>

      <section aria-labelledby="ambientes-title" className="page-x py-24 sm:py-32">
        <SectionHeading
          id="ambientes-title"
          title="Arquitetura e ambiente"
          intro="Madeira, tijolo e vidro: o que se vê de fora e o que se encontra lá dentro."
        />
        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {spaces.map((space, i) => (
            <article key={space.title} className={cn(space.span, i === 0 && "sm:col-span-2")}>
              <h3 className="font-display text-[2rem] leading-none font-normal tracking-[-0.01em] text-espresso">
                {space.title}
              </h3>
              <p className="mt-3 mb-6 max-w-sm text-[0.9375rem] leading-relaxed text-mocha">{space.text}</p>
              <PhotoFrame
                photo={space.photo}
                ratio={space.ratio}
                rounded="rounded-[1.5rem]"
                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw"
                className={cn(i > 0 && "max-w-sm")}
              />
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="detalhes-title" className="bg-cream-soft py-24 sm:py-32">
        <div className="page-x">
          <SectionHeading
            id="detalhes-title"
            title="Detalhes de perto"
            intro="Toque em uma foto para ampliar. Use as setas do teclado ou deslize para navegar."
          />
          <div className="mt-12">
            <Gallery images={details} layout="editorial" />
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
