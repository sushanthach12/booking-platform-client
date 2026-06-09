"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { getPayoutUseCase } from "@/domain/di";
import { useEffect, useState } from "react";
import { useAddPayoutMethod } from "../hooks/use-add-payout-method";
import { WizardSteps } from "./wizard-steps";

interface AddPayoutMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a method is successfully added so the parent can refetch. */
  onAdded?: () => void;
}

/**
 * India-only "Add payout method" flow: collect bank account + IFSC details,
 * then review. Owns navigation/footer; delegates form state to
 * {@link useAddPayoutMethod} and step bodies to {@link WizardSteps}. Built on
 * the shared {@link Modal} primitive.
 *
 * On the final step the bank details are persisted via
 * {@link getPayoutUseCase}; on success the parent is notified to refetch and
 * the modal closes. The re-entered account number is UI-only and never sent.
 */
export function AddPayoutMethodModal({
  open,
  onOpenChange,
  onAdded,
}: AddPayoutMethodModalProps) {
  const {
    step,
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
  } = useAddPayoutMethod();

  const [error, setError] = useState<string | null>(null);

  // Reset the flow (and any prior error) whenever it is reopened.
  useEffect(() => {
    if (open) {
      reset();
      setError(null);
    }
  }, [open, reset]);

  const handlePrimary = async () => {
    if (!isLastStep) {
      next();
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await getPayoutUseCase().addAccount({
        accountHolder: form.accountHolder.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifsc: form.ifsc.trim().toUpperCase(),
      });
      onAdded?.();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add payout account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-h-[90vh] max-w-lg"
    >
      <Modal.Header className="shrink-0 pb-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900">
        Add payout method
      </Modal.Header>
      <p className="shrink-0 px-6 pt-1 text-sm text-slate-500">
        Securely connect the Indian bank account you want to be paid into
      </p>

      {/* Scrollable body so a tall step never forces the modal to full height. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-5">
        <WizardSteps step={step} form={form} setField={setField} />
      </div>

      {error && (
        <p className="shrink-0 px-6 pt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
        {!isFirstStep && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={back}
            disabled={submitting}
          >
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={handlePrimary}
          disabled={!isStepValid || submitting}
        >
          {isLastStep ? (submitting ? "Adding…" : "Add account") : "Continue"}
        </Button>
      </div>
    </Modal>
  );
}
