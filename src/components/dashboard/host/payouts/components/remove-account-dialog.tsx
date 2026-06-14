"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import type { IPayoutAccount } from "@/domain/interfaces";
import { AlertTriangle } from "lucide-react";

interface RemoveAccountDialogProps {
  /** The account pending removal, or `null` when the dialog is closed. */
  account: IPayoutAccount | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/**
 * Confirmation step before removing a payout account. Removal is blocked by the
 * API while a payout to the account is still in flight, so the destructive
 * action here is safe to confirm without further checks.
 */
export function RemoveAccountDialog({
  account,
  onOpenChange,
  onConfirm,
}: RemoveAccountDialogProps) {
  return (
    <Modal open={account !== null} onOpenChange={onOpenChange} className="max-w-md">
      <Modal.Header className="[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900">
        Remove payout account
      </Modal.Header>

      <Modal.Body className="pt-0">
        <div className="flex gap-3 rounded-xl bg-red-50 p-4">
          <AlertTriangle className="size-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">
            {account?.isPrimary
              ? "This is your primary account. Removing it will promote another linked account to primary."
              : "You can re-add this account later, but you'll need to re-enter and re-verify its details."}
          </p>
        </div>
        {account && (
          <p className="mt-4 text-sm text-slate-600">
            Remove{" "}
            <span className="font-semibold text-slate-900">
              {account.bankName}
            </span>{" "}
            ({account.accountType} •••• {account.last4})?
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Remove account
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
