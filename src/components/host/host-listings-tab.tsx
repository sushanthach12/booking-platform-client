"use client";

import { Button } from "@/components/ui/button";
import type { HostListingSummary } from "@/domain/entities";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { HostPropertyCard } from "./host-property-card";

interface HostListingsTabProps {
  listings: HostListingSummary[];
  onViewBookings: (propertyId: string) => void;
}

export function HostListingsTab({ listings, onViewBookings }: HostListingsTabProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Building2 className="size-10 mx-auto mb-3 opacity-30" />
        <p className="font-semibold text-slate-600">No active listings yet</p>
        <p className="text-sm mt-1">Start hosting by creating your first property.</p>
        <Button asChild className="mt-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
          <Link href="/become-host">List a property</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <HostPropertyCard
          key={listing.id}
          listing={listing}
          onViewBookings={onViewBookings}
        />
      ))}
    </div>
  );
}
