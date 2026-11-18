import { TextLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { home } from "@/content/home";
import { photos } from "@/content/photos";
import { getScenes } from "@/lib/content";

export function Intro() {
  const { intro } = getScenes();

  return (
    <section aria-labelledby="intro-title" className="relative pt-36 pb-24 sm:pt-44 lg:pt-32">
      <div className="page-x relative">
        <div
          data-moment="rise"
          className="absolute -top-52 right-5 z-10 w-[46%] sm:-top-64 sm:right-8 sm:w-72 lg:-top-56 lg:w-80 xl:right-10"
        >
          <PhotoFrame
            photo={photos.xicara}
            ratio="4/3"
            rounded="rounded-[1.4rem]"
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 18rem, 46vw"
            className="rounded-[1.75rem] bg-porcelain p-2 shadow-[0_40px_80px_-30px_rgb(14_11_9/0.55)] sm:p-2.5"
          />
        </div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="intro-title" className="text-h1">
              {home.intro.title}
            </h2>
            <div className="mt-7 space-y-5 text-lede text-mocha">
              {home.intro.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <TextLink href={home.intro.link.href} className="mt-6">
              {home.intro.link.label}
            </TextLink>
          </div>

          <PhotoFrame
            photo={intro}
            ratio="4/5"
            rounded="rounded-[2rem]"
            badge="bottom-4 left-4"
            sizes="(min-width: 1024px) 34vw, 92vw"
            className="lg:col-span-5 lg:col-start-8 lg:mt-24"
          />
        </div>
      </div>
    </section>
  );
}
