"use client";

import { HostListingsTab } from "@/components/host/host-listings-tab";
import { useHostListings } from "@/domain/hooks/dashboard/use-host-listings";
import { useRouter } from "next/navigation";

export function ListingsTemplate() {
  const { listings, loading } = useHostListings();
  const router = useRouter();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-slate-100 rounded-lg" />
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Listings</h1>
      <HostListingsTab
        listings={listings}
        onViewBookings={(propertyId) =>
          router.push(`/dashboard/host/reservations?propertyId=${propertyId}`)
        }
      />
    </div>
  );
}
