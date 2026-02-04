"use client";

import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { SimpleHeader } from "@/components/header/simple-header";
import { CategoryRail } from "@/components/sidebar/category-rail";
import { cn } from "@/lib/utils";

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
  variant?: "home" | "search" | "detail";
  className?: string;
}

export function AppLayout({
  children,
  variant = "home",
  className,
}: AppLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background px-6",
        variant === "detail" && "layout-detail",
        className
      )}
      data-root
    >
      {/* Header */}
      {variant === "detail" ? <SimpleHeader /> : <Header />}

      {/* Main Content */}
      <main
        className={cn(
          "flex min-h-0 max-h-[calc(100vh-var(--header-height))] flex-1 overflow-hidden",
          variant === "detail" ? "flex-col" : "md:flex-row"
        )}
        data-main
      >
        {/* Sidebar - hidden for now */}
        {variant === "home" && false && (
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
        )}

        {/* Full width content for all variants */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
