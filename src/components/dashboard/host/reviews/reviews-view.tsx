"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { Star } from "lucide-react";
import { RatingSummary } from "./components/rating-summary";
import { ReviewCard } from "./components/review-card";
import { ReviewsSkeleton } from "./components/reviews-skeleton";
import { useReviews } from "./hooks/use-reviews";

/**
 * Host reviews dashboard — a sticky rating-summary card alongside a feed of
 * review cards with an inline host-reply flow. Data is loaded via
 * {@link useReviews}; aggregates fall back to client-side computation.
 */
export function ReviewsView() {
  const { reviews, summary, loading, replyTo } = useReviews();

  if (loading) {
    return <ReviewsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb
          items={[{ label: "Reviews" }]}
          actions={
            summary.totalReviews > 0 ? (
              <span className="text-sm text-slate-400">
                {summary.totalReviews} review
                {summary.totalReviews === 1 ? "" : "s"} across all listings
              </span>
            ) : undefined
          }
        />

        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <Star className="mx-auto mb-3 size-10 text-slate-200" />
            <p className="font-semibold text-slate-600">No reviews yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Reviews from guests will appear here after completed stays.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
            <RatingSummary summary={summary} />
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} onReply={replyTo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
