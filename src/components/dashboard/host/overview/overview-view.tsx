"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { KpiCards } from "./components/kpi-cards";
import { OverviewSkeleton } from "./components/overview-skeleton";
import { QuickStatsCard } from "./components/quick-stats-card";
import { RecentBookings } from "./components/recent-bookings";
import { UpcomingCard } from "./components/upcoming-card";
import { useOverview } from "./hooks/use-overview";

/**
 * Host dashboard overview — personalized greeting, four headline KPI cards, a
 * recent-bookings table, and a right column with upcoming check-ins/outs and
 * operational quick stats. Data is loaded via {@link useOverview}.
 */
export function OverviewView() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    greeting,
    kpis,
    recentBookings,
    upcoming,
    quickStats,
    loading,
    error,
    reload,
  } = useOverview();

  if (loading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb items={[{ label: "Dashboard" }]} />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}
            {user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — Here&apos;s what&apos;s
            happening with your properties.
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button
              type="button"
              onClick={reload}
              className="font-semibold underline-offset-2 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <KpiCards kpis={kpis} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <RecentBookings
            bookings={recentBookings}
            onViewAll={() => router.push("/dashboard/host/reservations")}
          />
          <div className="space-y-6">
            <UpcomingCard events={upcoming} />
            <QuickStatsCard stats={quickStats} />
          </div>
        </div>
      </div>
    </div>
  );
}
