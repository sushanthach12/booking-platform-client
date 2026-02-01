"use client";

import { Calendar, ChevronDown, Filter, LayoutGrid, Map, Minus, Plus, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { FilterDrawer } from "@/components/filter/filter-drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

/**
 * Header has two distinct parts (design reference):
 * Part 1: Top navigation bar — Logo, Stays | Experiences | Online Experiences, User avatar, Menu.
 * Part 2: Search and filter bar — Anywhere | June 14 - 21 | 4 guests (rounded inputs), Filter button.
 */
export function Header() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState("stays")
  const [viewMode, setViewMode] = useState("grid")

  const handleSelect = (value: string) => {
    setSelected(value)
  }

  const handleViewChange = useCallback((value: string) => {
    setViewMode(value)
  }, [])

  return (
    <header className="sticky top-0 z-40 shrink-0 pt-6 pb-0 border-b border-border bg-background" data-header>
      {/* Part 1: Top navigation bar */}
      <div className="h-14" data-header-part="1">
        <div className="h-full flex justify-between align-middle px-4 md:px-10 gap-4 border-b border-gray-100">
          <Link
            href="/"
            className="flex shrink-0 items-start gap-1.5 text-lg font-semibold text-foreground"
            style={{ textDecorationColor: "var(--nav-underline)" }}
            aria-label="Home"
          >
            <span className="hidden sm:inline">Booking</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            <span
              className={cn(
                "h-full flex items-start py-2 rounded-none text-sm font-medium text-foreground hover:cursor-pointer",
                selected === "stays" && "border-b-2 border-indigo-500 font-bold"
              )}
              style={{ textDecorationColor: "var(--nav-underline)" }}
              onClick={() => handleSelect("stays")}
            >
              Stays
            </span>
            <span
              className={cn(
                "h-full flex items-start py-2 rounded-none text-sm font-medium text-foreground hover:cursor-pointer",
                selected === "experiences" && "border-b-2 border-indigo-500 font-bold"
              )}
              onClick={() => handleSelect("experiences")}
            >
              Experiences
            </span>
            <span
              className={cn(
                "h-full flex items-start py-2 rounded-none text-sm font-medium text-foreground hover:cursor-pointer",
                selected === "online-experiences" && "border-b-2 border-indigo-500 font-bold"
              )}
              onClick={() => handleSelect("online-experiences")}
            >
              Online Experiences
            </span>
          </nav>

          <div className="flex items-start h-full">
            <User className="size-6 text-foreground hover:text-foreground/80" />
          </div>
        </div>
      </div>


      {/* Part 2: Search and filter bar — grid/map toggles left, search inputs middle, filter right */}
      <div className="px-4 md:px-10 py-2.5" data-header-part="2">
        <div className="flex justify-between items-center gap-0.5 rounded-lg p-0.5">
          <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted">
            <Button
              variant="ghost"
              size="icon-lg"
              className={cn("size-12 text-black hover:bg-muted hover:cursor-pointer", viewMode === "grid" && "bg-black text-white hover:bg-black hover:text-white")}
              aria-label="Grid view"
              aria-pressed="true"
              onClick={() => handleViewChange("grid")}
            >
              <LayoutGrid className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-12 text-black hover:bg-muted hover:cursor-pointer", viewMode === "map" && "bg-black text-white hover:bg-black hover:text-white")}
              aria-label="Map view"
              aria-pressed="true"
              onClick={() => handleViewChange("map")}
            >
              <Map className="size-5 " />
            </Button>
          </div>

          <div>
            <SearchAndFilterBar />
          </div>

          <div>
            <Button
              variant="default"
              size="icon"
              className="size-12 bg-muted text-black hover:bg-muted hover:text-black hover:cursor-pointer"
              aria-label="Filters"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <HeaderFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
    </header>
  );
}

function SearchAndFilterBar() {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="flex items-center gap-24 rounded-lg bg-muted p-2 pr-4">
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Anywhere
        </Button>
        <ChevronDown className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex items-center gap-0 rounded-lg bg-muted p-2 pl-4">
        <Calendar className="size-5 text-muted-foreground" />
        <Button
          variant="ghost"
          size="sm"
          className="px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <span className="text-sm font-medium text-muted-foreground">Select date</span>
        </Button>
      </div>
      <div className="flex items-center gap-4 rounded-lg bg-muted p-2">
        <Button
          variant="default"
          size="sm"
          className="px-3 py-1.5 text-md text-rose-400 bg-white hover:bg-white hover:cursor-pointer"
        >
          <Minus className="size-4" />
        </Button>
        <span className="min-w-[4ch] py-1.5 text-center text-sm font-medium text-foreground">
          4 guests
        </span>
        <Button
          variant="default"
          size="sm"
          className="px-3 py-1.5 text-lg text-rose-400 bg-white hover:bg-white hover:cursor-pointer"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function HeaderFilterDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <FilterDrawer
      open={open}
      onClose={onClose}
      resultCount={836}
    />
  );
}
