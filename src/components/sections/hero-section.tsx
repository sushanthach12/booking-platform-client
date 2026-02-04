"use client";

import { FilterDialog } from "@/components/filter/filter-dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { selectSearchFilters, setDates, setGuests, setLocation } from "@/store/search-slice";
import { Calendar, Filter, Search, Users } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="relative bg-linear-to-br from-primary/5 to-primary/10 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Find your perfect place to stay
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing properties around the world. From cozy apartments to luxury villas, find the perfect home for your next trip.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-sm font-medium text-muted-foreground hover:bg-transparent justify-start"
                  onClick={() => dispatch(setDates({ checkIn: new Date(), checkOut: null }))}
                >
                  {filters.checkIn ? filters.checkIn.toLocaleDateString() : "Add date"}
                </Button>
              </div>
            </div>

            <div className="h-8 w-px bg-border mx-2" />

            {/* Check-out */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0">
              <Calendar className="size-5 text-muted-foreground mr-3 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Check out</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-sm font-medium text-muted-foreground hover:bg-transparent justify-start"
                  onClick={() => dispatch(setDates({ checkIn: filters.checkIn, checkOut: new Date() }))}
                >
                  {filters.checkOut ? filters.checkOut.toLocaleDateString() : "Add date"}
                </Button>
              </div>
            </div>

            <div className="h-8 w-px bg-border mx-2" />

            {/* Guests */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0">
              <Users className="size-5 text-muted-foreground mr-3 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Guests</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-sm font-medium text-muted-foreground hover:bg-transparent justify-start"
                  onClick={() => dispatch(setGuests(filters.guests + 1))}
                >
                  {filters.guests} {filters.guests === 1 ? "guest" : "guests"}
                </Button>
              </div>
            </div>

            {/* Search and Filter Buttons */}
            <div className="flex items-center gap-2 ml-1 min-w-0">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4M+</div>
            <div className="text-sm text-muted-foreground">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">220+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1B+</div>
            <div className="text-sm text-muted-foreground">Guests</div>
          </div>
        </div>
      </div>

      <FilterDialog open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
