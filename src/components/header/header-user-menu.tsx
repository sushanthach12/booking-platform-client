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
  /** When provided, use a button that calls this instead of linking to /become-host (e.g. for redirect-after-login) */
  onBecomeHost?: () => void;
  /** When provided, user/auth button calls this and AuthDialog is not rendered (parent controls auth) */
  onOpenAuth?: () => void;
  /** When provided (e.g. "Log in"), auth button shows only this label and no icon */
  authButtonLabel?: string;
}

/**
 * Reusable header user menu: "Become a Host" link/button and user/auth button.
 * Manages AuthDialog state internally when onOpenAuth is not provided.
 * Use in SimpleHeader, SearchHeader, or main Header with onBecomeHost/onOpenAuth for controlled auth.
 */
export function HeaderUserMenu({
  className,
  userButtonLabel,
  becomeHostButtonClassName,
  userButtonClassName,
  onBecomeHost,
  onOpenAuth,
  authButtonLabel,
}: HeaderUserMenuProps) {
  const [authOpen, setAuthOpen] = useState(false);

  const isIconOnly = !userButtonLabel && !authButtonLabel;
  const handleAuthClick = onOpenAuth ?? (() => setAuthOpen(true));

  return (
    <>
      <div className={className ?? "flex items-center gap-4"}>
        {onBecomeHost ? (
          <button
            type="button"
            onClick={onBecomeHost}
            className={
              becomeHostButtonClassName ??
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            }
          >
            Become a host
          </button>
        ) : (
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
        )}
        <button
          type="button"
          onClick={handleAuthClick}
          className={
            userButtonClassName ??
            "rounded-full border border-border flex items-center gap-2 px-3 py-2 hover:bg-accent"
          }
        >
          {authButtonLabel != null ? (
            <span>{authButtonLabel}</span>
          ) : (
            <>
              <User className={isIconOnly ? "size-6" : "size-4"} />
              {userButtonLabel != null && (
                <span className="hidden md:block text-sm">{userButtonLabel}</span>
              )}
            </>
          )}
        </button>
      </div>

      {onOpenAuth == null && (
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      )}
    </>
  );
}
