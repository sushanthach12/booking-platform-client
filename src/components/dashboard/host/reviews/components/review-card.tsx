"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { IHostReview } from "@/domain/interfaces";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { StarRating } from "./star-rating";

interface ReviewCardProps {
  review: IHostReview;
  onReply: (reviewId: string, text: string) => Promise<unknown>;
}

const AVATAR_TINTS = [
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-violet-100 text-violet-600",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "G";
}

function tintFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return AVATAR_TINTS[Math.abs(hash) % AVATAR_TINTS.length];
}

/** A single review with star rating, body, and an inline host-reply flow. */
export function ReviewCard({ review, onReply }: ReviewCardProps) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onReply(review.id, text);
      toast.success("Reply posted");
      setReplying(false);
      setText("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-9">
            <AvatarImage src={review.guestAvatar ?? undefined} />
            <AvatarFallback
              className={cn("text-xs", tintFor(review.guestName))}
            >
              {initials(review.guestName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-slate-900">
                {review.guestName}
              </span>
              <StarRating rating={review.rating} />
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {review.propertyName} ·{" "}
              {format(parseISO(review.createdAt), "MMM d, yyyy")}
            </p>

            {review.comment && (
              <p
                className="mt-2 text-sm leading-relaxed text-slate-600"
                style={{ textWrap: "pretty" }}
              >
                {review.comment}
              </p>
            )}

            {/* Existing host response */}
            {review.response ? (
              <div className="mt-3 rounded-lg border-l-2 border-blue-500 bg-slate-50 px-3.5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Your response
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {review.response.text}
                </p>
              </div>
            ) : replying ? (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a public reply…"
                  autoFocus
                  className="min-h-20 resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!text.trim() || submitting}
                  >
                    {submitting ? "Posting…" : "Submit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplying(false);
                      setText("");
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Reply trigger — only when not yet responded */}
          {!review.response && !replying && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 text-blue-600"
              onClick={() => setReplying(true)}
            >
              Reply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
