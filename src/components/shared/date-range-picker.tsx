"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, startOfDay } from "date-fns";
import { CalendarDays, ChevronDown, ChevronDownIcon, X } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  /** "split" = CHECK-IN | CHECKOUT in one row; "chip" = compact chip trigger for search/toolbars */
  variant?: "default" | "split" | "chip";
  /** For variant="chip": popover alignment (default "start") */
  popoverAlign?: "start" | "end" | "center";
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
  popoverAlign = "start",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);

  // Sync from parent when closed; when chip variant is open, don't overwrite so range selection (from then to) isn't interrupted
  React.useEffect(() => {
    if (variant !== "chip" || !open) {
      setDate(value);
    }
  }, [value, variant, open]);
  // When chip popover opens, seed with current value so calendar shows existing range
  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);
  React.useEffect(() => {
    if (open) setDate(valueRef.current ?? undefined);
  }, [open]);

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
      disabled={(d) => d < startOfDay(new Date())}
      className="range-calendar"
      {...calendarModifiers}
    />
  );

  if (variant === "chip") {
    const nights =
      date?.from && date?.to
        ? Math.round(
          (date.to.getTime() - date.from.getTime()) / 86400000,
        )
        : null;
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 h-9 px-3.5 rounded-xl border text-sm font-medium transition-colors",
              open
                ? "bg-orange-50 border-orange-200 text-orange-700"
                : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:text-stone-800",
              className,
            )}
          >
            <CalendarDays
              className={cn(
                "size-3.5 shrink-0",
                open ? "text-orange-400" : "text-stone-400",
              )}
            />
            {displayDateRange()}
            <ChevronDown
              className={cn(
                "size-3 shrink-0 transition-transform text-stone-300",
                open && "rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={popoverAlign}
          sideOffset={8}
          className="w-auto p-0 rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/10 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-stone-50/80">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Select dates
              </p>
              <p className="text-sm font-semibold text-stone-800 mt-0.5">
                {date?.from && date?.to
                  ? `${format(date.from, "MMM d")} – ${format(date.to, "MMM d, yyyy")}`
                  : date?.from
                    ? `${format(date.from, "MMM d, yyyy")} — pick checkout`
                    : "When are you travelling?"}
              </p>
            </div>
            {date?.from && (
              <button
                type="button"
                onClick={() => {
                  setDate(undefined);
                  onChange?.(undefined);
                }}
                className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 ml-8 transition-colors"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>
          {calendarEl}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-100 bg-stone-50/80">
            <span className="text-xs text-stone-400">
              {nights !== null
                ? `${nights} nights selected`
                : "Select check-in & check-out"}
            </span>
            <Button
              size="sm"
              disabled={!date?.from || !date?.to}
              onClick={() => setOpen(false)}
              className="rounded-xl h-8 px-4 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white disabled:opacity-40"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

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
