"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ListingCard } from "./components/listing-card";
import { ListingsSkeleton } from "./components/listings-skeleton";
import type { ListingFilter } from "./hooks/use-listings";
import { useListings } from "./hooks/use-listings";

const TABS: { value: ListingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
];

export function ListingsGridView() {
  const router = useRouter();
  const { listings, counts, loading, error, filter, setFilter } = useListings();

  if (loading) return <ListingsSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb
          items={[{ label: "Listings" }]}
          actions={
            <button
              type="button"
              onClick={() => router.push("/become-host?start=1")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              + Add listing
            </button>
          }
        />

        <p className="-mt-2 text-sm text-slate-500">
          {counts.active} active · {counts.paused} paused
        </p>

        {/* Filter tabs */}
        <div className="flex w-fit items-center gap-1 rounded-xl bg-slate-100 p-1">
          {TABS.map((tab) => {
            const isActive = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {tab.label} ({counts[tab.value]})
              </button>
            );
          })}
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100">
              <Building2 className="size-8 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-700">
              No listings here
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">
              {filter === "all"
                ? "Create your first property listing and start earning."
                : `You have no ${filter} listings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} tintIndex={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
