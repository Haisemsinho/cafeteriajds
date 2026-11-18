import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBadge } from "@/components/ui/PhotoCredit";
import { home } from "@/content/home";
import { getScenes } from "@/lib/content";
import { delay } from "@/lib/cn";

export function Hero() {
  const { hero } = getScenes();
  const shared = { alt: "", sizes: "100vw", fetchPriority: "high" as const, loading: "eager" as const };
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
      className="on-dark relative isolate -mt-16 flex h-svh min-h-[40rem] items-end overflow-hidden bg-night text-white short:h-auto short:min-h-svh lg:-mt-[4.5rem]"
    >
      <div aria-hidden className="hero-exit-photo absolute inset-0 -z-30">
        <div className="hero-photo size-full">
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
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 hidden md:block md:bg-[linear-gradient(90deg,rgb(14_11_9/0.84)_0%,rgb(14_11_9/0.6)_30%,rgb(14_11_9/0.14)_60%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,rgb(14_11_9/0.6)_0%,transparent_22%,transparent_38%,rgb(14_11_9/0.7)_68%,rgb(14_11_9/0.94)_100%)] md:bg-[linear-gradient(to_bottom,rgb(14_11_9/0.55)_0%,transparent_20%,transparent_62%,rgb(14_11_9/0.6)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(130%_95%_at_62%_42%,transparent_58%,rgb(14_11_9/0.42)_100%)]"
      />
      <div aria-hidden className="hero-curtain -z-10" />

      <PhotoBadge photo={hero.desktop} className="top-20 right-5 sm:right-8 lg:top-24 xl:right-10" />

      <div className="hero-exit-content page-x pb-28 sm:pb-32 short:pt-24 short:pb-20 lg:pb-28">
        <div className="max-w-2xl lg:max-w-3xl">
          <h1 id="hero-title" className="text-display text-white short:text-[3rem]">
            <span className="hero-line">
              <span style={delay(0)}>{lead}</span>
            </span>
            <span className="hero-line">
              <span style={delay(1)} className="text-caramel-light">
                {name}
              </span>
            </span>
          </h1>
          <p
            className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-white/90 sm:text-xl short:mt-3 short:text-base"
            style={delay(2.5)}
          >
            {home.hero.subtitle}
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 xs:flex-row short:mt-5" style={delay(3.5)}>
            <ButtonLink href={home.hero.primary.href} icon="arrowRight" className="xs:min-w-52">
              {home.hero.primary.label}
            </ButtonLink>
            <ButtonLink href={home.hero.secondary.href} variant="outline-light" className="xs:min-w-52">
              {home.hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
