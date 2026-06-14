"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Plus, ShieldCheck } from "lucide-react";

interface PayoutAccountEmptyProps {
  onAddAccount: () => void;
}

/**
 * First-run onboarding shown on the Overview tab when the host has no linked
 * payout accounts. Surfaces a single, prominent "Add your first account" call
 * to action — once an account exists, account management moves to the dedicated
 * Accounts tab.
 */
export function PayoutAccountEmpty({ onAddAccount }: PayoutAccountEmptyProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50">
          <Banknote className="size-7 text-emerald-600" />
        </div>
        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Add a payout account to get paid
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">
          Securely connect the Indian bank account or UPI you want your earnings
          deposited into. You can add more and switch your primary account any
          time.
        </p>
        <Button onClick={onAddAccount} className="mt-6 gap-1.5">
          <Plus className="size-4" />
          Add your first account
        </Button>
        <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="size-3.5" />
          Bank details are encrypted and never shown in full.
        </p>
      </CardContent>
    </Card>
  );
}
