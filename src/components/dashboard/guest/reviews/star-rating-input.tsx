"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

const DEFAULT_LABELS = [
  "",
  "Poor",
  "Fair",
  "Good",
  "Great",
  "Excellent",
] as const;

interface StarRatingInputProps {
  /** Selected rating, 1–5 (0 = none selected yet). */
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  className?: string;
  /** Word labels keyed by rating (index 1–5); pass `null` to hide. */
  labels?: readonly string[] | null;
}

/**
 * Interactive five-star rating picker with hover preview. Controlled via
 * `value`/`onChange` so it composes with any form state or hook. Reusable
 * wherever a user selects a whole-star rating.
 */
export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  className,
  labels = DEFAULT_LABELS,
}: StarRatingInputProps) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Star
            className={cn(
              "size-7 transition-colors",
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200",
            )}
          />
        </button>
      ))}
      {labels && value > 0 && labels[value] && (
        <span className="ml-2 text-sm text-muted-foreground">
          {labels[value]}
        </span>
      )}
    </div>
  );
}
