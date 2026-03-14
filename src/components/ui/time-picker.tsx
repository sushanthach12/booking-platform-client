"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({
  id,
  value,
  onChange,
  className,
}: TimePickerProps) {
  return (
    <Input
      type="time"
      id={id}
      step="1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
        className,
      )}
    />
  );
}
