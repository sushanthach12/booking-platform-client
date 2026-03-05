"use client";

import { CustomDatePicker } from "@/components/shared/custom-date-picker";
import { GuestSelector } from "@/components/shared/guest-selector";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectSearchFilters,
  setDates,
  setGuests,
  setLocation,
} from "@/store/search-slice";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const filters = useAppSelector(selectSearchFilters);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    filters.checkIn || undefined,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    filters.checkOut || undefined,
  );

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckInDate(date);
    dispatch(
      setDates({ checkIn: date || null, checkOut: checkOutDate || null }),
    );
  };

  const handleCheckOutChange = (date: Date | undefined) => {
    setCheckOutDate(date);
    dispatch(
      setDates({ checkIn: checkInDate || null, checkOut: date || null }),
    );
  };

  const handleSearch = () => {
    // Build search query parameters
    const params = new URLSearchParams();

    if (filters.location && filters.location !== "Anywhere") {
      params.append("location", filters.location);
    }

    if (filters.checkIn) {
      params.append("checkIn", filters.checkIn.toISOString().split("T")[0]);
    }

    if (filters.checkOut) {
      params.append("checkOut", filters.checkOut.toISOString().split("T")[0]);
    }

    const totalGuests =
      filters.guests.adults + filters.guests.children + filters.guests.infants;
    if (totalGuests > 1) {
      params.append("guests", totalGuests.toString());
    }

    // Navigate to search page with parameters
    const queryString = params.toString();
    const searchUrl = queryString ? `/search?${queryString}` : "/search";
    router.push(searchUrl);
  };

  return (
    <div className="relative p-6 py-32 mx-4 lg:mx-20 flex items-center justify-center rounded-3xl overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 max-w-4xl mx-auto drop-shadow-2xl">
          Effortless bookings for leisure travel or business
        </h1>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-border p-4 flex flex-col md:flex-row items-center gap-4">
            {/* Location */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0 md:flex-2">
              {/* <Search className="size-5 text-muted-foreground mr-3 shrink-0" /> */}
              <div className="w-full">
                <div className="text-xs md:text-sm text-muted-foreground mb-1 text-start">
                  Where
                </div>
                <input
                  type="text"
                  value={filters.location || ""}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                  className="w-full bg-transparent text-sm md:text-base font-medium text-foreground hover:bg-transparent justify-start border-none outline-none"
                  placeholder="Milan, Italy"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-border mx-2" />

            {/* Check-in */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0">
              {/* <Calendar className="size-5 text-muted-foreground mr-3 shrink-0" /> */}
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 text-start">
                  Check in
                </div>
                <CustomDatePicker
                  value={checkInDate}
                  onChange={handleCheckInChange}
                  placeholder="Select"
                  className="text-sm md:text-base"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-border mx-2" />

            {/* Check-out */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0">
              {/* <Calendar className="size-5 text-muted-foreground mr-3 shrink-0" /> */}
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 text-start">
                  Check out
                </div>
                <CustomDatePicker
                  value={checkOutDate}
                  onChange={handleCheckOutChange}
                  placeholder="Select"
                  className="text-sm md:text-base"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-border mx-2" />

            {/* Guests */}
            <div className="flex items-center px-4 py-3 flex-1 min-w-0">
              {/* <Users className="size-5 text-muted-foreground mr-3 shrink-0" /> */}
              <div>
                <div className="text-xs md:text-sm text-muted-foreground mb-1 text-start">
                  Guests
                </div>
                <GuestSelector
                  value={filters.guests}
                  onChange={setGuests}
                  maxGuests={16}
                  className="border-0 shadow-none p-0 h-auto text-sm md:text-base font-medium text-foreground hover:bg-transparent justify-start w-full"
                  showUserIcon={false}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-center gap-2 ml-4 min-w-0">
              <Button
                variant="default"
                size="icon-lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-14 h-14"
                onClick={handleSearch}
              >
                <Search className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
