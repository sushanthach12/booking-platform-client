"use client";

import { useCallback, useMemo, useState } from "react";

export const PAYOUT_WIZARD_STEPS = ["DETAILS", "REVIEW"] as const;

export type PayoutWizardStep = (typeof PAYOUT_WIZARD_STEPS)[number];

export interface PayoutMethodForm {
  /** Name exactly as it appears on the bank account. */
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  /** Re-entered account number — must match to guard against typos. */
  confirmAccountNumber: string;
  /** 11-character IFSC code (e.g. HDFC0001234). */
  ifsc: string;
}

/** This platform pays out to India only, in INR. */
export const PAYOUT_COUNTRY = "India";
export const PAYOUT_CURRENCY = "INR";

/** IFSC: 4 letters (bank) + 0 + 6 alphanumerics (branch). */
const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
/** Indian bank account numbers run 9–18 digits. */
const ACCOUNT_PATTERN = /^\d{9,18}$/;

const INITIAL_FORM: PayoutMethodForm = {
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifsc: "",
};

/** True when the IFSC matches the 11-char Indian format. */
export function isValidIfsc(ifsc: string): boolean {
  return IFSC_PATTERN.test(ifsc.trim().toUpperCase());
}

/** True when the account number is 9–18 digits. */
export function isValidAccountNumber(account: string): boolean {
  return ACCOUNT_PATTERN.test(account.trim());
}

/** True when every field passes its India-specific format/match rule. */
export function isPayoutFormValid(form: PayoutMethodForm): boolean {
  return (
    form.accountHolder.trim().length >= 2 &&
    form.bankName.trim().length >= 2 &&
    isValidAccountNumber(form.accountNumber) &&
    form.accountNumber.trim() === form.confirmAccountNumber.trim() &&
    isValidIfsc(form.ifsc)
  );
}

/**
 * Owns the controlled state and step navigation for the India-only
 * "Add payout method" flow: collect bank details, then review. Validation is
 * per-step so the user can only advance once details are complete and valid.
 */
export function useAddPayoutMethod() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<PayoutMethodForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const step = PAYOUT_WIZARD_STEPS[stepIndex];

  const setField = useCallback(
    <K extends keyof PayoutMethodForm>(key: K, value: PayoutMethodForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const isStepValid = useMemo(() => {
    switch (step) {
      case "DETAILS":
        return isPayoutFormValid(form);
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
