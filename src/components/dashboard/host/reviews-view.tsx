"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useHostReviews } from "@/domain/hooks/dashboard/use-host-reviews";
import { Star } from "lucide-react";
import { format, parseISO } from "date-fns";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsView() {
  const { reviews, loading } = useHostReviews();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
            <div className="h-4 w-56 bg-slate-100 rounded" />
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">What guests are saying about your properties</p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <Star className="size-10 mx-auto mb-3 text-slate-200" />
          <p className="font-semibold text-slate-600">No reviews yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Reviews from guests will appear here after completed stays.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="rounded-2xl border-slate-100 shadow-none"
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {review.guestName}
                      </p>
                      <span className="text-slate-300">·</span>
                      <p className="text-xs text-slate-400">
                        {review.propertyName}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.comment && (
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {format(parseISO(review.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
