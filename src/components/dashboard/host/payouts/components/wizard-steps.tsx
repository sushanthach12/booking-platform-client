"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  PayoutMethodForm,
  PayoutMethodType,
  PayoutWizardStep,
} from "../hooks/use-add-payout-method";
import { Banknote, CreditCard, Landmark, Lock, Wallet } from "lucide-react";

interface WizardStepsProps {
  step: PayoutWizardStep;
  form: PayoutMethodForm;
  setField: <K extends keyof PayoutMethodForm>(
    key: K,
    value: PayoutMethodForm[K],
  ) => void;
}

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
];

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar",
  GBP: "British Pound",
  INR: "Indian Rupee",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  EUR: "Euro",
};

const METHODS: {
  value: PayoutMethodType;
  label: string;
  description: string;
  icon: typeof Landmark;
}[] = [
  {
    value: "bank_account",
    label: "Bank account",
    description: "Direct deposit, 1–3 business days",
    icon: Landmark,
  },
  {
    value: "card",
    label: "Debit card",
    description: "Instant transfer, fees may apply",
    icon: CreditCard,
  },
  {
    value: "paypal",
    label: "PayPal",
    description: "Transfer to your PayPal balance",
    icon: Wallet,
  },
];

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

/** Renders the body for the currently active wizard step. */
export function WizardSteps({ step, form, setField }: WizardStepsProps) {
  switch (step) {
    case "LOCATION":
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Your available payout methods depend on where your bank account is
            located.
          </p>
          <Field>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Country / Region
            </Label>
            <Select
              value={form.country}
              onValueChange={(v) => setField("country", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs text-slate-400">Payout currency</p>
              <p className="text-sm font-medium text-slate-900">
                {form.currency} — {CURRENCY_NAMES[form.currency] ?? form.currency}
              </p>
            </div>
            <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-xs text-slate-500">
              Auto-selected
            </span>
          </div>
          <SecurityNote />
        </div>
      );

    case "METHOD":
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Choose how you&apos;d like to receive your earnings.
          </p>
          {METHODS.map((m) => {
            const Icon = m.icon;
            const selected = form.method === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setField("method", m.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                  selected
                    ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    selected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500",
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{m.label}</p>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>
                <span
                  className={cn(
                    "size-4 rounded-full border-2",
                    selected
                      ? "border-blue-500 bg-blue-500 ring-2 ring-inset ring-white"
                      : "border-slate-300",
                  )}
                />
              </button>
            );
          })}
        </div>
      );

    case "DETAILS":
      return (
        <div className="space-y-4">
          <Field>
            <Label>Account holder name</Label>
            <Input
              value={form.accountHolder}
              onChange={(e) => setField("accountHolder", e.target.value)}
              placeholder="Full legal name"
            />
          </Field>
          {form.method === "bank_account" && (
            <>
              <Field>
                <Label>Bank name</Label>
                <Input
                  value={form.bankName}
                  onChange={(e) => setField("bankName", e.target.value)}
                  placeholder="e.g. Chase Bank"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <Label>Account number</Label>
                  <Input
                    value={form.accountNumber}
                    onChange={(e) => setField("accountNumber", e.target.value)}
                    placeholder="••••••••"
                    inputMode="numeric"
                  />
                </Field>
                <Field>
                  <Label>Routing number</Label>
                  <Input
                    value={form.routingNumber}
                    onChange={(e) => setField("routingNumber", e.target.value)}
                    placeholder="•••••••••"
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </>
          )}
          <SecurityNote />
        </div>
      );

    case "TAX INFO":
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            We need your tax identification number to comply with reporting
            requirements.
          </p>
          <Field>
            <Label>Tax ID (SSN / EIN / TIN)</Label>
            <Input
              value={form.taxId}
              onChange={(e) => setField("taxId", e.target.value)}
              placeholder="•••-••-••••"
            />
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
                {METHODS.find((m) => m.value === form.method)?.label}
              </p>
              <p className="text-xs text-slate-500">
                {form.bankName || form.accountHolder}
              </p>
            </div>
          </div>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 px-4">
            <ReviewRow label="Country" value={form.country} />
            <ReviewRow label="Currency" value={form.currency} />
            <ReviewRow label="Account holder" value={form.accountHolder} />
            {form.method === "bank_account" && (
              <ReviewRow
                label="Account"
                value={
                  form.accountNumber
                    ? `•••• ${form.accountNumber.slice(-4)}`
                    : ""
                }
              />
            )}
          </div>
          <SecurityNote />
        </div>
      );

    default:
      return null;
  }
}
