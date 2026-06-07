"use client";

import { useCallback, useMemo, useState } from "react";

export const PAYOUT_WIZARD_STEPS = [
  "LOCATION",
  "METHOD",
  "DETAILS",
  "TAX INFO",
  "REVIEW",
] as const;

export type PayoutWizardStep = (typeof PAYOUT_WIZARD_STEPS)[number];

export type PayoutMethodType = "bank_account" | "card" | "paypal";

export interface PayoutMethodForm {
  country: string;
  currency: string;
  method: PayoutMethodType;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  taxId: string;
}

/** Country → default payout currency, mirroring the "Auto-selected" hint. */
const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
};

const INITIAL_FORM: PayoutMethodForm = {
  country: "US",
  currency: "USD",
  method: "bank_account",
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  taxId: "",
};

/**
 * Owns the controlled state and step navigation for the 5-step
 * "Add payout method" wizard. Validation is per-step so the user can only
 * advance once the current step is complete.
 */
export function useAddPayoutMethod() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<PayoutMethodForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const step = PAYOUT_WIZARD_STEPS[stepIndex];

  const setField = useCallback(
    <K extends keyof PayoutMethodForm>(key: K, value: PayoutMethodForm[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        // Auto-select currency when the country changes.
        if (key === "country") {
          next.currency = COUNTRY_CURRENCY[value as string] ?? prev.currency;
        }
        return next;
      });
    },
    [],
  );

  const isStepValid = useMemo(() => {
    switch (step) {
      case "LOCATION":
        return Boolean(form.country && form.currency);
      case "METHOD":
        return Boolean(form.method);
      case "DETAILS":
        if (form.method === "bank_account") {
          return Boolean(
            form.accountHolder.trim() &&
              form.bankName.trim() &&
              form.accountNumber.trim().length >= 4 &&
              form.routingNumber.trim().length >= 4,
          );
        }
        return Boolean(form.accountHolder.trim());
      case "TAX INFO":
        return form.taxId.trim().length >= 4;
      case "REVIEW":
        return true;
      default:
        return false;
    }
  }, [step, form]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === PAYOUT_WIZARD_STEPS.length - 1;

  const next = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, PAYOUT_WIZARD_STEPS.length - 1));
  }, []);

  const back = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setForm(INITIAL_FORM);
    setSubmitting(false);
  }, []);

  return {
    step,
    stepIndex,
    steps: PAYOUT_WIZARD_STEPS,
    form,
    setField,
    isStepValid,
    isFirstStep,
    isLastStep,
    submitting,
    setSubmitting,
    next,
    back,
    reset,
  };
}
