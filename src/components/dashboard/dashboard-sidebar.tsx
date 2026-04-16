"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/domain/hooks/dashboard/use-dashboard";
import { useDashboard } from "@/domain/hooks/dashboard/use-dashboard";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  CreditCard,
  Heart,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, React.ElementType> = {
  profile: User,
  bookings: BookOpen,
  wishlist: Heart,
  overview: LayoutDashboard,
  listings: List,
  calendar: Calendar,
  reservations: Home,
  payouts: CreditCard,
  reviews: Star,
  settings: Settings,
};

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = ICON_MAP[item.id] ?? ChevronRight;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-rose-50 text-rose-600 font-semibold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export function DashboardSidebar({ isHost }: { isHost: boolean }) {
  const { user, guestNav, hostNav, activeRoute } = useDashboard();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl = user?.avatar;

  return (
    <aside className="flex flex-col h-full w-64 bg-white border-r border-slate-100 py-6 px-4">
      {/* Logo / brand */}
      <div className="mb-6 px-2">
        <Link href="/" className="text-xl font-bold text-slate-900 tracking-tight">
          Stayly
        </Link>
      </div>

      {/* Guest nav section */}
      <div className="mb-4">
        <p className="px-3 mb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Guest
        </p>
        <nav className="flex flex-col gap-0.5">
          {guestNav.map((item) => (
            <NavLink key={item.id} item={item} active={activeRoute === item.id} />
          ))}
        </nav>
      </div>

      {/* Host nav section */}
      {isHost && (
        <div className="mb-4">
          <p className="px-3 mb-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Host
          </p>
          <nav className="flex flex-col gap-0.5">
            {hostNav.map((item) => (
              <NavLink key={item.id} item={item} active={activeRoute === item.id} />
            ))}
          </nav>
        </div>
      )}

      {/* Become a host CTA for non-hosts */}
      {!isHost && (
        <div className="mb-4 px-2">
          <Button asChild variant="outline" size="sm" className="w-full rounded-xl border-slate-200 text-slate-600">
            <Link href="/become-host">Become a Host</Link>
          </Button>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* User info at bottom */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-rose-100 text-rose-600 text-sm font-bold">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{displayName || "Guest"}</p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
