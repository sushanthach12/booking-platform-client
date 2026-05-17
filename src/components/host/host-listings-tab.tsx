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

export function HostListingsTab({
  listings,
  onViewBookings,
}: HostListingsTabProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 className="size-8 text-slate-300" />
        </div>
        <p className="font-semibold text-slate-700 text-lg">No listings yet</p>
        <p className="text-sm mt-2 text-slate-400 max-w-xs mx-auto">
          Create your first property listing and start earning from your space.
        </p>
        <Button
          asChild
          className="mt-6 rounded-xl bg-slate-900 hover:bg-slate-700 text-white px-6"
        >
          <Link href="/become-host">Create your first listing</Link>
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
