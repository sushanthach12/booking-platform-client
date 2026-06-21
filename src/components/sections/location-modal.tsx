"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Selectable cities (e.g. destinations with active listings). */
  cities: string[];
  /** Currently selected location label. */
  current: string;
  /** Called with the chosen city, or "" to clear back to "anywhere". */
  onSelect: (city: string) => void;
}

/**
 * Location picker for the "stays near …" rail. Lets the guest filter the city
 * list, pick a destination, or type a free-text place and apply it.
 */
export function LocationModal({
  open,
  onOpenChange,
  cities,
  current,
  onSelect,
}: LocationModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, query]);

  const apply = (city: string) => {
    onSelect(city);
    onOpenChange(false);
    setQuery("");
  };

  const trimmedQuery = query.trim();

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
      <Modal.Header>Choose a location</Modal.Header>
      <Modal.Body className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Pick a destination or search for a place to see stays nearby.
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or area…"
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmedQuery) apply(trimmedQuery);
            }}
          />
        </div>

        <div className="max-h-72 overflow-y-auto -mx-1 px-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => apply("")}
            className="w-full justify-start gap-2.5 h-auto px-3 py-2.5 font-normal"
          >
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <span className={current === "" ? "font-semibold" : ""}>
              Anywhere
            </span>
          </Button>

          {filtered.map((city) => (
            <Button
              key={city}
              type="button"
              variant="ghost"
              onClick={() => apply(city)}
              className="w-full justify-start gap-2.5 h-auto px-3 py-2.5 font-normal"
            >
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className={current === city ? "font-semibold" : ""}>
                {city}
              </span>
            </Button>
          ))}

          {filtered.length === 0 && trimmedQuery && (
            <p className="px-3 py-4 text-sm text-muted-foreground">
              No saved destinations match “{trimmedQuery}”.
            </p>
          )}
        </div>

        {trimmedQuery && filtered.length === 0 && (
          <Button onClick={() => apply(trimmedQuery)} className="w-full">
            Search stays in “{trimmedQuery}”
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
}
