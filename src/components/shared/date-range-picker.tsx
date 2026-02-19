"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarDays, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  /** "split" = CHECK-IN | CHECKOUT in one row, for use inside a combined date+guest block */
  variant?: "default" | "split";
}

const calendarModifiers = {
  modifiersStyles: {
    selected: {
      backgroundColor: "hsl(var(--slate-900))",
      color: "white",
      fontWeight: "bold",
    },
    range_start: {
      backgroundColor: "hsl(var(--slate-900))",
      color: "white",
      fontWeight: "bold",
    },
    range_end: {
      backgroundColor: "hsl(var(--slate-900))",
      color: "white",
      fontWeight: "bold",
    },
    range_middle: {
      backgroundColor: "hsl(var(--slate-200))",
      color: "hsl(var(--slate-900))",
    },
  },
} as const;

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select dates",
  className,
  variant = "default",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setDate(selectedRange);
    onChange?.(selectedRange);
  };

  const displayDateRange = () => {
    if (!date?.from) {
      return <span>{placeholder}</span>;
    }
    if (date.from && !date.to) {
      return <span>{format(date.from, "MMM d")}</span>;
    }
    if (date.from && date.to) {
      const sameMonth =
        date.from.getMonth() === date.to.getMonth() &&
        date.from.getFullYear() === date.to.getFullYear();
      if (sameMonth) {
        return (
          <span>
            {format(date.from, "MMM d")} - {format(date.to, "d")}
          </span>
        );
      }
      return (
        <span>
          {format(date.from, "MMM d")} - {format(date.to, "MMM d")}
        </span>
      );
    }
    return <span>{placeholder}</span>;
  };

  const calendarEl = (
    <Calendar
      mode="range"
      defaultMonth={date?.from}
      selected={date}
      onSelect={handleSelect}
      numberOfMonths={2}
      disabled={(d) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
      }}
      className="range-calendar"
      {...calendarModifiers}
    />
  );

  if (variant === "split") {
    const checkInLabel = "CHECK-IN";
    const checkOutLabel = "CHECKOUT";
    const checkInValue = date?.from ? format(date.from, "M/d/yyyy") : "Add date";
    const checkOutValue = date?.to ? format(date.to, "M/d/yyyy") : "Add date";
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full text-left font-normal outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg",
              !date?.from && "text-muted-foreground",
              className,
            )}
          >
            <div className="flex-1 py-3 px-4 lg:py-4 lg:px-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:text-sm">
                {checkInLabel}
              </div>
              <div className={cn("text-sm mt-0.5 lg:text-base", !date?.from && "text-muted-foreground")}>
                {checkInValue}
              </div>
            </div>
            <div className="flex-1 py-3 px-4 border-l border-border lg:py-4 lg:px-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:text-sm">
                {checkOutLabel}
              </div>
              <div className={cn("text-sm mt-0.5 lg:text-base", !date?.to && "text-muted-foreground")}>
                {checkOutValue}
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {calendarEl}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !date?.from && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            {displayDateRange()}
          </div>
          <ChevronDownIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {calendarEl}
      </PopoverContent>
    </Popover>
  );
}
