"use client";

import { useState } from "react";
import { usePayouts } from "./hooks/use-payouts";
import { AddPayoutMethodModal } from "./components/add-payout-method-modal";
import { EarningsChart } from "./components/earnings-chart";
import { PayoutAccountsCard } from "./components/payout-accounts-card";
import { PayoutHistory } from "./components/payout-history";
import { PayoutStats } from "./components/payout-stats";
import { PayoutsSkeleton } from "./components/payouts-skeleton";

/**
 * Host payouts dashboard — linked accounts, headline metrics, an earnings
 * overview chart, and payout history. Data is loaded via {@link usePayouts}.
 */
export function PayoutsView() {
  const {
    accounts,
    summary,
    upcoming,
    earnings,
    payouts,
    loading,
    error,
    reload,
  } = usePayouts();
  const [addOpen, setAddOpen] = useState(false);

  if (loading) {
    return <PayoutsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payouts</h1>
          <p className="mt-1 text-sm text-slate-500">
            All earnings paid to your bank account
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

        <PayoutAccountsCard
          accounts={accounts}
          onAddAccount={() => setAddOpen(true)}
        />

        <PayoutStats summary={summary} upcoming={upcoming} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <EarningsChart earnings={earnings} />
          <PayoutHistory payouts={payouts} />
        </div>
      </div>

      <AddPayoutMethodModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={reload}
      />
    </div>
  );
}
