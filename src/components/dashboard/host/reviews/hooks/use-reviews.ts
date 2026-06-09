"use client";

import { getReviewUseCase } from "@/domain/di";
import type { IHostReview, IReviewSummary } from "@/domain/interfaces";
import { toastError } from "@/lib/utils/toast";
import { useCallback, useEffect, useMemo, useState } from "react";

type Breakdown = Record<1 | 2 | 3 | 4 | 5, number>;

/** Builds summary stats from a review list when the API doesn't supply them. */
function deriveSummary(reviews: IHostReview[]): IReviewSummary {
  const breakdown: Breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let ratingSum = 0;
  let responded = 0;

  for (const r of reviews) {
    const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (star >= 1 && star <= 5) breakdown[star] += 1;
    ratingSum += r.rating;
    if (r.response) responded += 1;
  }

  const total = reviews.length;
  return {
    averageRating: total ? ratingSum / total : 0,
    totalReviews: total,
    breakdown,
    respondedCount: responded,
    responseRate: total ? Math.round((responded / total) * 100) : 0,
  };
}

interface ReviewsState {
  reviews: IHostReview[];
  summary: IReviewSummary | null;
  loading: boolean;
}

/**
 * Loads host reviews and their aggregate summary. When the backend omits a
 * summary, it's derived client-side from the loaded reviews so the rating card
 * always reflects what's on screen. Also exposes {@link replyTo} for the inline
 * reply flow, applying the saved response optimistically on success.
 */
export function useReviews() {
  const [state, setState] = useState<ReviewsState>({
    reviews: [],
    summary: null,
    loading: true,
  });

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const useCase = getReviewUseCase();
      const [result, summary] = await Promise.all([
        useCase.getReviews({ page: 1, limit: 50 }),
        useCase.getSummary().catch(() => null),
      ]);
      if (signal?.cancelled) return;
      setState({
        reviews: result.items,
        summary,
        loading: false,
      });
    } catch (err) {
      if (signal?.cancelled) return;
      setState((prev) => ({ ...prev, loading: false }));
      toastError(err, "Failed to load reviews");
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const replyTo = useCallback(async (reviewId: string, text: string) => {
    const response = await getReviewUseCase().replyToReview(reviewId, text);
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) =>
        r.id === reviewId ? { ...r, response } : r,
      ),
    }));
    return response;
  }, []);

  // Prefer the server summary; fall back to a client-derived one.
  const summary = useMemo(
    () => state.summary ?? deriveSummary(state.reviews),
    [state.summary, state.reviews],
  );

  return {
    reviews: state.reviews,
    summary,
    loading: state.loading,
    reload: useCallback(() => load(), [load]),
    replyTo,
  };
}
