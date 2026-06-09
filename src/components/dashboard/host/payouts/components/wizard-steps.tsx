"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Lock } from "lucide-react";
import {
  PAYOUT_COUNTRY,
  PAYOUT_CURRENCY,
  isValidAccountNumber,
  isValidIfsc,
  type PayoutMethodForm,
  type PayoutWizardStep,
} from "../hooks/use-add-payout-method";

interface WizardStepsProps {
  step: PayoutWizardStep;
  form: PayoutMethodForm;
  setField: <K extends keyof PayoutMethodForm>(
    key: K,
    value: PayoutMethodForm[K],
  ) => void;
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function SecurityNote() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3.5 py-3 text-sm text-blue-700">
      <Lock className="size-4 shrink-0" />
      Your financial data is encrypted and protected with bank-level security.
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

/** Renders the body for the currently active step (India bank payout). */
export function WizardSteps({ step, form, setField }: WizardStepsProps) {
  const accountMismatch =
    form.confirmAccountNumber.length > 0 &&
    form.accountNumber.trim() !== form.confirmAccountNumber.trim();
  const accountInvalid =
    form.accountNumber.length > 0 && !isValidAccountNumber(form.accountNumber);
  const ifscInvalid = form.ifsc.length > 0 && !isValidIfsc(form.ifsc);

  switch (step) {
    case "DETAILS":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-2">
            <p className="text-sm font-medium text-slate-900">
              {PAYOUT_COUNTRY} — {PAYOUT_CURRENCY} (Indian Rupee)
            </p>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-xs text-slate-500">
              Bank transfer
            </span>
          </div>

          <Field>
            <Label>Account holder name</Label>
            <Input
              value={form.accountHolder}
              onChange={(e) => setField("accountHolder", e.target.value)}
              placeholder="Name as per bank records"
              autoComplete="name"
            />
          </Field>

          <Field>
            <Label>Bank name</Label>
            <Input
              value={form.bankName}
              onChange={(e) => setField("bankName", e.target.value)}
              placeholder="e.g. HDFC Bank"
            />
          </Field>

          <Field>
            <Label>Account number</Label>
            <Input
              value={form.accountNumber}
              onChange={(e) =>
                setField(
                  "accountNumber",
                  e.target.value.replace(/\D/g, "").slice(0, 18),
                )
              }
              placeholder="9–18 digit account number"
              inputMode="numeric"
              aria-invalid={accountInvalid}
            />
            {accountInvalid && (
              <p className="text-xs text-red-600">
                Enter a valid 9–18 digit account number.
              </p>
            )}
          </Field>

          <Field>
            <Label>Confirm account number</Label>
            <Input
              value={form.confirmAccountNumber}
              onChange={(e) =>
                setField(
                  "confirmAccountNumber",
                  e.target.value.replace(/\D/g, "").slice(0, 18),
                )
              }
              placeholder="Re-enter account number"
              inputMode="numeric"
              aria-invalid={accountMismatch}
            />
            {accountMismatch && (
              <p className="text-xs text-red-600">
                Account numbers do not match.
              </p>
            )}
          </Field>

          <Field>
            <Label>IFSC code</Label>
            <Input
              value={form.ifsc}
              onChange={(e) =>
                setField(
                  "ifsc",
                  e.target.value.toUpperCase().replace(/\s/g, "").slice(0, 11),
                )
              }
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              className="tracking-wide not-placeholder-shown:uppercase"
              aria-invalid={ifscInvalid}
            />
            {ifscInvalid ? (
              <p className="text-xs text-red-600">
                IFSC must be 11 characters: 4 letters, a 0, then 6 more (e.g.
                CNRB0000063).
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                11-character code on your cheque / passbook.
              </p>
            )}
          </Field>

          <SecurityNote />
        </div>
      );

    case "REVIEW":
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-slate-200/70 text-slate-500">
              <Banknote className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {form.bankName || "Bank account"}
              </p>
              <p className="text-xs text-slate-500">{form.accountHolder}</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 px-4">
            <ReviewRow label="Region" value={PAYOUT_COUNTRY} />
            <ReviewRow label="Currency" value={PAYOUT_CURRENCY} />
            <ReviewRow label="Account holder" value={form.accountHolder} />
            <ReviewRow label="Bank" value={form.bankName} />
            <ReviewRow
              label="Account"
              value={
                form.accountNumber ? `•••• ${form.accountNumber.slice(-4)}` : ""
              }
            />
            <ReviewRow label="IFSC" value={form.ifsc} />
          </div>
          <SecurityNote />
        </div>
      );

    default:
      return null;
  }
}
