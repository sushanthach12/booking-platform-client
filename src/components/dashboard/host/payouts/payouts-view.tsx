"use client";

import { PathBreadcrumb } from "@/components/shared/path-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AddPayoutMethodModal } from "./components/add-payout-method-modal";
import { EarningsChart } from "./components/earnings-chart";
import { OnHoldCard } from "./components/on-hold-card";
import { PayableBalanceCard } from "./components/payable-balance-card";
import { PayoutAccountEmpty } from "./components/payout-account-empty";
import { PayoutAccountsManager } from "./components/payout-accounts-manager";
import { PayoutHistory } from "./components/payout-history";
import { PayoutStats } from "./components/payout-stats";
import { PayoutsSkeleton } from "./components/payouts-skeleton";
import { usePayouts } from "./hooks/use-payouts";

/**
 * Host payouts dashboard, split into two tabs:
 * - **Overview** — payable balance + Pay out action, on-hold earnings, headline
 *   metrics, earnings chart, and payout history. When no account is linked yet,
 *   an onboarding CTA leads the host into the add-account flow.
 * - **Accounts** — manage linked payout accounts (switch primary / remove / add).
 *
 * Data and account mutations are owned by {@link usePayouts}.
 */
export function PayoutsView() {
  const {
    accounts,
    summary,
    upcoming,
    earnings,
    balance,
    payouts,
    loading,
    requesting,
    mutatingAccountId,
    reload,
    requestPayout,
    setPrimaryAccount,
    removeAccount,
  } = usePayouts();
  const [addOpen, setAddOpen] = useState(false);

  if (loading) {
    return <PayoutsSkeleton />;
  }

  const hasAccounts = accounts.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="w-full space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <PathBreadcrumb items={[{ label: "Payouts" }]} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-auto w-fit gap-1 rounded-xl bg-slate-100 p-1">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-3.5 py-1.5 text-slate-500 hover:text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="rounded-lg px-3.5 py-1.5 text-slate-500 hover:text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Accounts{hasAccounts ? ` (${accounts.length})` : ""}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {!hasAccounts && (
              <PayoutAccountEmpty onAddAccount={() => setAddOpen(true)} />
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PayableBalanceCard
                balance={balance}
                accounts={accounts}
                requesting={requesting}
                onRequestPayout={requestPayout}
              />
              <OnHoldCard balance={balance} />
            </div>

            <PayoutStats summary={summary} upcoming={upcoming} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
              <EarningsChart earnings={earnings} />
              <PayoutHistory payouts={payouts} />
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            {hasAccounts ? (
              <PayoutAccountsManager
                accounts={accounts}
                mutatingAccountId={mutatingAccountId}
                onAddAccount={() => setAddOpen(true)}
                onSetPrimary={setPrimaryAccount}
                onRemove={removeAccount}
              />
            ) : (
              <PayoutAccountEmpty onAddAccount={() => setAddOpen(true)} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddPayoutMethodModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={reload}
      />
    </div>
  );
}
