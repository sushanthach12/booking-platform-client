"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Fragment } from "react";

interface WizardStepperProps {
  steps: readonly string[];
  currentIndex: number;
}

/** Numbered progress header for the add-payout-method wizard. */
export function WizardStepper({ steps, currentIndex }: WizardStepperProps) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isCurrent && "bg-blue-600 text-white",
                  isComplete && "bg-blue-600 text-white",
                  !isCurrent && !isComplete && "bg-slate-100 text-slate-400",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  isCurrent ? "text-blue-600" : "text-slate-400",
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 mb-5 h-px flex-1 transition-colors",
                  isComplete ? "bg-blue-600" : "bg-slate-200",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
