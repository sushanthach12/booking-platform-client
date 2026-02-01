"use client";

import { cn } from "@/lib/utils/utils";

const OPTIONS = ["Any", "1", "2", "3", "4", "5+"] as const;

export type RoomOption = (typeof OPTIONS)[number];

interface PillGroupProps {
  label: string;
  value: RoomOption;
  onChange: (value: RoomOption) => void;
  className?: string;
}

function PillGroup({ label, value, onChange, className }: PillGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              value === opt
                ? "border-transparent bg-foreground text-background"
                : "border-border bg-background hover:bg-muted"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

interface RoomsBedsBathsProps {
  bedrooms: RoomOption;
  beds: RoomOption;
  baths: RoomOption;
  onBedroomsChange: (value: RoomOption) => void;
  onBedsChange: (value: RoomOption) => void;
  onBathsChange: (value: RoomOption) => void;
  className?: string;
}

export function RoomsBedsBaths({
  bedrooms,
  beds,
  baths,
  onBedroomsChange,
  onBedsChange,
  onBathsChange,
  className,
}: RoomsBedsBathsProps) {
  return (
    <section className={cn("space-y-4", className)} aria-labelledby="rooms-beds-baths-heading">
      <h2 id="rooms-beds-baths-heading" className="font-semibold">
        Rooms, beds, and baths.
      </h2>
      <PillGroup label="Bedrooms" value={bedrooms} onChange={onBedroomsChange} />
      <PillGroup label="Beds" value={beds} onChange={onBedsChange} />
      <PillGroup label="Baths" value={baths} onChange={onBathsChange} />
    </section>
  );
}
