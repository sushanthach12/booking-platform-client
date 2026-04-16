"use client";

import { HostOverviewTab } from "@/components/host/host-overview-tab";
import { useHostOverview } from "@/domain/hooks/dashboard/use-host-overview";
import { useRouter } from "next/navigation";

export function OverviewTemplate() {
  const { stats, recentBookings, draftListings, loading } = useHostOverview();
  const router = useRouter();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-100 rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Overview</h1>
      <HostOverviewTab
        stats={stats}
        draftListings={draftListings}
        recentBookings={recentBookings}
        onViewBookings={() => router.push("/dashboard/host/reservations")}
      />
    </div>
  );
}
