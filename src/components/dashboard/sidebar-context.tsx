"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SidebarContextValue {
  /** Whether the desktop sidebar is collapsed (hidden). */
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function DashboardSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Reads the dashboard sidebar collapse state. Returns a no-op fallback when
 * used outside the provider so components (e.g. the breadcrumb on non-dashboard
 * pages) don't crash.
 */
export function useDashboardSidebar(): SidebarContextValue {
  return (
    useContext(SidebarContext) ?? {
      collapsed: false,
      toggle: () => {},
      setCollapsed: () => {},
    }
  );
}
