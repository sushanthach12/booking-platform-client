"use client";

import { cn } from "@/lib/utils";

export type PlaceType = "entire" | "private" | "shared";

const OPTIONS: { value: PlaceType; label: string; description: string }[] = [
  {
    value: "entire",
    label: "Entire place",
    description: "A place all to yourself.",
  },
  {
    value: "private",
    label: "Private room",
    description:
      "Your own room in a home or a hotel, plus some shared common spaces.",
  },
  {
    value: "shared",
    label: "Shared room",
    description:
      "A sleeping space and common areas that may be shared with others.",
  },
];

interface TypeOfPlaceProps {
  selected: Set<PlaceType>;
  onToggle: (value: PlaceType) => void;
  className?: string;
}

export function TypeOfPlace({ selected, onToggle, className }: TypeOfPlaceProps) {
  return (
    <section className={cn("space-y-3", className)} aria-labelledby="type-of-place-heading">
      <h2 id="type-of-place-heading" className="font-semibold">
        Type of place.
      </h2>
      <ul className="space-y-3">
        {OPTIONS.map(({ value, label, description }) => (
          <li key={value} className="flex items-start gap-3">
            <input
              id={`filter-type-${value}`}
              type="checkbox"
              checked={selected.has(value)}
              onChange={() => onToggle(value)}
              className="mt-1 size-4 rounded border-input"
              aria-describedby={`filter-type-${value}-desc`}
            />
            <label htmlFor={`filter-type-${value}`} className="flex-1 cursor-pointer">
              <span className="font-medium">{label}</span>
              <p id={`filter-type-${value}-desc`} className="text-sm text-muted-foreground">
                {description}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
