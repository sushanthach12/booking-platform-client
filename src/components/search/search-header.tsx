"use client";

import { HeaderUserMenu } from "@/components/header/header-user-menu";
import AppLogo from "@/components/shared/app-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const SEARCH_PLACEHOLDER = "Where are you going?";

export interface SearchHeaderProps {
  locationQuery?: string;
  categoryQuery?: string;
  onLocationQueryChange?: (value: string) => void;
}

export function SearchHeader({
  locationQuery = "",
  categoryQuery = "",
  onLocationQueryChange,
}: SearchHeaderProps = {}) {
  const isControlled = onLocationQueryChange !== undefined;

  const NAV_LINKS = useMemo(
    () => [
      { href: "/search", label: "All stays", active: categoryQuery === "" },
      {
        href: "/search?category=hotels",
        label: "Hotels",
        active: categoryQuery === "hotels",
      },
      {
        href: "/search?category=apartments",
        label: "Apartments",
        active: categoryQuery === "apartments",
      },
    ],
    [categoryQuery],
  );

  return (
    <header
      className="sticky top-0 z-40 shrink-0 bg-white border-b border-border"
      data-header
    >
      <div className="h-16 flex items-center justify-between px-4 md:px-8 gap-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-8">
          <AppLogo />

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, active }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-warm-accent" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centre: compact search bar */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div
            className={cn(
              "w-full flex items-center gap-3 bg-background-muted border border-border rounded-2xl px-4 py-2.5 transition-all",
              "hover:border-primary/30 focus-within:bg-white focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10",
            )}
          >
            <Search className="size-4 text-muted-subtle shrink-0 pointer-events-none" />
            <div className="flex-1 min-w-0">
              {isControlled ? (
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => onLocationQueryChange(e.target.value)}
                  placeholder={SEARCH_PLACEHOLDER}
                  className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none truncate"
                  aria-label={SEARCH_PLACEHOLDER}
                />
              ) : (
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {SEARCH_PLACEHOLDER}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: user menu + mobile hamburger */}
        <div className="flex items-center gap-2">
          <HeaderUserMenu becomeHostButtonClassName="rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 hidden md:flex transition-colors" />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg lg:hidden text-muted-foreground hover:bg-muted"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
