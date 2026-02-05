'use client';

import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

/**
 * Header has two distinct parts (design reference):
 * Part 1: Top navigation bar — Logo, Stays | Experiences | Online Experiences, User avatar, Menu.
 * Part 2: Search and filter bar — Anywhere | June 14 - 21 | 4 guests (rounded inputs), Filter button.
 */
export function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 px-6 lg:px-10 pt-6 pb-6 bg-gray-100" data-header>
      {/* Single navigation bar with integrated search */}
      <div className="h-14" data-header-part="1">
        <div className="h-full flex justify-between align-middle px-6 lg:px-10 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground"
            aria-label="Home"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="hidden sm:inline text-2xl">booking</span>
          </Link>

          <div className="flex-1 flex justify-center max-w-2xl">
            {/* Empty space or could add logo/branding here */}
          </div>

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

            <div className="flex items-center h-full">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border"
                onClick={() => setAuthOpen(true)}
              >
                <User className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

