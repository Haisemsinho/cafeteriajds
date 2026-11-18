import { ButtonLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { DraftTag } from "@/components/ui/Tag";
import { home } from "@/content/home";
import { photos } from "@/content/photos";
import { getStory } from "@/lib/content";

export function StoryTeaser() {
  const { intro } = getStory();

  return (
    <section
      aria-labelledby="historia-title"
      className="on-dark grain overflow-hidden bg-roast py-24 text-white sm:py-32"
    >
      <div className="page-x grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="historia-title" className="text-h1 text-white">
            {home.story.title}
          </h2>
          {intro.length ? (
            <div className="mt-7 space-y-4 text-lede text-sand">
              <DraftTag label="Texto provisório" />
              <p>{intro[0]}</p>
            </div>
          ) : (
            <p className="mt-7 text-lede text-sand">{home.story.fallback}</p>
          )}
          <ButtonLink href={home.story.cta.href} variant="outline-light" icon="arrowRight" className="mt-9">
            {home.story.cta.label}
          </ButtonLink>
        </div>

        <div className="flex gap-3 sm:gap-4 lg:col-span-6 lg:col-start-7">
          <PhotoFrame
            photo={photos.interior}
            ratio="5/9"
            rounded="rounded-[1.5rem]"
            sizes="(min-width: 1024px) 15rem, 42vw"
            className="w-[44%] shrink-0"
          />
          <div className="flex flex-1 flex-col gap-3 sm:gap-4">
            <PhotoFrame
              photo={photos.letreiro}
              ratio="4/3"
              rounded="rounded-[1.5rem]"
              sizes="(min-width: 1024px) 20rem, 52vw"
            />
            <PhotoFrame
              photo={photos.varanda}
              ratio="4/3"
              rounded="rounded-[1.5rem]"
              sizes="(min-width: 1024px) 20rem, 52vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
