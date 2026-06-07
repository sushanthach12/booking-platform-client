"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { HostQuickStats } from "@/domain/entities";

interface QuickStatsCardProps {
  stats: HostQuickStats;
}

interface StatBarProps {
  label: string;
  /** Right-aligned display value, e.g. "5 / 6" or "98%". */
  display: string;
  /** Fill ratio 0–100. */
  percent: number;
  barClassName: string;
}

function StatBar({ label, display, percent, barClassName }: StatBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-800">{display}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={barClassName}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}

/** Operational stats (active listings, response & acceptance rate) as bars. */
export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  const listingPct = stats.totalListings
    ? (stats.activeListings / stats.totalListings) * 100
    : 0;

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="space-y-4 p-6">
        <h2 className="font-bold text-slate-900">Quick Stats</h2>
        <StatBar
          label="Active listings"
          display={`${stats.activeListings} / ${stats.totalListings}`}
          percent={listingPct}
          barClassName="h-full rounded-full bg-blue-500"
        />
        <StatBar
          label="Response rate"
          display={`${stats.responseRate}%`}
          percent={stats.responseRate}
          barClassName="h-full rounded-full bg-emerald-500"
        />
        <StatBar
          label="Acceptance rate"
          display={`${stats.acceptanceRate}%`}
          percent={stats.acceptanceRate}
          barClassName="h-full rounded-full bg-amber-400"
        />
      </CardContent>
    </Card>
  );
}
