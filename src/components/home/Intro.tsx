import { TextLink } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { home } from "@/content/home";
import { photos } from "@/content/photos";

export function Intro() {
  return (
    <section aria-labelledby="intro-title" className="page-x py-20 sm:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-3">{home.intro.eyebrow}</p>
          <h2 id="intro-title" className="text-h2">
            {home.intro.title}
          </h2>
          <div className="mt-5 space-y-4 text-lede text-mocha">
            {home.intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <TextLink href={home.intro.link.href} className="mt-6">
            {home.intro.link.label}
          </TextLink>
        </div>
        <PhotoFrame
          photo={photos.interior}
          ratio="4/5"
          sizes="(min-width: 768px) 40vw, 100vw"
          className="mx-auto w-full max-w-md md:max-w-none"
        />
      </div>
    </section>
  );
}
