import { ButtonLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { DraftTag } from "@/components/ui/Tag";
import { photos } from "@/content/photos";
import { getStory } from "@/lib/content";

export function StoryTeaser() {
  const { intro } = getStory();

  return (
    <section aria-labelledby="historia-title" className="page-x py-20 sm:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <PhotoFrame photo={photos.letreiro} ratio="4/3" sizes="(min-width: 768px) 45vw, 100vw" />
        <div>
          <p className="eyebrow mb-3">Nossa história</p>
          <h2 id="historia-title" className="text-h2">
            Cada lugar tem uma história
          </h2>
          {intro.length ? (
            <div className="mt-5 space-y-3 text-lede text-mocha">
              <DraftTag label="Texto provisório" />
              <p>{intro[0]}</p>
            </div>
          ) : (
            <p className="mt-5 text-lede text-mocha">
              A da JDS começa na fachada de ripas e continua em cada mesa. Conheça um pouco mais da casa.
            </p>
          )}
          <ButtonLink href="/experiencia" variant="outline" icon="arrowRight" className="mt-7">
            Conhecer a cafeteria
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
