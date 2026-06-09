"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
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
  const { accounts, summary, upcoming, earnings, payouts, loading, reload } =
    usePayouts();
  const [addOpen, setAddOpen] = useState(false);

  if (loading) {
    return <PayoutsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb items={[{ label: "Payouts" }]} />

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
