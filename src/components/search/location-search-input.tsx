"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

interface NominatimResult {
  osm_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

function buildMainText(r: NominatimResult): string {
  const a = r.address;
  return (
    [a.house_number, a.road].filter(Boolean).join(" ") ||
    r.display_name.split(",")[0]
  );
}

function buildSecondaryText(r: NominatimResult): string {
  return r.display_name
    .split(",")
    .slice(1)
    .map((s) => s.trim())
    .slice(0, 3)
    .join(", ");
}

async function searchPlaces(query: string): Promise<Suggestion[]> {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!res.ok) return [];
  const data: NominatimResult[] = await res.json();
  return data.map((r) => ({
    placeId: String(r.osm_id),
    mainText: buildMainText(r),
    secondaryText: buildSecondaryText(r),
  }));
}

export interface LocationSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearchInput({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = "Where are you going?",
  className,
}: LocationSearchInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const justSelectedRef = useRef(false);

  const runSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setOpen(true);
    const results = await searchPlaces(query);
    setSuggestions(results);
    setIsSearching(false);
    setSearchAttempted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (justSelectedRef.current) return;
    const v = e.target.value;
    onChange(v);
    setActiveIdx(-1);
    setSuggestions([]);
    setSearchAttempted(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.length < 2) {
      setOpen(false);
      setIsSearching(false);
      return;
    }

    debounceRef.current = setTimeout(() => void runSearch(v), 350);
  };

  const selectSuggestion = (s: Suggestion) => {
    justSelectedRef.current = true;
    onChange(s.mainText);
    setSuggestions([]);
    setOpen(false);
    setIsSearching(false);
    setSearchAttempted(false);
    setActiveIdx(-1);
    requestAnimationFrame(() => {
      justSelectedRef.current = false;
      onSelect?.(s.mainText);
    });
  };

  const clearInput = () => {
    onChange("");
    setSuggestions([]);
    setOpen(false);
    setIsSearching(false);
    setSearchAttempted(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hasContent = isSearching || suggestions.length > 0 || searchAttempted;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative flex items-center", className)}>
          <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => hasContent && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Search location"
            aria-autocomplete="list"
            aria-expanded={open}
            className="pl-9 pr-9 rounded-2xl border-border bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground hover:border-primary/30 focus-visible:border-primary/40 focus-visible:ring-primary/10"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3 size-4 text-muted-foreground animate-spin" />
          ) : value ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={clearInput}
              className="absolute right-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
              aria-label="Clear location"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 w-(--radix-popover-trigger-width) rounded-xl border-border shadow-xl overflow-hidden"
      >
        {isSearching ? (
          <div className="px-4 py-3 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="h-2.5 w-4/5 opacity-60" />
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <ul role="listbox">
            {suggestions.map((s, i) => (
              <li key={s.placeId} role="option" aria-selected={i === activeIdx}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectSuggestion(s);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-border/40 last:border-0",
                    i === activeIdx ? "bg-primary/10" : "hover:bg-muted/60",
                  )}
                >
                  <MapPin className="size-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.mainText}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {s.secondaryText}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : searchAttempted ? (
          <div className="px-4 py-5 text-center">
            <p className="text-sm font-medium text-foreground">
              No places found
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try a different city or address
            </p>
          </div>
        ) : null}

        {!isSearching && (suggestions.length > 0 || searchAttempted) && (
          <div className="px-4 py-1.5 bg-muted/50 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground">
              ©{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                OpenStreetMap
              </a>{" "}
              contributors
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
