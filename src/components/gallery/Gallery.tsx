"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/content";

export function Gallery({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const current = images[index];
  const total = images.length;

  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [total]);

  if (!total) return null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-cream"
            >
              <span className="absolute inset-0 transition-transform duration-500 ease-soft group-hover:scale-[1.03]">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 24rem, 50vw"
                  className="object-cover"
                  style={image.position ? { objectPosition: image.position } : undefined}
                />
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-espresso/70 to-transparent p-3 pt-8 text-left text-sm font-medium text-paper sm:p-4 sm:pt-10">
                {image.caption}
              </span>
              <span className="sr-only">Ampliar foto: {image.alt}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Galeria de fotos"
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-sm text-latte tabular-nums" aria-live="polite">
                {index + 1} / {total}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold hover:bg-paper/10"
              >
                Fechar
                <Icon name="close" size={20} />
              </button>
            </div>

            <div
              className="relative flex-1"
              onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => {
                const start = touchX.current;
                const end = e.changedTouches[0]?.clientX;
                touchX.current = null;
                if (start === null || end === undefined || Math.abs(end - start) < 40) return;
                go(end < start ? 1 : -1);
              }}
            >
              <figure key={current.id} className="absolute inset-0 flex flex-col motion-safe:animate-fade-in">
                <div className="relative mx-4 flex-1 sm:mx-20">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
                <figcaption className="px-6 py-4 text-center">
                  <span className="block text-lg font-semibold text-paper">{current.caption}</span>
                  <span className="mx-auto mt-1 block max-w-xl text-xs text-latte">{current.alt}</span>
                </figcaption>
              </figure>

              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-espresso sm:left-5"
                    aria-label="Foto anterior"
                  >
                    <Icon name="chevronLeft" size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper hover:text-espresso sm:right-5"
                    aria-label="Próxima foto"
                  >
                    <Icon name="chevronRight" size={22} />
                  </button>
                </>
              ) : null}
            </div>

            <ul className="scrollbar-none flex justify-start gap-2 overflow-x-auto px-4 pt-2 pb-4 sm:justify-center sm:px-6">
              {images.map((image, i) => (
                <li key={image.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver foto ${i + 1}: ${image.caption ?? image.alt}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "relative block size-14 overflow-hidden rounded-md transition-opacity",
                      i === index ? "opacity-100 ring-2 ring-cream" : "opacity-50 hover:opacity-90",
                    )}
                  >
                    <Image src={image.src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
