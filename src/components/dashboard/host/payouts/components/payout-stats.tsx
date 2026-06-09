"use client";

import { Card } from "@/components/ui/card";
import type { IPayoutSummary, IPayoutUpcoming } from "@/domain/interfaces";
import { formatCurrency } from "@/lib/utils/currency";
import { format, parseISO } from "date-fns";

interface PayoutStatsProps {
  summary: IPayoutSummary;
  upcoming: IPayoutUpcoming | null;
}

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  dotClassName: string;
}

function StatCard({ label, value, caption, dotClassName }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
        <span className={`size-1.5 rounded-full ${dotClassName}`} />
        {caption}
      </p>
    </Card>
  );
}

/** The three headline metrics: total paid out, next payout, and this month. */
export function PayoutStats({ summary, upcoming }: PayoutStatsProps) {
  const { currency } = summary;

  const sinceLabel = summary.paidOutSince
    ? `Since ${format(parseISO(summary.paidOutSince), "MMM yyyy")}`
    : "All time";

  const nextLabel = upcoming
    ? format(parseISO(upcoming.scheduledDate), "MMM d, yyyy")
    : "No payout scheduled";

  const thisMonthLabel = format(new Date(), "MMM yyyy");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Total paid out"
        value={formatCurrency(summary.totalPaidOut, currency, 0)}
        caption={sinceLabel}
        dotClassName="bg-emerald-500"
      />
      <StatCard
        label="Next payout"
        value={
          upcoming ? formatCurrency(upcoming.amount, upcoming.currency, 0) : "—"
        }
        caption={nextLabel}
        dotClassName="bg-blue-500"
      />
      <StatCard
        label="This month"
        value={formatCurrency(summary.thisMonth, currency, 0)}
        caption={thisMonthLabel}
        dotClassName="bg-amber-400"
      />
    </div>
  );
}
