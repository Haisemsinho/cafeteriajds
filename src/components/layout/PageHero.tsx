import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { DraftTag } from "@/components/ui/Tag";
import { cn, delay } from "@/lib/cn";
import type { Photo } from "@/types/content";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  photo?: Photo;
  photoRatio?: string;
  backdrop?: Photo;
  draftNote?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, photo, photoRatio = "4/3", backdrop, draftNote, children }: Props) {
  const dark = Boolean(backdrop);
  const text = (
    <div className="max-w-2xl">
      <p className={cn("hero-in eyebrow mb-5", dark && "text-caramel-light")}>{eyebrow}</p>
      <h1 className={cn("hero-in text-h1", dark ? "text-white" : "text-espresso")} style={delay(1)}>
        {title}
      </h1>
      {intro ? (
        <div className={cn("hero-in mt-6 text-lede", dark ? "text-white/85" : "text-mocha")} style={delay(2)}>
          {intro}
        </div>
      ) : null}
      {draftNote ? (
        <p
          className={cn("hero-in mt-6 flex items-start gap-2.5 text-sm", dark ? "text-white/80" : "text-mocha")}
          style={delay(3)}
        >
          <DraftTag className="mt-px shrink-0" />
          {draftNote}
        </p>
      ) : null}
      {children ? (
        <div className="hero-in mt-8" style={delay(3)}>
          {children}
        </div>
      ) : null}
    </div>
  );

  if (backdrop) {
    const focus = {
      "--focus": backdrop.positionMobile ?? backdrop.position ?? "50% 50%",
      "--focus-md": backdrop.position ?? "50% 50%",
    } as CSSProperties;
    return (
      <section className="on-dark relative isolate overflow-hidden bg-night text-white">
        <div aria-hidden className="hero-photo absolute inset-0 -z-20">
          <Image
            src={backdrop.src}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            style={focus}
            className="object-cover object-(--focus) md:object-(--focus-md)"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_11_9/0.92)_0%,rgb(14_11_9/0.6)_55%,rgb(14_11_9/0.45)_100%)] md:bg-[linear-gradient(90deg,rgb(14_11_9/0.9)_0%,rgb(14_11_9/0.55)_55%,rgb(14_11_9/0.25)_100%)]"
        />
        <div aria-hidden className="hero-curtain -z-10" />
        <div className="page-x flex min-h-[24rem] flex-col justify-end pt-24 pb-12 sm:min-h-[28rem] sm:pb-16">
          {text}
          <PhotoCredit photo={backdrop} tone="dark" className="mt-8 self-end" />
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-line bg-cream-soft">
      <div className={cn("page-x py-16 sm:py-24", photo && "grid items-center gap-12 md:grid-cols-12 lg:gap-10")}>
        <div className={cn(photo && "md:col-span-6")}>{text}</div>
        {photo ? (
          <PhotoFrame
            photo={photo}
            ratio={photoRatio}
            priority
            rounded="rounded-[1.75rem]"
            sizes="(min-width: 768px) 42vw, 100vw"
            className="hero-in mx-auto w-full max-w-lg md:col-span-6 md:col-start-7 md:max-w-none lg:col-span-5 lg:col-start-8"
          />
        ) : null}
      </div>
    </section>
  );
}
