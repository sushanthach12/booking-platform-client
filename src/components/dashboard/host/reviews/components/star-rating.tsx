import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
  starClassName?: string;
}

/** Five-star row; fills stars up to the rounded `rating`. */
export function StarRating({
  rating,
  className,
  starClassName,
}: StarRatingProps) {
  const filled = Math.round(rating);
  return (
    <div className={cn("flex gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-3.5",
            star <= filled ? "fill-amber-400 text-amber-400" : "text-slate-200",
            starClassName,
          )}
        />
      ))}
    </div>
  );
}
