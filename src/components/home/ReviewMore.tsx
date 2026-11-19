"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { CustomerReview } from "@/types/content";
import { ReviewAvatar, Stars } from "./ReviewParts";

export function ReviewMore({ review, tone, className }: { review: CustomerReview; tone: number; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = `avaliacao-${review.id}`;

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className={cn(
          "mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold underline-offset-4 hover:underline",
          className,
        )}
      >
        Ler avaliação completa
        <span className="sr-only"> de {review.customerName}</span>
        <Icon name="arrowRight" size={16} />
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="modal review-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <ReviewAvatar review={review} size={52} tone={tone} />
              <div>
                <h2 id={titleId} className="font-sans text-lg font-semibold text-espresso">
                  {review.customerName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-2 text-sm text-mocha">
                  {review.rating ? <Stars rating={review.rating} className="text-caramel-deep" /> : null}
                  {review.source ? <span>via {review.source.label}</span> : null}
                  {review.status === "draft" ? <span>Avaliação de exemplo</span> : null}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-espresso hover:bg-cream"
              aria-label="Fechar avaliação"
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <blockquote className="mt-6 text-lg leading-relaxed whitespace-pre-line text-espresso">
            {review.reviewText}
          </blockquote>
        </div>
      </dialog>
    </>
  );
}
