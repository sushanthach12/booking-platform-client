"use client";

import { getReviewUseCase } from "@/domain/di";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseLeaveReviewOptions {
  bookingId: string;
  /** Called after the review is successfully submitted. */
  onReviewed?: () => void;
}

/**
 * Owns the "leave a review" form state (rating + comment) and the submit
 * lifecycle for a single completed booking. Delegates the API call to the
 * review use case and surfaces success/failure via sonner toasts. Keeping the
 * fetch out of the component keeps the card purely presentational.
 */
export function useLeaveReview({
  bookingId,
  onReviewed,
}: UseLeaveReviewOptions) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && comment.trim().length > 0 && !submitting;

  const submit = useCallback(async () => {
    if (rating === 0 || comment.trim().length === 0 || submitting) return;
    setSubmitting(true);
    try {
      await getReviewUseCase().createReview({
        bookingId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted — thanks for sharing!");
      onReviewed?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  }, [bookingId, rating, comment, submitting, onReviewed]);

  return { rating, setRating, comment, setComment, submitting, canSubmit, submit };
}
