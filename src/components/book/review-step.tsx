"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ReviewAccordionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cancellationDate?: string;
  agreed: boolean;
  onAgreedChange: (v: boolean) => void;
  onConfirm: () => void;
}

export function ReviewAccordion({
  open,
  onOpenChange,
  cancellationDate = "2 April",
  agreed,
  onAgreedChange,
  onConfirm,
}: ReviewAccordionProps) {
  return (
    <Card
      className={cn(
        "transition-shadow",
        open && "shadow-md",
      )}
    >
      <button
        type="button"
        className="w-full text-left p-5"
        onClick={() => onOpenChange(!open)}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground mb-1">2.</p>
            <h3 className="text-lg font-semibold text-foreground">
              Review your reservation
            </h3>
          </div>
        </div>
      </button>
      {open && (
        <CardContent className="pt-0 px-5 pb-5 space-y-5">
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
              checked={agreed}
              onCheckedChange={(c) => onAgreedChange(c === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="booking-terms"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              By selecting the button, I agree to the{" "}
              <span className="underline text-foreground font-medium">
                booking terms
              </span>
              .
            </label>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            disabled={!agreed}
            onClick={onConfirm}
          >
            Confirm and pay
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
