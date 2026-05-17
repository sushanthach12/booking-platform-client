"use client";

import { HostListingsTab } from "@/components/host/host-listings-tab";
import { useHostListings } from "@/domain/hooks/dashboard/use-host-listings";
import { useRouter } from "next/navigation";

export function ListingsTemplate() {
  const { listings, loading } = useHostListings();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Listings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your properties</p>
          </div>
          <button
            onClick={() => router.push("/become-host?start=1")}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            + New listing
          </button>
        </div>
        <HostListingsTab
          listings={listings}
          onViewBookings={(propertyId) =>
            router.push(`/dashboard/host/reservations?propertyId=${propertyId}`)
          }
        />
      </div>
    </div>
  );
}
