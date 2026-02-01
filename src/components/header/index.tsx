"use client";

import { ChevronDown, Filter, Grid3X3, Map, Menu, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FilterDrawer } from "@/components/filter/filter-drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";

/**
 * Header has two distinct parts (design reference):
 * Part 1: Top navigation bar — Logo, Stays | Experiences | Online Experiences, User avatar, Menu.
 * Part 2: Search and filter bar — Anywhere | June 14 - 21 | 4 guests (rounded inputs), Filter button.
 */
export function Header() {
  const [filterOpen, setFilterOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-background" data-header>
      {/* Part 1: Top navigation bar */}
      <div className="flex h-14 items-center gap-4 px-4" data-header-part="1">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-lg font-semibold text-foreground underline decoration-2 underline-offset-4"
          style={{ textDecorationColor: "var(--nav-underline)" }}
          aria-label="Home"
        >
          <span className="hidden sm:inline">Booking</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-foreground underline decoration-2 underline-offset-4"
            )}
            style={{ textDecorationColor: "var(--nav-underline)" }}
          >
            Stays
          </Link>
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Experiences
          </Link>
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Online Experiences
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <UserAvatar />
          <Button variant="outline" size="icon" className="rounded-full" aria-label="Menu">
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Part 2: Search and filter bar — grid/map toggles left, search inputs middle, filter right */}
      <div className="flex items-center gap-3 rounded-none border-border bg-muted/30 px-4 py-2.5 md:rounded-lg md:mx-4 md:mb-2 md:shadow-sm" data-header-part="2">
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border bg-background p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-md bg-muted text-foreground hover:bg-muted hover:text-foreground"
            aria-label="Grid view"
            aria-pressed="true"
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Map view"
            aria-pressed="false"
          >
            <Map className="size-4" />
          </Button>
        </div>
        <SearchAndFilterBar />
        <FilterButton onClick={() => setFilterOpen(true)} />
      </div>

      <HeaderFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
    </header>
  );
}

function SearchAndFilterBar() {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 py-2 pl-4 pr-2 shadow-sm">
        <button
          type="button"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Anywhere
        </button>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 py-2 pl-4 pr-2 shadow-sm">
        <button
          type="button"
          className="rounded-full px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          June 14 – 21
        </button>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 py-2 pl-3 pr-2 shadow-sm">
        <button
          type="button"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Decrease guests"
        >
          −
        </button>
        <span className="min-w-[4ch] py-1.5 text-center text-sm font-medium text-foreground">
          4 guests
        </span>
        <button
          type="button"
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Increase guests"
        >
          +
        </button>
      </div>
    </div>
  );
}

function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label="Filters"
      onClick={onClick}
    >
      <Filter className="size-4" />
    </Button>
  );
}

function UserAvatar() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9 rounded-full border-2 p-0"
      aria-label="Account menu"
    >
      <User className="size-5" />
    </Button>
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
