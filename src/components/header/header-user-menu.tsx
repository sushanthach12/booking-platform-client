"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuthUseCase } from "@/domain/di";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, ChevronDown, Home, LogOut, User as UserIcon } from "lucide-react";
import UserAvatar from "../shared/user-avatar";

export interface HeaderUserMenuProps {
  className?: string;
  becomeHostButtonClassName?: string;
  authButtonClassName?: string;
  onBecomeHost?: () => void;
  onOpenAuth?: () => void;
}

export function HeaderUserMenu({
  className,
  becomeHostButtonClassName,
  authButtonClassName,
  onBecomeHost,
  onOpenAuth,
}: HeaderUserMenuProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Defer auth-dependent UI until after hydration — prevents SSR/client mismatch
  useEffect(() => { setMounted(true); }, []);

  const handleAuthClick = onOpenAuth ?? (() => setAuthOpen(true));

  const handleLogout = async () => {
    const authUseCase = getAuthUseCase();
    await authUseCase.logout();
    router.push("/");
    router.refresh();
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Account";

  const isHost = user?.isHost ?? false;

  // Render a neutral placeholder on the server (and first paint) so both
  // SSR and client produce identical HTML — no hydration mismatch.
  if (!mounted) {
    return (
      <div className={className ?? "flex items-center gap-1"}>
        <div className="h-9 w-24 rounded-lg bg-transparent" />
        <div className="h-9 w-20 rounded-lg bg-primary/10 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className={className ?? "flex items-center gap-1"}>

        {/* ── Become a host — hidden for existing hosts ── */}
        {!isHost && (
          onBecomeHost ? (
            <button
              type="button"
              onClick={onBecomeHost}
              className={
                becomeHostButtonClassName ??
                "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
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
                  "text-sm font-medium text-muted-foreground hover:text-foreground"
                }
              >
                Become a host
              </Button>
            </Link>
          )
        )}

        {/* ── Auth area ── */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary-subtle transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Open user menu"
              >
                <UserAvatar
                  image={user.avatar ?? ""}
                  name={displayName}
                  size="sm"
                />
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-60 p-1.5 rounded-xl border border-border shadow-[0_8px_30px_rgba(61,111,142,0.12)]"
            >
              {/* User identity block */}
              <div className="flex items-center gap-3 px-3 py-3 mb-1">
                <UserAvatar
                  image={user.avatar ?? ""}
                  name={displayName}
                  size="default"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator className="mx-1 bg-border" />

              <DropdownMenuItem asChild className="rounded-lg mt-1 cursor-pointer gap-3 px-3 py-2.5 text-sm text-foreground focus:bg-primary-subtle focus:text-primary">
                <Link href="/account">
                  <UserIcon className="size-4 shrink-0" />
                  My account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer gap-3 px-3 py-2.5 text-sm text-foreground focus:bg-primary-subtle focus:text-primary">
                <Link href="/dashboard/bookings">
                  <BookOpen className="size-4 shrink-0" />
                  My bookings
                </Link>
              </DropdownMenuItem>

              {isHost && (
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer gap-3 px-3 py-2.5 text-sm text-foreground focus:bg-primary-subtle focus:text-primary">
                  <Link href="/dashboard/host/overview">
                    <Home className="size-4 shrink-0" />
                    Host dashboard
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="mx-1 my-1 bg-border" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-lg cursor-pointer gap-3 px-3 py-2.5 text-sm text-destructive focus:bg-red-50 focus:text-destructive"
              >
                <LogOut className="size-4 shrink-0" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleAuthClick}
            className={
              authButtonClassName ??
              "rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold"
            }
          >
            Log in
          </Button>
        )}
      </div>

      {onOpenAuth == null && (
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      )}
    </>
  );
}
