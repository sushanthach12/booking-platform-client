"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay } from "date-fns";
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
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-2xl max-h-[92vh]"
    >
      <Modal.Header>Select dates</Modal.Header>
      <Modal.Body className="mb-4">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onValueChange}
          numberOfMonths={2}
          disabled={(d) => d < today}
          className="rounded-md border w-full"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline"
          size={"lg"}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button size="lg" disabled={!canSave} onClick={onSave}>
          Save dates
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
