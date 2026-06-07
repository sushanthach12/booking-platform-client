"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { IReviewSummary } from "@/domain/interfaces";
import { Star } from "lucide-react";
import { StarRating } from "./star-rating";

interface RatingSummaryProps {
  summary: IReviewSummary;
}

const STARS = [5, 4, 3, 2, 1] as const;

/** Sticky left-column card: headline rating, star breakdown bars, response rate. */
export function RatingSummary({ summary }: RatingSummaryProps) {
  const { averageRating, totalReviews, breakdown, responseRate } = summary;

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none lg:sticky lg:top-8">
      <CardContent className="p-6">
        {/* Headline */}
        <div className="text-center">
          <p className="text-5xl font-bold tracking-tight text-slate-900">
            {averageRating > 0 ? averageRating.toFixed(2) : "—"}
          </p>
          <StarRating
            rating={averageRating}
            className="mt-2 justify-center"
            starClassName="size-4"
          />
          <p className="mt-2 text-sm text-slate-400">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </p>
        </div>

        {/* Star breakdown */}
        <div className="mt-6 space-y-2">
          {STARS.map((star) => {
            const count = breakdown[star] ?? 0;
            const pct = totalReviews ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="flex w-6 items-center gap-0.5 text-slate-500">
                  {star}
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-4 text-right text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Response rate */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Response rate</span>
            <span className="font-semibold text-slate-800">
              {responseRate}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${responseRate}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {summary.respondedCount} of {totalReviews} review
            {totalReviews === 1 ? "" : "s"} responded
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
