"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useAddPayoutMethod } from "../hooks/use-add-payout-method";
import { WizardStepper } from "./wizard-stepper";
import { WizardSteps } from "./wizard-steps";

interface AddPayoutMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a method is successfully added so the parent can refetch. */
  onAdded?: () => void;
}

/**
 * 5-step "Add payout method" wizard. Owns navigation/footer; delegates form
 * state to {@link useAddPayoutMethod} and step bodies to {@link WizardSteps}.
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
    stepIndex,
    steps,
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

  // Reset the wizard whenever it is reopened.
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 rounded-2xl p-0">
        <div className="space-y-1 px-6 pt-6">
          <DialogTitle className="text-lg font-bold text-slate-900">
            Add payout method
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Securely connect where you want to be paid
          </DialogDescription>
        </div>

        <div className="px-6 pt-5">
          <WizardStepper steps={steps} currentIndex={stepIndex} />
        </div>

        <div className="mt-6 px-6">
          <WizardSteps step={step} form={form} setField={setField} />
        </div>

        <div className="mt-6 flex gap-3 px-6 pb-6">
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
      </DialogContent>
    </Dialog>
  );
}
