"use client";

import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { CategoryRail } from "@/components/sidebar/category-rail";
import { cn } from "@/lib/utils/utils";

/**
 * Layout structure (design reference):
 * <Root>
 *   <Header>
 *     <Part1 />  (Logo, nav, user/menu)
 *     <Part2 />  (Search/filter bar)
 *   </Header>
 *   <Main>
 *     <Category /> (sidebar)
 *     <Listing /> (content)
 *   </Main>
 * </Root>
 */
interface AppLayoutProps {
  children: ReactNode;
  variant?: "home" | "search";
  className?: string;
}

export function AppLayout({
  children,
  variant = "home",
  className,
}: AppLayoutProps) {
  return (
    <div
      className={cn("flex min-h-screen flex-col bg-background", className)}
      data-root
    >
      <Header />

      <main
        className="flex min-h-0 max-h-[calc(100vh-var(--header-height))] flex-1 flex-col overflow-hidden md:flex-row"
        data-main
      >
        {variant === "home" ? (
          <>
            <aside
              className="hidden shrink-0 md:block"
              data-category
              aria-label="Categories"
            >
              <CategoryRail />
            </aside>
            <div
              className="flex-1 overflow-auto"
              data-listing
              onWheel={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto">{children}</div>
        )}
      </main>
    </div>
  );
}
