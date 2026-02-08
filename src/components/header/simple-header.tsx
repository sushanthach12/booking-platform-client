"use client";

import { Search, User, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";

/**
 * Simple header for property detail pages - just logo, search, and user menu
 * No navigation tabs or complex search bar
 */
export function SimpleHeader() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 shrink-0 bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-start gap-1.5 text-lg font-semibold text-foreground"
            aria-label="Home"
          >
            <span className="hidden sm:inline">Booking</span>
          </Link>

          {/* Search Bar */}
          {/* <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destination"
                className="w-full rounded-lg border border-border bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div> */}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:bg-transparent"
            >
              <Globe className="mr-2 size-4" />
              English
            </Button> */}
            <Link href="/become-host">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-sm font-medium hover:bg-transparent"
              >
                Become a Host
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-6" />
            </Button>
          </div>
        </div>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
