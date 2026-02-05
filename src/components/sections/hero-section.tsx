"use client";

import { FilterDialog } from "@/components/filter/filter-dialog";
import { CustomDatePicker } from "@/components/shared/custom-date-picker";
import { GuestSelector } from "@/components/shared/guest-selector";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectSearchFilters, setDates, setGuests, setLocation } from "@/store/search-slice";
import { Calendar, Filter, Search, Users } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(filters.checkIn || undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(filters.checkOut || undefined);

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date);
    dispatch(setDates({ checkIn: date || null, checkOut: checkOutDate || null }));
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    setCheckOutDate(date);
    dispatch(setDates({ checkIn: checkInDate || null, checkOut: date || null }));
  };

  return (
    <div className="relative bg-gray-100 py-16 w-full">
      {/* Hero Content */}
      <div className="text-center mb-12 px-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Find your perfect place to stay
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing properties around the world. From cozy apartments to luxury villas, find the perfect home for your next trip.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-2  px-4 flex items-center">
          {/* Location */}
          <div className="flex items-center px-4 py-3 flex-1 min-w-0">
            <Search className="size-5 text-muted-foreground mr-3 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Where</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-sm font-medium text-foreground hover:bg-transparent justify-start"
                onClick={() => dispatch(setLocation(filters.location || "Anywhere"))}
              >
                {filters.location || "Anywhere"}
              </Button>
            </div>
          </div>

          <div className="h-8 w-px bg-border mx-2" />

          {/* Check-in */}
          <div className="flex items-center px-4 py-3 flex-1 min-w-0">
            <Calendar className="size-5 text-muted-foreground mr-3 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Check in</div>
              <CustomDatePicker
                value={checkInDate}
                onChange={handleCheckInChange}
                placeholder="Select"
              />
            </div>
          </div>

          <div className="h-8 w-px bg-border mx-2" />

          {/* Check-out */}
          <div className="flex items-center px-4 py-3 flex-1 min-w-0">
            <Calendar className="size-5 text-muted-foreground mr-3 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Check out</div>
              <CustomDatePicker
                value={checkOutDate}
                onChange={handleCheckOutChange}
                placeholder="Select"
              />
            </div>
          </div>

          <div className="h-8 w-px bg-border mx-2" />

          {/* Guests */}
          <div className="flex items-center px-4 py-3 flex-1 min-w-0">
            <Users className="size-5 text-muted-foreground mr-3 shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Guests</div>
              <GuestSelector
                value={filters.guests}
                onChange={setGuests}
                maxGuests={16}
                className="border-0 shadow-none p-0 h-auto text-sm font-medium text-foreground hover:bg-transparent justify-start w-full"
                showUserIcon={false}
              />
            </div>
          </div>

          {/* Search and Filter Buttons */}
          <div className="flex items-center gap-2 ml-4 min-w-0">
            <Button
              variant="ghost"
              size="icon-lg"
              className="px-6 py-3 rounded-lg border-border hover:bg-muted"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="size-5" />
            </Button>
            <Button
              variant="default"
              size="lg"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Search
              <Search className="size-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <FilterDialog open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
