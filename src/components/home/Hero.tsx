import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { home } from "@/content/home";
import { getScenes } from "@/lib/content";
import { delay } from "@/lib/cn";

export function Hero() {
  const { hero } = getScenes();
  const shared = { alt: "", sizes: "100vw", quality: 80, fetchPriority: "high" as const, loading: "eager" as const };
  const desktop = getImageProps({ ...shared, src: hero.desktop.src }).props;
  const { srcSet: mobileSrcSet, ...mobile } = getImageProps({ ...shared, src: hero.mobile.src }).props;
  const focus = {
    "--focus": hero.mobile.positionMobile ?? hero.mobile.position ?? "50% 50%",
    "--focus-md": hero.desktop.position ?? "50% 50%",
  } as CSSProperties;
  const [lead, name] = home.hero.titleLines;

  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate -mt-16 flex h-[100svh] max-h-[62rem] min-h-[36rem] items-end overflow-hidden bg-night text-white lg:-mt-[4.5rem]"
    >
      <div aria-hidden className="hero-photo absolute inset-0 -z-20">
        <picture className="block size-full">
          <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
          <img
            {...mobile}
            srcSet={mobileSrcSet}
            alt=""
            style={focus}
            className="size-full object-cover object-(--focus) md:object-(--focus-md)"
          />
        </picture>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_11_9/0.92)_0%,rgb(14_11_9/0.55)_42%,rgb(14_11_9/0.3)_100%)] md:bg-[linear-gradient(to_top,rgb(14_11_9/0.85)_0%,rgb(14_11_9/0.2)_55%,rgb(14_11_9/0.35)_100%),linear-gradient(90deg,rgb(14_11_9/0.75)_0%,rgb(14_11_9/0.15)_70%)]"
      />

      <div aria-hidden className="hero-curtain -z-10" />

      <div className="page-x pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <p className="hero-in flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-caramel-light uppercase">
            <span aria-hidden className="h-px w-8 bg-caramel-light/70" />
            {home.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-5 text-display text-white">
            <span className="hero-line">
              <span style={delay(1)}>{lead}</span>
            </span>
            <span className="hero-line">
              <span style={delay(2)} className="text-caramel-light">
                {name}
              </span>
            </span>
          </h1>
          <p className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl" style={delay(3)}>
            {home.hero.subtitle}
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 xs:flex-row" style={delay(4)}>
            <ButtonLink href={home.hero.primary.href} icon="arrowRight" className="xs:min-w-52">
              {home.hero.primary.label}
            </ButtonLink>
            <ButtonLink href={home.hero.secondary.href} variant="outline-light" className="xs:min-w-52">
              {home.hero.secondary.label}
            </ButtonLink>
          </div>
        </div>

        <div
          className="hero-in mt-12 flex items-end justify-between gap-6 border-t border-white/15 pt-5"
          style={delay(5)}
        >
          <p className="hidden items-center gap-3 text-xs font-medium tracking-[0.16em] text-white/70 uppercase sm:flex">
            <span aria-hidden className="h-8 w-px bg-white/40" />
            {home.hero.scrollHint}
          </p>
          <PhotoCredit photo={hero.desktop} tone="dark" className="ml-auto text-right" />
        </div>
      </div>
    </section>
  );
}
