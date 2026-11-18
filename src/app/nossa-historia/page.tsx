import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DraftTag } from "@/components/ui/Tag";
import { photos } from "@/content/photos";
import { storyPage } from "@/content/story";
import { getStory } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Nossa História",
  description: storyPage.description,
  path: "/nossa-historia",
});

export default function NossaHistoriaPage() {
  const { intro, blocks, pending, philosophy } = getStory();

  return (
    <>
      <PageHero
        eyebrow={storyPage.hero.eyebrow}
        title={storyPage.hero.title}
        intro={storyPage.hero.intro}
        photo={photos.letreiro}
      />

      <section aria-labelledby="marca-title" className="page-x py-20 sm:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading id="marca-title" eyebrow="A marca" title="Um lugar para ficar" />
          <div className="space-y-4 text-lede text-mocha">
            {intro.length ? (
              <>
                <DraftTag label="Texto provisório" />
                {intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </>
            ) : (
              <p>{storyPage.about}</p>
            )}
          </div>
        </div>
      </section>

      {blocks.length || pending.length ? (
        <section aria-labelledby="capitulos-title" className="bg-cream-soft py-20 sm:py-24">
          <div className="page-x">
            <SectionHeading id="capitulos-title" eyebrow="Capítulos" title={storyPage.chaptersTitle} />
            <ol className="mt-10 grid gap-5 md:grid-cols-2">
              {blocks.map((block) => (
                <li key={block.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                  {block.image ? (
                    <PhotoFrame photo={block.image} ratio="16/9" sizes="(min-width: 768px) 45vw, 100vw" />
                  ) : null}
                  <div className="p-6">
                    <h3 className="text-h3">{block.title}</h3>
                    {block.status === "draft" ? <DraftTag className="mt-2" label="Texto provisório" /> : null}
                    <div className="mt-3 space-y-3 text-mocha">
                      {block.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
              {pending.map((block) => (
                <li key={block.id} className="rounded-2xl border border-dashed border-caramel-deep/40 bg-white p-6">
                  <p className="text-xs font-semibold text-caramel-deep">A preencher</p>
                  <h3 className="mt-1.5 text-h3">{block.title}</h3>
                  <p className="mt-1.5 text-sm text-mocha">{block.hint}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {philosophy ? (
        <section aria-labelledby="filosofia-title" className="page-x py-20 sm:py-24">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <SectionHeading id="filosofia-title" eyebrow="Jeito de receber" title={philosophy.title} />
              {philosophy.status === "draft" ? <DraftTag className="mt-4" label="Proposta de texto" /> : null}
            </div>
            <ul className="divide-y divide-line border-y border-line">
              {philosophy.points.map((point) => (
                <li key={point.title} className="py-5">
                  <h3 className="text-h3">{point.title}</h3>
                  <p className="mt-1 text-mocha">{point.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="casa-fotos-title" className="bg-cream-soft py-20 sm:py-24">
        <div className="page-x">
          <SectionHeading id="casa-fotos-title" eyebrow="A casa" title="O que as fotos já contam" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <PhotoFrame photo={photos.fachada} ratio="4/5" sizes="(min-width: 1024px) 24rem, 50vw" caption />
            <PhotoFrame photo={photos.prateleiras} ratio="4/5" sizes="(min-width: 1024px) 24rem, 50vw" caption />
            <PhotoFrame
              photo={photos.diaDoCafe}
              ratio="4/5"
              sizes="(min-width: 1024px) 24rem, 100vw"
              caption
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </section>

      <CtaBand
        title="Conheça o espaço pessoalmente"
        text="As fotos ajudam, mas nada substitui uma xícara na mesa."
        primary={{ href: "/experiencia", label: "Ver o espaço" }}
        secondary={{ href: "/contato", label: "Como visitar" }}
      />
    </>
  );
}
