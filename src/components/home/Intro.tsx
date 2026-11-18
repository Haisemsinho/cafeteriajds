import { TextLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { home } from "@/content/home";
import { photos } from "@/content/photos";
import { getScenes } from "@/lib/content";
import { stagger } from "@/lib/cn";

export function Intro() {
  const { intro } = getScenes();

  return (
    <section aria-labelledby="intro-title" className="page-x py-24 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow mb-5">
            {home.intro.eyebrow}
          </p>
          <h2 id="intro-title" data-reveal style={stagger(1)} className="text-h1">
            {home.intro.title}
          </h2>
          <div data-reveal style={stagger(2)} className="mt-7 space-y-5 text-lede text-mocha">
            {home.intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div data-reveal style={stagger(3)}>
            <TextLink href={home.intro.link.href} className="mt-6">
              {home.intro.link.label}
            </TextLink>
          </div>
        </div>

        <div className="relative pb-16 sm:pb-20 lg:col-span-6 lg:col-start-7 lg:pb-24">
          <PhotoFrame
            photo={intro}
            ratio="4/5"
            rounded="rounded-[2rem]"
            badge="top-4 right-4"
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 80vw, 92vw"
            className="ml-auto w-[88%] sm:w-[78%]"
          />
          <div data-parallax className="absolute bottom-0 left-0 w-[52%] sm:w-[46%]">
            <PhotoFrame
              photo={photos.xicara}
              ratio="4/3"
              rounded="rounded-[1.5rem]"
              sizes="(min-width: 1024px) 20rem, 46vw"
              className="rounded-[1.75rem] bg-porcelain p-2 shadow-[0_30px_60px_-30px_rgb(36_24_16/0.5)] sm:p-2.5"
            />
            <p className="mt-3 pl-2 text-xs font-medium tracking-[0.12em] text-mocha uppercase">
              {photos.xicara.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
