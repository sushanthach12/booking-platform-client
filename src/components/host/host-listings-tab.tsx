"use client";

import { Button } from "@/components/ui/button";
import type { HostListingSummary } from "@/domain/entities";
import { Building2, FileEdit } from "lucide-react";
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
  const drafts = listings.filter((l) => l.status === "draft");
  const active = listings.filter((l) => l.status !== "draft");

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
    <div className="space-y-8">
      {drafts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <FileEdit className="size-4 text-violet-500" />
            <h2 className="text-sm font-semibold text-slate-700">
              Drafts — incomplete listings
            </h2>
            <span className="ml-auto text-xs text-slate-400">
              {drafts.length} {drafts.length === 1 ? "draft" : "drafts"}
            </span>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 space-y-1">
            <p className="text-xs text-violet-700 font-medium">
              These listings are not visible to guests yet. Complete all steps
              to publish.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((listing) => (
              <HostPropertyCard
                key={listing.id}
                listing={listing}
                onViewBookings={onViewBookings}
              />
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-4">
          {drafts.length > 0 && (
            <div className="flex items-center gap-2 px-1">
              <Building2 className="size-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-700">
                Published listings
              </h2>
              <span className="ml-auto text-xs text-slate-400">
                {active.length} {active.length === 1 ? "listing" : "listings"}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((listing) => (
              <HostPropertyCard
                key={listing.id}
                listing={listing}
                onViewBookings={onViewBookings}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
