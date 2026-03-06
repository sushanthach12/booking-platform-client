"use client";

import { Globe, Menu, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";


/**
 * Search page header - simplified navigation without full navbar.
 * Receives data from the parent (e.g. SearchTemplate passes locationLabel).
 */
export function SearchHeader() {
  const [authOpen, setAuthOpen] = useState(false);

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
          <Link href="/become-host">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-sm font-medium hover:bg-transparent hidden md:block"
            >
              Become a Host
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-sm font-medium hover:bg-transparent hidden lg:flex items-center gap-2"
          >
            <Globe className="size-4" />
            <span>EN</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border hover:border-input flex items-center gap-2 px-3 py-2"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-4" />
              <span className="hidden md:block text-sm">User 1</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border hover:border-input flex items-center gap-2 px-3 py-2"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-4" />
              <span className="hidden md:block text-sm">User 2</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
