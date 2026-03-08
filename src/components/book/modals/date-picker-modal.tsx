"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";

interface DatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: DateRange | undefined;
  onValueChange: (range: DateRange | undefined) => void;
  onSave: () => void;
}

export function DatePickerModal({
  open,
  onOpenChange,
  value,
  onValueChange,
  onSave,
}: DatePickerModalProps) {
  const today = startOfDay(new Date());
  const canSave = value?.from != null && value?.to != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select dates</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onValueChange}
            numberOfMonths={2}
            disabled={(d) => d < today}
            className="rounded-md border"
          />
          <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Check-in
              </p>
              <p className="text-sm font-semibold text-foreground">
                {value?.from ? format(value.from, "d MMM yyyy") : "Add date"}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Check-out
              </p>
              <p className="text-sm font-semibold text-foreground">
                {value?.to ? format(value.to, "d MMM yyyy") : "Add date"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={!canSave} onClick={onSave}>
            Save dates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
