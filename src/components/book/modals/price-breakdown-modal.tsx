"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PriceBreakdownLine {
  label: string;
  value: number;
  /** e.g. "text-green-600" for discount */
  valueClassName?: string;
}

interface PriceBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: PriceBreakdownLine[];
  totalLabel: string;
  totalValue: string;
  /** Optional tip (e.g. weekly discount message) */
  tip?: React.ReactNode;
}

export function PriceBreakdownModal({
  open,
  onOpenChange,
  lines,
  totalLabel,
  totalValue,
  tip,
}: PriceBreakdownModalProps) {
  const formatAmount = (n: number) => {
    const sign = n < 0 ? "−" : "";
    return `${sign}₹${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Price breakdown</DialogTitle>
        </DialogHeader>
        <div className="space-y-0">
          {lines.map(({ label, value, valueClassName }, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b border-border last:border-b-0"
            >
              <span className="text-sm text-foreground">{label}</span>
              <span
                className={
                  valueClassName ?? "text-sm font-semibold text-foreground"
                }
              >
                {formatAmount(value)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-muted/50 flex justify-between items-center">
          <span className="font-semibold text-foreground">{totalLabel}</span>
          <span className="text-lg font-bold text-foreground">{totalValue}</span>
        </div>
        {tip && (
          <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            {tip}
          </div>
        )}
        <DialogFooter className="flex-row justify-end sm:justify-end">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
