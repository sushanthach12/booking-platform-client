"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    <div className="flex items-center gap-4 mb-8 -mx-12">
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full shrink-0 bg-gray-100 hover:bg-gray-200"
        asChild
      >
        <Link href={`/properties/${propertyId}`} aria-label="Back to property">
          <ArrowLeft className="size-6" />
        </Link>
      </Button>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground m-0">
        {title}
      </h1>
    </div>
  );
}
