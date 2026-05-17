"use client";

import { HostOverviewTab } from "@/components/host/host-overview-tab";
import { useHostOverview } from "@/domain/hooks/dashboard/use-host-overview";
import { useRouter } from "next/navigation";

export function OverviewTemplate() {
  const { stats, recentBookings, draftListings, loading } = useHostOverview();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-100 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <HostOverviewTab
          stats={stats}
          draftListings={draftListings}
          recentBookings={recentBookings}
          onViewBookings={() => router.push("/dashboard/host/reservations")}
        />
      </div>
    </div>
  );
}
