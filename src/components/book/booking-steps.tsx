"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BadgeCheck, Building2, CreditCard } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export type PaymentMethodId = "online" | "pay_at_checkin" | null;

export interface BookingStepsProps {
  /** Controlled open step: "step-1" | "step-2" */
  value: string;
  onValueChange: (val: string) => void;
  /** Selected payment method label when step 1 is completed */
  completedPayment: string | null;
  selectedPaymentId: PaymentMethodId;
  onSelectPayment: (id: PaymentMethodId) => void;
  onPaymentNext: () => void;
  /** Review step props */
  cancellationDate?: string;
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
  onConfirm: () => void | Promise<void>;
  confirmLoading?: boolean;
  confirmError?: string | null;
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: "online",
    label: "Pay Online",
    description: "UPI, Card, Net Banking — secure checkout via Cashfree",
    icon: <CreditCard className="size-5 text-muted-foreground" />,
  },
  {
    id: "pay_at_checkin",
    label: "Pay at Check-in",
    description: "Pay the host directly at the property on arrival",
    icon: <Building2 className="size-5 text-muted-foreground" />,
  },
];

export function BookingSteps({
  value,
  onValueChange,
  completedPayment,
  selectedPaymentId,
  onSelectPayment,
  onPaymentNext,
  cancellationDate = "2 April",
  agreed,
  onAgreedChange,
  onConfirm,
  confirmLoading = false,
  confirmError,
}: BookingStepsProps) {
  const confirmLabel =
    selectedPaymentId === "pay_at_checkin"
      ? "Confirm reservation"
      : "Confirm and pay online";

  return (
    <Accordion
      type="single"
      collapsible={false}
      value={value}
      onValueChange={onValueChange}
      className="space-y-4"
    >
      {/* Step 1: Choose payment method */}
      <AccordionItem
        value="step-1"
        className={cn(
          "border border-gray-200 rounded-3xl overflow-hidden shadow-none px-6",
          value === "step-1"
            ? "border-stone-100 shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            : "shadow-none",
        )}
      >
        <AccordionTrigger className="hover:no-underline py-5 [&>svg]:hidden">
          <div className="flex justify-between items-center w-full">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-foreground">
                1. How would you like to pay?
              </h3>
              {value !== "step-1" && completedPayment !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  {completedPayment}
                </p>
              )}
            </div>
            {value !== "step-1" && completedPayment !== null && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onValueChange("step-1");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onValueChange("step-1");
                  }
                }}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-lg text-foreground font-semibold shrink-0 cursor-pointer",
                )}
              >
                Change
              </span>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-6 pt-0">
          <div className="space-y-4">
            <RadioGroup
              value={selectedPaymentId ?? ""}
              onValueChange={(val) => onSelectPayment(val as PaymentMethodId)}
              className="gap-0 rounded-xl border border-border overflow-hidden"
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    selectedPaymentId === opt.id
                      ? "bg-muted/50"
                      : "hover:bg-muted/30",
                  )}
                >
                  <Label
                    htmlFor={opt.id ?? ""}
                    className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                    <RadioGroupItem value={opt.id ?? ""} id={opt.id ?? ""} />
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedPaymentId === "online" && (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 px-4 py-3">
                <BadgeCheck className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  You&apos;ll be redirected to Cashfree&apos;s secure page to
                  complete payment. Card details are entered there, never on
                  this site.
                </p>
              </div>
            )}

            <div className="w-full flex items-center justify-end">
              <Button
                size="lg"
                disabled={!selectedPaymentId}
                onClick={onPaymentNext}
              >
                Next
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2: Review */}
      <AccordionItem
        value="step-2"
        className={cn(
          "border border-gray-200 rounded-3xl overflow-hidden shadow-none px-6",
          value === "step-2"
            ? "border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            : "shadow-none",
        )}
      >
        <AccordionTrigger className="hover:no-underline py-5 [&>svg]:hidden">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">
              2. Review your reservation
            </h3>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-6 pt-0">
          <div className="space-y-5">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-foreground mb-1">
                Free cancellation
              </p>
              <p className="text-sm text-muted-foreground">
                Cancel before {cancellationDate} for a full refund.{" "}
                <span className="underline cursor-pointer text-foreground font-medium">
                  Full policy
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground mb-2">
                Ground rules
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We ask every guest to remember a few simple things: follow the
                house rules, treat the host&apos;s home like your own, and
                communicate openly.
              </p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex gap-3 items-start">
              <Checkbox
                id="booking-terms"
                size="lg"
                checked={agreed}
                onCheckedChange={(c) => onAgreedChange(c === true)}
                className="mt-0.5 peer"
              />
              <Label
                htmlFor="booking-terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                By selecting the button, I agree to the{" "}
                <span className="underline text-foreground font-medium">
                  booking terms
                </span>
                .
              </Label>
            </div>
            {confirmError ? (
              <p className="text-sm text-destructive" role="alert">
                {confirmError}
              </p>
            ) : null}
            <Button
              className="w-full"
              size="lg"
              disabled={!agreed || confirmLoading}
              onClick={() => void onConfirm()}
            >
              {confirmLoading ? "Processing…" : confirmLabel}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
