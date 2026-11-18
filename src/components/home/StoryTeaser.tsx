import { ButtonLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { DraftTag } from "@/components/ui/Tag";
import { home } from "@/content/home";
import { photos } from "@/content/photos";
import { getStory } from "@/lib/content";
import { stagger } from "@/lib/cn";

export function StoryTeaser() {
  const { intro } = getStory();

  return (
    <section
      aria-labelledby="historia-title"
      className="on-dark grain overflow-hidden bg-roast py-24 text-white sm:py-32"
    >
      <div className="page-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow mb-5 text-caramel-light">
            {home.story.eyebrow}
          </p>
          <h2 id="historia-title" data-reveal style={stagger(1)} className="text-h1 text-white">
            {home.story.title}
          </h2>
          {intro.length ? (
            <div data-reveal style={stagger(2)} className="mt-7 space-y-4 text-lede text-sand">
              <DraftTag label="Texto provisório" />
              <p>{intro[0]}</p>
            </div>
          ) : (
            <p data-reveal style={stagger(2)} className="mt-7 text-lede text-sand">
              {home.story.fallback}
            </p>
          )}
          <div data-reveal style={stagger(3)}>
            <ButtonLink href={home.story.cta.href} variant="outline-light" icon="arrowRight" className="mt-9">
              {home.story.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <PhotoFrame
              photo={photos.interior}
              ratio="9/14"
              rounded="rounded-[1.5rem]"
              sizes="(min-width: 1024px) 16rem, 42vw"
              className="w-[42%] shrink-0 pt-10 sm:pt-16"
            />
            <div className="flex flex-1 flex-col gap-3 sm:gap-4">
              <PhotoFrame
                photo={photos.letreiro}
                ratio="4/3"
                rounded="rounded-[1.5rem]"
                sizes="(min-width: 1024px) 22rem, 55vw"
              />
              <PhotoFrame
                photo={photos.varanda}
                ratio="1/1"
                rounded="rounded-[1.5rem]"
                sizes="(min-width: 1024px) 16rem, 40vw"
                className="w-[78%]"
              />
            </div>
          </div>
          <p className="mt-5 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-latte uppercase">
            <span aria-hidden className="h-px w-8 bg-latte/60" />
            Fotos da casa
          </p>
        </div>
      </div>
    </section>
  );
}
