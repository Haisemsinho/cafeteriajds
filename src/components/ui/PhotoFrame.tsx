import Image from "next/image";
import type { Photo } from "@/types/content";

type Props = {
  photo: Photo;
  sizes: string;
  ratio?: string;
  priority?: boolean;
  caption?: boolean | string;
  className?: string;
};

export function PhotoFrame({ photo, sizes, ratio = "4/3", priority, caption, className }: Props) {
  const text = typeof caption === "string" ? caption : caption ? photo.caption : undefined;
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-lg bg-cream" style={{ aspectRatio: ratio }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          placeholder="blur"
          className="object-cover"
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
      </div>
      {text ? <figcaption className="mt-2.5 text-sm text-mocha">{text}</figcaption> : null}
    </figure>
  );
}
