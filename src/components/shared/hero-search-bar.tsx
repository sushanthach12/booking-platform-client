"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { GuestSelector } from "@/components/shared/guest-selector";
import { LocationSearchInput } from "@/components/search/location-search-input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectSearchFilters,
  setDates,
  setGuests,
  setLocation,
  setLocationWithCoords,
} from "@/store/slices/search-slice";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";

export function HeroSearchBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const filters = useAppSelector(selectSearchFilters);

  const dateRange: DateRange | undefined = filters.checkIn
    ? { from: filters.checkIn, to: filters.checkOut ?? undefined }
    : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    dispatch(
      setDates({ checkIn: range?.from ?? null, checkOut: range?.to ?? null }),
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.location && filters.location !== "Anywhere")
      params.set("location", filters.location);
    if (filters.latitude != null && filters.longitude != null) {
      params.set("lat", filters.latitude.toString());
      params.set("lng", filters.longitude.toString());
    }
    if (filters.checkIn)
      params.set("checkIn", filters.checkIn.toISOString().split("T")[0]);
    if (filters.checkOut)
      params.set("checkOut", filters.checkOut.toISOString().split("T")[0]);
    const total =
      filters.guests.adults + filters.guests.children + filters.guests.infants;
    if (total > 1) params.set("guests", total.toString());
    router.push(params.size ? `/search?${params}` : "/search");
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-[0_8px_32px_rgba(61,111,142,0.13)] overflow-hidden">
      {/* Mobile: stacked rows / Desktop: single row */}
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* Where */}
        <div className="flex-[1.4] min-w-0 px-5 py-4 border-b border-border/60 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-primary mb-1.5 flex items-center gap-1.5">
            <MapPin className="size-3" />
            Where
          </p>
          <LocationSearchInput
            value={filters.location ?? ""}
            onChange={(value) => dispatch(setLocation(value))}
            onSelect={(value, coords) =>
              coords
                ? dispatch(
                    setLocationWithCoords({
                      location: value,
                      latitude: coords.lat,
                      longitude: coords.lng,
                    }),
                  )
                : dispatch(setLocation(value))
            }
            onClear={() => dispatch(setLocation(""))}
            placeholder="City or suburb…"
            showSearchIcon={false}
            inputClassName="h-auto py-0 pl-0 pr-7 border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-semibold text-foreground placeholder:text-muted-foreground/50 bg-transparent"
            popoverClassName="w-80 max-w-[90vw]"
            popoverSideOffset={24}
          />
        </div>

        {/* When — single date-range cell */}
        <div className="flex-1 min-w-0 px-5 py-4 border-b border-border/60 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-primary mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="size-3" />
            When
          </p>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            variant="inline"
            placeholder="Add dates"
            popoverSideOffset={24}
          />
        </div>

        {/* Guests + Search button — side by side on mobile */}
        <div className="flex lg:contents">
          <div className="flex-1 min-w-0 px-5 py-4 border-r border-border/60 lg:border-r">
            <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-primary mb-1.5">
              Guests
            </p>
            <GuestSelector
              value={filters.guests}
              onChange={(g) => dispatch(setGuests(g))}
              maxGuests={16}
              className="border-0 shadow-none p-0 h-auto text-base font-semibold text-foreground hover:bg-transparent justify-start w-full"
              showUserIcon={false}
            />
          </div>
          <div className="p-2 flex items-stretch">
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 gap-2 rounded-xl transition-colors duration-150 h-full text-base w-full lg:w-auto"
            >
              <Search className="size-5 shrink-0" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
