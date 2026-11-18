"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";

export function ProductGallery({ images, name }: { images: Photo[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-oat">
        <Image
          key={current.alt}
          src={current.src}
          alt={current.alt}
          fill
          placeholder="blur"
          loading="eager"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover motion-safe:animate-fade-in"
          style={current.position ? { objectPosition: current.position } : undefined}
        />
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-3">
          {images.map((image, i) => (
            <li key={image.alt}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1} de ${name}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block size-18 overflow-hidden rounded-lg border-2 transition-colors",
                  i === index ? "border-caramel-deep" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={image.src} alt="" fill sizes="72px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
