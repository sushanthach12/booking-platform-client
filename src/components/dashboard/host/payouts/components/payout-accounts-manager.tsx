"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IPayoutAccount } from "@/domain/interfaces";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  type LucideIcon,
  MoreVertical,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { RemoveAccountDialog } from "./remove-account-dialog";

interface PayoutAccountsManagerProps {
  accounts: IPayoutAccount[];
  /** Id of the account currently being mutated; disables its row controls. */
  mutatingAccountId: string | null;
  onAddAccount: () => void;
  onSetPrimary: (accountId: string) => void;
  onRemove: (accountId: string) => void;
}

/**
 * Host-facing wording for each Cashfree beneficiary status. The raw API states
 * ("initiated"/"invalid") are jargon, so we surface plain language plus a short
 * caption explaining what the host should expect or do.
 */
const STATUS_CONFIG: Record<
  string,
  { label: string; helper?: string; className: string; Icon: LucideIcon }
> = {
  verified: {
    label: "Verified",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  initiated: {
    label: "Verifying",
    helper:
      "We're confirming this account with your bank. Payouts unlock once it's verified — this usually takes a few minutes.",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    Icon: Clock,
  },
  invalid: {
    label: "Couldn't verify",
    helper:
      "These details didn't match your bank's records. Remove this account and add it again.",
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: AlertCircle,
  },
  failed: {
    label: "Verification failed",
    helper:
      "Something went wrong while verifying this account. Remove it and try adding it again.",
    className: "border-red-200 bg-red-50 text-red-700",
    Icon: AlertCircle,
  },
};

function AccountRow({
  account,
  busy,
  onSetPrimary,
  onRemove,
}: {
  account: IPayoutAccount;
  busy: boolean;
  onSetPrimary: () => void;
  onRemove: () => void;
}) {
  const status = account.beneficiaryStatus
    ? STATUS_CONFIG[account.beneficiaryStatus]
    : undefined;
  const StatusIcon = status?.Icon;

  return (
    <div className="rounded-2xl border border-slate-100 p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="size-5 text-slate-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-900">
              {account.bankName}
            </p>
            {account.isPrimary && (
              <Badge
                variant="outline"
                className="gap-1 border-purple-200 bg-purple-50 text-xs text-purple-700"
              >
                <Star className="size-3 fill-purple-600 text-purple-600" />
                Primary
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {account.accountType} •••• {account.last4}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Added {format(parseISO(account.addedAt), "MMM d, yyyy")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {status && !status.helper && (
            <Badge variant="outline" className={`gap-1 ${status.className}`}>
              {StatusIcon && <StatusIcon className="size-3" />}
              {status.label}
            </Badge>
          )}
          {busy ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" />
          ) : (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-500"
                aria-label="Account actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!account.isPrimary && (
                <DropdownMenuItem onClick={onSetPrimary}>
                  <Star className="size-4" />
                  Set as primary
                </DropdownMenuItem>
              )}
              <DropdownMenuItem variant="destructive" onClick={onRemove}>
                <Trash2 className="size-4" />
                Remove account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
      </div>

      {status?.helper && (
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <Badge
            variant="outline"
            className={`w-fit shrink-0 gap-1 ${status.className}`}
          >
            {StatusIcon && <StatusIcon className="size-3" />}
            {status.label}
          </Badge>
          <p className="text-xs leading-relaxed text-slate-400">
            {status.helper}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Accounts tab — lists every linked payout account and lets the host switch the
 * primary destination, remove an account (with confirmation), or add another.
 */
export function PayoutAccountsManager({
  accounts,
  mutatingAccountId,
  onAddAccount,
  onSetPrimary,
  onRemove,
}: PayoutAccountsManagerProps) {
  const [pendingRemoval, setPendingRemoval] = useState<IPayoutAccount | null>(
    null,
  );

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Manage payout accounts</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Switch your primary account or remove ones you no longer use.
            </p>
          </div>
          <Button onClick={onAddAccount} className="gap-1.5">
            <Plus className="size-4" />
            Add account
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              busy={mutatingAccountId === account.id}
              onSetPrimary={() => onSetPrimary(account.id)}
              onRemove={() => setPendingRemoval(account)}
            />
          ))}
        </div>
      </CardContent>

      <RemoveAccountDialog
        account={pendingRemoval}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        onConfirm={() => {
          if (pendingRemoval) onRemove(pendingRemoval.id);
          setPendingRemoval(null);
        }}
      />
    </Card>
  );
}
