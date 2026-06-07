"use client";

import { RatingSummary } from "@/components/dashboard/host/reviews/components/rating-summary";
import { ReviewCard } from "@/components/dashboard/host/reviews/components/review-card";
import { getReviewUseCase } from "@/domain/di";
import type { IHostReview, IReviewSummary } from "@/domain/interfaces";
import { useCallback, useState } from "react";

interface ReviewsTabProps {
  reviews: IHostReview[];
}

function deriveSummary(reviews: IHostReview[]): IReviewSummary {
  const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  let responded = 0;
  for (const r of reviews) {
    const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (star >= 1 && star <= 5) breakdown[star] += 1;
    sum += r.rating;
    if (r.response) responded += 1;
  }
  const total = reviews.length;
  return {
    averageRating: total ? sum / total : 0,
    totalReviews: total,
    breakdown,
    respondedCount: responded,
    responseRate: total ? Math.round((responded / total) * 100) : 0,
  };
}

export function ReviewsTab({ reviews: initial }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<IHostReview[]>(initial);

  const replyTo = useCallback(async (reviewId: string, text: string) => {
    const response = await getReviewUseCase().replyToReview(reviewId, text);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, response } : r)),
    );
    return response;
  }, []);

  if (reviews.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="mb-2 text-3xl" aria-hidden>
          ⭐
        </p>
        <p className="font-semibold text-slate-600">No reviews yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Once guests start staying, their reviews will appear here.
        </p>
      </div>
    );
  }

  const summary = deriveSummary(reviews);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
      <RatingSummary summary={summary} />
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} onReply={replyTo} />
        ))}
      </div>
    </div>
  );
}
