"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import type { GuestCount } from "./types";

interface GuestSelectorContentProps {
  value: GuestCount;
  onChange: (value: GuestCount) => void;
  maxGuests?: number;
}

export function GuestSelectorContent({
  value,
  onChange,
  maxGuests = 16,
}: GuestSelectorContentProps) {
  const totalGuests = value.adults + value.children;

  const adjust = (key: keyof GuestCount, delta: number) => {
    const next = { ...value };
    next[key] = Math.max(
      key === "adults" ? 1 : 0,
      Math.min(key === "infants" ? 5 : maxGuests, value[key] + delta),
    );
    if (key === "adults" && next.adults === 0) next.adults = 1;
    if (next.adults + next.children > maxGuests) return;
    onChange(next);
  };

  const rows: Array<{
    key: keyof GuestCount;
    label: string;
    sub: string;
    min: number;
  }> = [
    { key: "adults", label: "Adults", sub: "Age 13+", min: 1 },
    { key: "children", label: "Children", sub: "Ages 2–12", min: 0 },
    { key: "infants", label: "Infants", sub: "Under 2", min: 0 },
  ];

  return (
    <div className="space-y-0">
      {rows.map(({ key, label, sub, min }) => (
        <div
          key={key}
          className="flex justify-between items-center py-4 border-b border-border last:border-b-0"
        >
          <div>
            <p className="font-semibold text-sm text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-full"
              disabled={value[key] <= min}
              onClick={() => adjust(key, -1)}
              aria-label={`Decrease ${label}`}
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-6 text-center text-sm font-semibold tabular-nums">
              {value[key]}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-full"
              disabled={
                key === "adults" || key === "children"
                  ? totalGuests >= maxGuests
                  : value[key] >= 5
              }
              onClick={() => adjust(key, 1)}
              aria-label={`Increase ${label}`}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <p className="pt-3 text-xs text-muted-foreground mt-3">
        {maxGuests} guests maximum. Infants don&apos;t count toward the number
        of guests.
      </p>
    </div>
  );
}
