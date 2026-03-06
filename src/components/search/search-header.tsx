"use client";

import { HeaderUserMenu } from "@/components/header/header-user-menu";
import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Search page header - simplified navigation without full navbar.
 * Receives data from the parent (e.g. SearchTemplate passes locationLabel).
 */
export function SearchHeader() {
  return (
    <header
      className="sticky top-0 z-40 shrink-0 bg-background border-b border-border"
      data-header
    >
      <div className="h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground"
            aria-label="Home"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="hidden sm:inline">booking</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/search"
              className="text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Stays
            </Link>
            <Link
              href="/experiences"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Experiences
            </Link>
            <Link
              href="/online-experiences"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Online Experiences
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <HeaderUserMenu
            becomeHostButtonClassName="rounded-full text-sm font-medium hover:bg-transparent hidden md:block"
            userButtonLabel="User 1"
            userButtonClassName="rounded-md border-border hover:border-input flex items-center gap-2 px-3 py-2"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
