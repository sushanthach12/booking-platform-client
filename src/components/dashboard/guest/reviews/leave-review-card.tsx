"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { StarRatingInput } from "./star-rating-input";
import { useLeaveReview } from "./use-leave-review";

interface LeaveReviewCardProps {
  bookingId: string;
  propertyName: string;
  /** Called once the review is successfully submitted. */
  onReviewed?: () => void;
}

/**
 * Lets a guest rate and review a completed stay. Self-contained: owns its form
 * state and submission through {@link useLeaveReview}. Render only when the
 * booking is completed and not yet reviewed.
 */
export function LeaveReviewCard({
  bookingId,
  propertyName,
  onReviewed,
}: LeaveReviewCardProps) {
  const {
    rating,
    setRating,
    comment,
    setComment,
    submitting,
    canSubmit,
    submit,
  } = useLeaveReview({ bookingId, onReviewed });

  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-5">
      <p className="text-sm text-muted-foreground">
        How was your stay at {propertyName}?
      </p>
      <StarRatingInput
        value={rating}
        onChange={setRating}
        disabled={submitting}
      />
      <Textarea
        placeholder="Share your experience — what did you love? Any tips for future guests?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        disabled={submitting}
        className="resize-none rounded-xl text-sm"
      />
      <Button
        className="gap-2 rounded-xl"
        disabled={!canSubmit}
        onClick={submit}
      >
        <Send className="size-4" />
        {submitting ? "Submitting…" : "Submit Review"}
      </Button>
    </div>
  );
}
