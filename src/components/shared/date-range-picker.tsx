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
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select dates",
  className,
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
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          className="range-calendar"
          modifiersStyles={{
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
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
