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
import { MapPin, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TRENDING_DESTINATIONS = [
  "Santorini",
  "Bali",
  "Amalfi",
  "Kyoto",
  "Maldives",
];

const STATS = [
  { value: "2M+", label: "Happy travelers" },
  { value: "150K+", label: "Properties worldwide" },
  { value: "4.9★", label: "Average rating" },
];

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
    const params = new URLSearchParams();
    if (filters.location && filters.location !== "Anywhere")
      params.append("location", filters.location);
    if (filters.checkIn)
      params.append("checkIn", filters.checkIn.toISOString().split("T")[0]);
    if (filters.checkOut)
      params.append("checkOut", filters.checkOut.toISOString().split("T")[0]);
    const totalGuests =
      filters.guests.adults + filters.guests.children + filters.guests.infants;
    if (totalGuests > 1) params.append("guests", totalGuests.toString());
    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  };

  const handleTrendingClick = (dest: string) => {
    dispatch(setLocation(dest));
    router.push(`/search?location=${encodeURIComponent(dest)}`);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden -mt-16 pt-16">
      {/* ── Layered background ── */}
      <div className="absolute inset-0">
        {/* Main photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=90")',
          }}
        />
        {/* Gradient vignette — darker at bottom for card legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        {/* Subtle noise grain for depth */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-10 pt-20 pb-16">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium">
          <TrendingUp className="size-3.5 text-emerald-300" />
          Over 2 million stays booked this year
        </div>

        {/* Headline */}
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-xl">
            Find your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                perfect
              </span>
            </span>
            <br />
            place to stay
          </h1>
          <p className="text-lg sm:text-xl text-white/75 font-normal max-w-xl mx-auto">
            Curated homes, villas & boutique hotels for every kind of traveller
            — from weekend escapes to extended retreats.
          </p>
        </div>

        {/* ── Floating search card ── */}
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30 border border-white/60 p-2">
          <div className="flex flex-col md:flex-row items-stretch gap-1">
            {/* Location */}
            <div className="flex-[2] min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-text">
              <MapPin className="size-4 text-rose-400 shrink-0 group-hover:text-rose-500 transition-colors" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                  Where
                </div>
                <input
                  type="text"
                  value={filters.location || ""}
                  onChange={(e) => dispatch(setLocation(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 border-none outline-none"
                  placeholder="Milan, Italy"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="hidden md:block w-px self-stretch bg-slate-200 my-2" />

            {/* Check-in */}
            <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                  Check in
                </div>
                <CustomDatePicker
                  value={checkInDate}
                  onChange={handleCheckInChange}
                  placeholder="Add date"
                  className="text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="hidden md:block w-px self-stretch bg-slate-200 my-2" />

            {/* Check-out */}
            <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                  Check out
                </div>
                <CustomDatePicker
                  value={checkOutDate}
                  onChange={handleCheckOutChange}
                  placeholder="Add date"
                  className="text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="hidden md:block w-px self-stretch bg-slate-200 my-2" />

            {/* Guests */}
            <div className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                  Guests
                </div>
                <GuestSelector
                  value={filters.guests}
                  onChange={(guests) => dispatch(setGuests(guests))}
                  maxGuests={16}
                  className="border-0 shadow-none p-0 h-auto text-sm font-semibold text-slate-800 hover:bg-transparent justify-start w-full"
                  showUserIcon={false}
                />
              </div>
            </div>

            {/* Search button */}
            <div className="flex items-center px-2">
              <Button
                onClick={handleSearch}
                className="rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold px-6 h-12 gap-2 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="size-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Trending destinations */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider mr-1">
            Trending:
          </span>
          {TRENDING_DESTINATIONS.map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => handleTrendingClick(dest)}
              className="text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 transition-all duration-150 hover:scale-105"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar pinned to bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-white/10 backdrop-blur-md border-t border-white/15">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center gap-10 md:gap-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
