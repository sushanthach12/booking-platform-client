"use client";

import { HostListingsTab } from "@/components/host/host-listings-tab";
import { useHostListings } from "@/domain/hooks/dashboard/use-host-listings";
import { useRouter } from "next/navigation";

const STATUS_TABS = [
  { label: "All", value: null },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Inactive", value: "inactive" },
] as const;

export function ListingsTemplate() {
  const { listings, allListings, loading, statusFilter, setStatusFilter } =
    useHostListings();
  const router = useRouter();

  const draftCount = allListings.filter((l) => l.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border border-slate-100"
              />
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
            <p className="text-sm text-slate-500 mt-1">
              Manage your properties
            </p>
          </div>
          <button
            onClick={() => router.push("/become-host?start=1")}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            + New listing
          </button>
        </div>

        {/* Status filter tabs */}
        {allListings.length > 0 && (
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {STATUS_TABS.map((tab) => {
              const isActive = statusFilter === tab.value;
              const isDraftTab = tab.value === "draft";
              return (
                <button
                  key={String(tab.value)}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {isDraftTab && draftCount > 0 && (
                    <span
                      className={`ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                        isActive
                          ? "bg-violet-100 text-violet-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {draftCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

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
