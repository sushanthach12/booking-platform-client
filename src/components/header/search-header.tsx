"use client";

import { Globe, User, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

/**
 * Search page header - simplified navigation without full navbar
 * Based on reference screenshot with logo, minimal navigation, and user avatars
 */
export function SearchHeader() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shrink-0 bg-white border-b border-gray-200" data-header>
      <div className="h-16 flex items-center justify-between px-4 md:px-8">
        {/* Logo and Brand */}
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

          {/* Navigation Options - simplified based on reference */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/search" className="text-sm font-medium text-gray-900 hover:text-gray-600">
              Stays
            </Link>
            <Link href="/experiences" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Experiences
            </Link>
            <Link href="/online-experiences" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Online Experiences
            </Link>
          </nav>
        </div>

        {/* Right side - User avatars and actions */}
        <div className="flex items-center gap-4">
          {/* Host button */}
          <Link href="/become-host">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-sm font-medium hover:bg-transparent hidden md:block"
            >
              Become a Host
            </Button>
          </Link>

          {/* Globe/Language */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-sm font-medium hover:bg-transparent hidden lg:flex items-center gap-2"
          >
            <Globe className="size-4" />
            <span>EN</span>
          </Button>

          {/* User Avatars - as mentioned in requirements */}
          <div className="flex items-center gap-2">
            {/* First User Avatar */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-300 hover:border-gray-400 flex items-center gap-2 px-3 py-2"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-4" />
              <span className="hidden md:block text-sm">User 1</span>
            </Button>

            {/* Second User Avatar */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-gray-300 hover:border-gray-400 flex items-center gap-2 px-3 py-2"
              onClick={() => setAuthOpen(true)}
            >
              <User className="size-4" />
              <span className="hidden md:block text-sm">User 2</span>
            </Button>
          </div>

          {/* Mobile Menu */}
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
