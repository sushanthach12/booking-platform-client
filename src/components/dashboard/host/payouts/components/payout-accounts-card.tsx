"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IPayoutAccount } from "@/domain/interfaces";
import { format, parseISO } from "date-fns";
import { Building2, Plus } from "lucide-react";

interface PayoutAccountsCardProps {
  accounts: IPayoutAccount[];
  onAddAccount: () => void;
}

/** Verification badge styling/label per Cashfree beneficiary status. */
const BENEFICIARY_BADGE: Record<string, { label: string; className: string }> =
  {
    verified: {
      label: "Verified",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    initiated: {
      label: "Pending",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    invalid: {
      label: "Invalid",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    failed: {
      label: "Failed",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };

function AccountRow({ account }: { account: IPayoutAccount }) {
  const badge = account.beneficiaryStatus
    ? BENEFICIARY_BADGE[account.beneficiaryStatus]
    : undefined;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3.5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-200/70">
        <Building2 className="size-5 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900">
          {account.bankName}
        </p>
        <p className="truncate text-sm text-slate-500">
          {account.accountType} •••• {account.last4}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          {badge && (
            <Badge variant="outline" className={`text-xs ${badge.className}`}>
              {badge.label}
            </Badge>
          )}
          {account.isPrimary && (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
            >
              Primary
            </Badge>
          )}
        </div>
        <span className="text-xs text-slate-400">
          Added {format(parseISO(account.addedAt), "MMM d, yyyy")}
        </span>
      </div>
    </div>
  );
}

/**
 * Lists the host's linked bank accounts and surfaces the entry point for the
 * "Add payout method" wizard.
 */
export function PayoutAccountsCard({
  accounts,
  onAddAccount,
}: PayoutAccountsCardProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Payout accounts</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Where your earnings are deposited
            </p>
          </div>
          <Button onClick={onAddAccount} className="gap-1.5">
            <Plus className="size-4" />
            Add account
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {accounts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
              <Building2 className="mx-auto mb-2 size-7 text-slate-300" />
              <p className="text-sm text-slate-500">
                No payout accounts yet. Add one to start receiving earnings.
              </p>
            </div>
          ) : (
            accounts.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
