import { DraftTag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import type { CustomerReview } from "@/types/content";
import { ReviewMore } from "./ReviewMore";
import { ReviewAvatar, Stars } from "./ReviewParts";

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden className={className}>
      <path
        d="M0 26V15.6C0 6.9 4.6 1.6 13.4 0l1.4 3.4C10.1 5 7.8 8 7.6 12h6.2v14zm19.2 0V15.6C19.2 6.9 23.8 1.6 32.6 0L34 3.4C29.3 5 27 8 26.8 12H33v14z"
        fill="currentColor"
      />
    </svg>
  );
}

type Variant = "featured" | "standard" | "compact";

export function ReviewCard({
  review,
  variant,
  tone = 0,
  tinted,
}: {
  review: CustomerReview;
  variant: Variant;
  tone?: number;
  tinted?: boolean;
}) {
  const featured = variant === "featured";
  const long = review.reviewText.length > (featured ? 240 : 150);
  const draft = review.status === "draft";

  return (
    <figure className="review-card flex flex-col">
      <div
        className={cn(
          "review-bubble relative rounded-[1.75rem] rounded-bl-md border",
          featured
            ? "border-white/10 bg-roast p-7 text-cream shadow-[0_40px_80px_-36px_rgb(14_11_9/0.6)] sm:p-9 lg:p-11"
            : tinted
              ? "border-caramel/20 bg-[#f4e8da] p-6 shadow-[0_24px_48px_-32px_rgb(36_24_16/0.45)]"
              : "border-line bg-paper p-6 shadow-[0_24px_48px_-32px_rgb(36_24_16/0.45)]",
          variant === "compact" && "p-5",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <QuoteMark className={featured ? "text-caramel-light" : "w-6 text-caramel"} />
          {draft ? (
            featured ? (
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs leading-none font-semibold text-caramel-light ring-1 ring-caramel-light/40 ring-inset">
                Exemplo
              </span>
            ) : (
              <DraftTag />
            )
          ) : null}
        </div>
        <blockquote
          className={cn(
            "mt-4",
            featured
              ? "font-display text-[1.75rem] leading-[1.15] text-white sm:text-[2.25rem] lg:text-[2.5rem]"
              : variant === "compact"
                ? "text-base leading-relaxed text-espresso"
                : "text-[1.0625rem] leading-relaxed text-espresso",
          )}
        >
          <p className={cn(long && (featured ? "line-clamp-6" : "line-clamp-5"))}>{review.reviewText}</p>
        </blockquote>
        {long ? (
          <ReviewMore review={review} tone={tone} className={featured ? "text-caramel-light" : "text-caramel-deep"} />
        ) : null}
      </div>
      <figcaption className="mt-4 flex items-center gap-3 pl-3">
        <ReviewAvatar review={review} size={featured ? 56 : 44} tone={tone} />
        <span className="min-w-0">
          <span className="block truncate font-semibold text-espresso">{review.customerName}</span>
          <span className="flex flex-wrap items-center gap-x-2 text-sm text-mocha">
            {review.rating ? <Stars rating={review.rating} className="text-caramel-deep" /> : null}
            {review.source ? (
              review.source.url ? (
                <a
                  href={review.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-espresso"
                >
                  via {review.source.label}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              ) : (
                <span>via {review.source.label}</span>
              )
            ) : null}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
