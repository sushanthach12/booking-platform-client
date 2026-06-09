"use client";

import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import {
  DashboardSidebarProvider,
  useDashboardSidebar,
} from "@/components/dashboard/sidebar-context";
import type { User } from "@/domain/entities";
import { cn } from "@/lib/utils";

function ShellInner({
  isHost,
  user,
  children,
}: {
  isHost: boolean;
  user: User | null;
  children: React.ReactNode;
}) {
  const { collapsed } = useDashboardSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — collapsible */}
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out lg:flex lg:flex-col",
          collapsed ? "lg:w-0" : "lg:w-64",
        )}
      >
        <DashboardSidebar isHost={isHost} user={user} />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <DashboardMobileNav isHost={isHost} user={user} />
          <span className="text-base font-bold text-foreground">Stayly</span>
        </header>

        <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

/**
 * Client shell for the dashboard: owns the sidebar collapse state (toggled from
 * the breadcrumb icon) and renders the collapsible sidebar + main content area.
 * The route layout stays a server component and just passes `isHost` + children.
 */
export function DashboardShell({
  isHost,
  user,
  children,
}: {
  isHost: boolean;
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebarProvider>
      <ShellInner isHost={isHost} user={user}>
        {children}
      </ShellInner>
    </DashboardSidebarProvider>
  );
}
