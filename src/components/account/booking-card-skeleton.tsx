"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
  return (
    <div className="flex flex-row bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="w-32 sm:w-40 shrink-0 h-full min-h-30" />
      <div className="flex flex-col flex-1 px-4 py-3 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-5 w-20 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />
        <div className="mt-auto pt-1.5 border-t border-border/50">
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
