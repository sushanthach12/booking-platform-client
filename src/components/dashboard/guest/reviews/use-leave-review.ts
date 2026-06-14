"use client";

import { getReviewUseCase } from "@/domain/di";
import type { IGuestReview } from "@/domain/interfaces";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseLeaveReviewOptions {
  bookingId: string;
  /** Called with the created review after successful submission. */
  onReviewed?: (review: IGuestReview) => void;
}

export function useLeaveReview({
  bookingId,
  onReviewed,
}: UseLeaveReviewOptions) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] =
    useState<IGuestReview | null>(null);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;

  const submit = useCallback(async () => {
    if (rating === 0 || comment.trim().length === 0 || submitting) return;
    setSubmitting(true);
    try {
      const created = await getReviewUseCase().createReview({
        bookingId,
        rating,
        comment: comment.trim(),
      });
      const review: IGuestReview = {
        id: created.id,
        rating: created.rating,
        comment: created.comment,
        createdAt: created.createdAt,
        response: created.response ?? null,
      };
      setSubmittedReview(review);
      toast.success("Review submitted — thanks for sharing!");
      onReviewed?.(review);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  }, [bookingId, rating, comment, submitting, onReviewed]);

  return {
    rating,
    setRating,
    comment,
    setComment,
    submitting,
    canSubmit,
    submit,
    submittedReview,
  };
}
