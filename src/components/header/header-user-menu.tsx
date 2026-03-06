"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

export interface HeaderUserMenuProps {
  /** Optional class name for the menu container */
  className?: string;
  /** If provided, show label next to user icon (e.g. "User 1") */
  userButtonLabel?: string;
  /** Optional class name for the "Become a Host" button */
  becomeHostButtonClassName?: string;
  /** Optional class name for the user/auth button */
  userButtonClassName?: string;
}

/**
 * Reusable header user menu: "Become a Host" link and user/auth button.
 * Manages AuthDialog state internally. Use in SimpleHeader, SearchHeader, etc.
 */
export function HeaderUserMenu({
  className,
  userButtonLabel,
  becomeHostButtonClassName,
  userButtonClassName,
}: HeaderUserMenuProps) {
  const [authOpen, setAuthOpen] = useState(false);

  const isIconOnly = !userButtonLabel;

  return (
    <>
      <div className={className ?? "flex items-center gap-4"}>
        <Link href="/become-host">
          <Button
            variant="ghost"
            size="sm"
            className={
              becomeHostButtonClassName ??
              "rounded-full text-sm font-medium hover:bg-transparent"
            }
          >
            Become a Host
          </Button>
        </Link>
        <Button
          variant="outline"
          size={isIconOnly ? "icon" : "sm"}
          className={
            userButtonClassName ??
            "rounded-full border-border flex items-center gap-2"
          }
          onClick={() => setAuthOpen(true)}
        >
          <User className={isIconOnly ? "size-6" : "size-4"} />
          {userButtonLabel != null && (
            <span className="hidden md:block text-sm">{userButtonLabel}</span>
          )}
        </Button>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
