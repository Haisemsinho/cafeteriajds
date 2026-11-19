import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { getHomeReviews } from "@/lib/content";
import { cn } from "@/lib/cn";
import { ReviewCard } from "./ReviewCard";
import { ReviewRailDots } from "./ReviewRailDots";

const slots = [
  {
    className: "lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:mt-14",
    float: "7.4s",
    delay: "-1.2s",
    order: 1,
    tinted: false,
  },
  {
    className: "md:mt-10 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:mt-0",
    float: "8.6s",
    delay: "-3.4s",
    order: 2,
    tinted: true,
  },
  {
    className: "lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:mt-8",
    float: "9.2s",
    delay: "-5.1s",
    order: 4,
    tinted: true,
  },
  {
    className: "md:mt-10 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:mt-16",
    float: "7.9s",
    delay: "-2.3s",
    order: 3,
    tinted: false,
  },
  {
    className: "lg:col-span-4 lg:col-start-5 lg:row-start-3 lg:mt-10",
    float: "8.2s",
    delay: "-4.4s",
    order: 5,
    tinted: false,
  },
];

const motion = (float: string, delay: string, order: number) =>
  ({ "--float-d": float, "--float-delay": delay, "--i": order }) as CSSProperties;

export function Reviews() {
  const reviews = getHomeReviews(6);
  const [featured, ...others] = reviews;
  if (!featured) return null;
  const draft = reviews.some((r) => r.status === "draft");

  return (
    <section
      aria-labelledby="avaliacoes-title"
      className="reviews relative isolate overflow-hidden bg-cream-soft py-24 lg:py-32"
    >
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 hidden w-[44rem] -translate-x-1/2 -translate-y-[38%] text-caramel/15 lg:block"
      >
        <circle cx="200" cy="200" r="168" fill="none" stroke="currentColor" strokeWidth="10" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 9" />
        <path d="M352 132c18 36 20 78 6 116" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      </svg>

      <div className="page-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="avaliacoes-title" className="text-h2 text-espresso">
            {home.reviews.title}
          </h2>
          <p className="mt-5 text-lede text-mocha">{home.reviews.intro}</p>
        </div>

        <div className="mt-14 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
          <div
            className="review-slot md:col-span-2 lg:col-span-6 lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:self-center"
            style={motion("9.8s", "-0.6s", 0)}
          >
            <div className="review-float">
              <ReviewCard review={featured} variant="featured" tone={0} />
            </div>
          </div>

          {others.length ? (
            <div className="mt-10 md:contents">
              <ul
                id="avaliacoes-lista"
                role="list"
                aria-label="Mais avaliações"
                tabIndex={0}
                className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-px-5 items-start gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:contents"
              >
                {others.map((review, i) => {
                  const slot = slots[i] ?? slots[slots.length - 1]!;
                  const compact = review.reviewText.length < 90;
                  return (
                    <li
                      key={review.id}
                      data-review-item
                      className={cn(
                        "review-slot w-[84%] shrink-0 snap-start xs:w-[70%] sm:w-[55%] md:w-auto lg:self-start",
                        slot.className,
                      )}
                      style={motion(slot.float, slot.delay, slot.order)}
                    >
                      <div className="review-float">
                        <ReviewCard
                          review={review}
                          variant={compact ? "compact" : "standard"}
                          tone={i + 1}
                          tinted={slot.tinted}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              {others.length > 1 ? <ReviewRailDots count={others.length} listId="avaliacoes-lista" /> : null}
            </div>
          ) : null}
        </div>

        {draft ? (
          <p className="mx-auto mt-14 max-w-xl text-center text-sm text-mocha lg:mt-20">{home.reviews.demoNotice}</p>
        ) : null}
      </div>
    </section>
  );
}
