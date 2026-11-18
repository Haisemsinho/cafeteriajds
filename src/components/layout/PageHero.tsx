import type { ReactNode } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { DraftTag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  photo?: Photo;
  photoRatio?: string;
  draftNote?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, photo, photoRatio = "4/3", draftNote, children }: Props) {
  return (
    <section className="border-b border-line bg-cream-soft">
      <div className={cn("page-x py-12 sm:py-16", photo && "grid items-center gap-10 md:grid-cols-2 lg:gap-16")}>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-h1 text-espresso">{title}</h1>
          {intro ? <div className="mt-4 text-lede text-mocha">{intro}</div> : null}
          {draftNote ? (
            <p className="mt-5 flex items-start gap-2.5 text-sm text-mocha">
              <DraftTag className="mt-px shrink-0" />
              {draftNote}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
        {photo ? (
          <PhotoFrame
            photo={photo}
            ratio={photoRatio}
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="mx-auto w-full max-w-lg md:max-w-none"
          />
        ) : null}
      </div>
    </section>
  );
}
