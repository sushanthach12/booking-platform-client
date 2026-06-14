"use client";

import { StarRating } from "@/components/dashboard/host/reviews/components/star-rating";
import type { IGuestReview } from "@/domain/interfaces";
import { format, parseISO } from "date-fns";

interface SubmittedReviewCardProps {
  review: IGuestReview;
  /** Name shown as the author of the host reply. */
  hostName?: string;
}

function safeDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return "";
  }
}

/**
 * Read-only view of the review a guest left for a stay, plus the host's reply
 * if one exists. Render in the booking detail view once a review is present.
 */
export function SubmittedReviewCard({
  review,
  hostName,
}: SubmittedReviewCardProps) {
  const submittedOn = safeDate(review.createdAt);

  return (
    <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StarRating rating={review.rating} />
        {submittedOn && (
          <span className="text-xs text-slate-400">Reviewed {submittedOn}</span>
        )}
      </div>

      {review.comment && (
        <p
          className="text-sm leading-relaxed text-slate-600"
          style={{ textWrap: "pretty" }}
        >
          {review.comment}
        </p>
      )}

      {review.response && (
        <div className="mt-1 rounded-lg border-l-2 border-blue-500 bg-slate-50 px-3.5 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {hostName ? `Response from ${hostName}` : "Host response"}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {review.response.text}
          </p>
          {review.response.respondedAt && (
            <p className="mt-1.5 text-[11px] text-slate-400">
              {safeDate(review.response.respondedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
