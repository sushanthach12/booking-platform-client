"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { IPayoutBalance } from "@/domain/interfaces";
import { formatCurrency } from "@/lib/utils/currency";
import { Clock, TrendingUp } from "lucide-react";

interface OnHoldCardProps {
  balance: IPayoutBalance;
}

interface OnHoldRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  amount: string;
}

function OnHoldRow({ icon, label, description, amount }: OnHoldRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-slate-900">{label}</p>
          <p className="font-semibold text-slate-900">{amount}</p>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}

/**
 * The host's "money coming in" view: incoming earnings that aren't payable yet,
 * split into upcoming (stay not finished) and clearing (completed, in the grace
 * window). Intentionally not a "wallet" — just earnings moving through states.
 */
export function OnHoldCard({ balance }: OnHoldCardProps) {
  const { onHold, currency } = balance;
  const total = onHold.upcoming + onHold.clearing;

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-bold text-slate-900">On hold</h2>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(total, currency)}
          </p>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">
          Earnings on their way to payable.
        </p>

        <div className="mt-5 space-y-4">
          <OnHoldRow
            icon={<TrendingUp className="size-4" />}
            label="Upcoming"
            description="From confirmed bookings, stay not finished yet."
            amount={formatCurrency(onHold.upcoming, currency)}
          />
          <OnHoldRow
            icon={<Clock className="size-4" />}
            label="Clearing"
            description="Stay completed — releasing after the grace window."
            amount={formatCurrency(onHold.clearing, currency)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
