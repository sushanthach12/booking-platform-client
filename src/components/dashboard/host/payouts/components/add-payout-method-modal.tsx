"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
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
 * The final submit is intentionally optimistic — the backend endpoint for
 * persisting a payout method is not yet wired, so on the review step we simply
 * notify the parent to refetch and close. Swap in the real use-case call here
 * once the API exists (see refs/stubs.md).
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

  // Reset the flow whenever it is reopened.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handlePrimary = async () => {
    if (!isLastStep) {
      next();
      return;
    }
    setSubmitting(true);
    try {
      // TODO(payouts-api): call PayoutUseCase.addAccount(form) once the
      // backend endpoint exists. For now we close optimistically.
      onAdded?.();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-h-[90vh] max-w-lg">
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
