import { getImageProps } from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { home } from "@/content/home";
import { heroPhotos } from "@/content/photos";
import { delay } from "@/lib/cn";

export function Hero() {
  const shared = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
  const desktop = getImageProps({ ...shared, src: heroPhotos.desktop.src }).props;
  const { srcSet: mobileSrcSet, ...mobile } = getImageProps({ ...shared, src: heroPhotos.mobile.src }).props;

  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex h-[86svh] max-h-[52rem] min-h-[34rem] items-center overflow-hidden bg-night text-white md:h-[80vh]"
    >
      <div aria-hidden className="slow-zoom absolute inset-0 -z-20">
        <picture className="block size-full">
          <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
          <img {...mobile} srcSet={mobileSrcSet} alt="" className="size-full object-cover object-[50%_25%] md:object-[60%_50%]" />
        </picture>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/60" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(0_0_0/0.45)_100%)]"
      />

      <div className="page-x text-center">
        <p className="rise text-sm font-semibold tracking-[0.08em] text-white uppercase">{home.hero.eyebrow}</p>
        <h1 id="hero-title" className="rise mx-auto mt-4 max-w-3xl text-display text-white" style={delay(1)}>
          {home.hero.title}
        </h1>
        <p className="rise mx-auto mt-5 max-w-xl text-lg text-white sm:text-xl" style={delay(2)}>
          {home.hero.subtitle}
        </p>
        <div className="rise mt-9 flex flex-col justify-center gap-3 xs:flex-row" style={delay(3)}>
          <ButtonLink href={home.hero.primary.href} icon="arrowRight" className="min-w-52">
            {home.hero.primary.label}
          </ButtonLink>
          <ButtonLink href={home.hero.secondary.href} variant="outline-light" className="min-w-52">
            {home.hero.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
