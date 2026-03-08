"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BookingHeaderProps {
  /** Property id for back link (e.g. to /properties/[id]) */
  propertyId: string;
  title?: string;
}

export function BookingHeader({
  propertyId,
  title = "Confirm and pay",
}: BookingHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="outline" size="icon" className="rounded-full shrink-0" asChild>
        <Link href={`/properties/${propertyId}`} aria-label="Back to property">
          <ChevronLeft className="size-5" />
        </Link>
      </Button>
      <h1 className="text-2xl font-bold text-foreground m-0">{title}</h1>
    </div>
  );
}
