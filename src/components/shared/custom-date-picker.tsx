"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Add date",
  className,
}: CustomDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const displayText = date ? format(date, "MMM d, yyyy") : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto p-0 text-sm font-semibold text-foreground hover:bg-transparent justify-start w-full",
            !date && "text-muted-foreground",
            className,
          )}
          onClick={handleButtonClick}
        >
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date || new Date()}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "hsl(var(--amber-500))",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
