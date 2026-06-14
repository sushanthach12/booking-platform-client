"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IPayoutAccount, IPayoutBalance } from "@/domain/interfaces";
import { formatCurrency } from "@/lib/utils/currency";
import { Loader2, Wallet } from "lucide-react";
import { useState } from "react";

interface PayableBalanceCardProps {
  balance: IPayoutBalance;
  accounts: IPayoutAccount[];
  requesting: boolean;
  onRequestPayout: () => void;
}

/**
 * The host's "money I can take out now" hero, with the primary Pay out action.
 * The action is gated on a verified account and the minimum payout threshold.
 */
export function PayableBalanceCard({
  balance,
  accounts,
  requesting,
  onRequestPayout,
}: PayableBalanceCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { payableNow, minPayoutThreshold, currency } = balance;

  const hasVerifiedAccount = accounts.some(
    (a) => a.beneficiaryStatus === "verified",
  );
  const belowThreshold = payableNow < minPayoutThreshold || payableNow <= 0;

  const disabledReason = !hasVerifiedAccount
    ? "Add a verified bank account first"
    : belowThreshold
      ? `Minimum ${formatCurrency(minPayoutThreshold, currency, 0)} to pay out`
      : null;
  const canPayout = !disabledReason && !requesting;

  const confirmPayout = () => {
    setConfirmOpen(false);
    onRequestPayout();
  };

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <Wallet className="size-4" /> Payable now
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
            {formatCurrency(payableNow, currency)}
          </p>
          {disabledReason && (
            <p className="mt-2 text-xs text-slate-400">{disabledReason}</p>
          )}
        </div>

        <Button
          size="lg"
          disabled={!canPayout}
          onClick={() => setConfirmOpen(true)}
          className="shrink-0"
        >
          {requesting && <Loader2 className="size-4 animate-spin" />}
          {requesting ? "Requesting…" : "Pay out"}
        </Button>
      </CardContent>

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-slate-900">
            Confirm payout
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            We&apos;ll send{" "}
            <span className="font-semibold text-slate-900">
              {formatCurrency(payableNow, currency)}
            </span>{" "}
            to your verified account. This can&apos;t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayout}>Confirm payout</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
