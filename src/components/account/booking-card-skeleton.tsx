"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function BookingCardSkeleton() {
  return (
    <div className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="flex flex-col flex-1 p-3 gap-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-7 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
