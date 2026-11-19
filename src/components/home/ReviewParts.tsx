import Image from "next/image";
import { cn } from "@/lib/cn";
import type { CustomerReview } from "@/types/content";

const avatarTones = ["bg-caramel-deep", "bg-walnut", "bg-wine", "bg-espresso"];

function initials(name: string) {
  const parts = name
    .replace(/[^\p{L}\s]/gu, "")
    .trim()
    .split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function ReviewAvatar({
  review,
  size = 48,
  tone = 0,
}: {
  review: CustomerReview;
  size?: number;
  tone?: number;
}) {
  if (review.customerPhoto) {
    return (
      <Image
        src={review.customerPhoto.src}
        alt=""
        width={size}
        height={size}
        sizes={`${size * 2}px`}
        className="shrink-0 rounded-full object-cover ring-2 ring-paper"
        style={{ width: size, height: size, objectPosition: review.customerPhoto.position }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold text-white ring-2 ring-paper",
        avatarTones[tone % avatarTones.length],
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(review.customerName)}
    </span>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Nota ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="15" height="15" viewBox="0 0 20 20" aria-hidden className={n <= rating ? "" : "opacity-25"}>
          <path d="M10 1.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6L10 14.5l-5 2.7 1-5.6-4.1-3.9 5.6-.7z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
