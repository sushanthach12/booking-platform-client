"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { IPayout, PayoutStatus } from "@/domain/interfaces";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CreditCard } from "lucide-react";

interface PayoutHistoryProps {
  payouts: IPayout[];
}

const STATUS_STYLES: Record<PayoutStatus, string> = {
  upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-indigo-200 bg-indigo-50 text-indigo-700",
  paid: "border-slate-200 bg-slate-100 text-slate-600",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  failed: "border-red-200 bg-red-50 text-red-600",
};

const STATUS_LABELS: Record<PayoutStatus, string> = {
  upcoming: "Upcoming",
  processing: "Processing",
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

function PayoutRow({ payout }: { payout: IPayout }) {
  const dateLabel = format(parseISO(payout.scheduledDate), "MMM d, yyyy");
  const bookingLabel =
    payout.bookingCount != null
      ? ` · ${payout.bookingCount} booking${payout.bookingCount === 1 ? "" : "s"}`
      : "";

  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <CreditCard className="size-4 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">
          {formatCurrency(payout.amount, payout.currency, 0)}
        </p>
        <p className="truncate text-xs text-slate-400">
          {dateLabel}
          {bookingLabel}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge
          variant="outline"
          className={cn("text-xs", STATUS_STYLES[payout.status])}
        >
          {STATUS_LABELS[payout.status]}
        </Badge>
        {payout.accountLast4 && (
          <span className="text-xs text-slate-400">
            Direct deposit •••• {payout.accountLast4}
          </span>
        )}
      </div>
    </div>
  );
}

/** Vertically scrollable list of past and upcoming payouts. */
export function PayoutHistory({ payouts }: PayoutHistoryProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border-slate-100 shadow-none">
      <CardContent className="flex min-h-0 flex-1 flex-col p-6">
        <h2 className="font-bold text-slate-900">Payout History</h2>

        {payouts.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            No payout history yet.
          </p>
        ) : (
          <div className="mt-2 flex-1 divide-y divide-slate-100 overflow-y-auto">
            {payouts.map((payout) => (
              <PayoutRow key={payout.id} payout={payout} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
