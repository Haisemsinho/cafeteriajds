import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Photo } from "@/types/content";
import { PhotoBadge } from "./PhotoCredit";

type Props = {
  photo: Photo;
  sizes: string;
  ratio?: string;
  priority?: boolean;
  caption?: boolean | string;
  reveal?: boolean;
  rounded?: string;
  badge?: string;
  className?: string;
};

export function PhotoFrame({
  photo,
  sizes,
  ratio = "4/3",
  priority,
  caption,
  reveal = true,
  rounded = "rounded-2xl",
  badge = "bottom-3 left-3",
  className,
}: Props) {
  const text = typeof caption === "string" ? caption : caption ? photo.caption : undefined;
  const focus = {
    aspectRatio: ratio,
    "--focus": photo.positionMobile ?? photo.position ?? "50% 50%",
    "--focus-md": photo.position ?? "50% 50%",
  } as CSSProperties;

  return (
    <figure className={className}>
      <div
        className={cn("relative overflow-hidden bg-cream", rounded)}
        style={focus}
        data-reveal={reveal && !priority ? "image" : undefined}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          placeholder="blur"
          className="object-cover object-(--focus) md:object-(--focus-md)"
        />
        <PhotoBadge photo={photo} className={badge} />
      </div>
      {text ? <figcaption className="mt-3 text-sm text-mocha">{text}</figcaption> : null}
    </figure>
  );
}
