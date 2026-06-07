"use client";

import { useDashboardSidebar } from "@/components/dashboard/sidebar-context";
import { cn } from "@/lib/utils";
import { ChevronRight, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

/** A single segment of a breadcrumb trail. */
export interface BreadcrumbItem {
  /** Visible label for the segment. */
  label: string;
  /**
   * Destination for the segment. Omit on the current (last) page — that
   * segment renders as non-clickable text regardless of position.
   */
  href?: string;
}

interface PathBreadcrumbProps {
  /**
   * Ordered trail from root → current page. The last item is always treated
   * as the current page (rendered bold and non-clickable). Any earlier item
   * with an `href` is a clickable link.
   */
  items: BreadcrumbItem[];
  /** Hide the leading sidebar-toggle icon (shown by default). */
  hideIcon?: boolean;
  /**
   * Optional action content (buttons, menus) rendered right-aligned on the
   * same full-width header row as the breadcrumb trail.
   */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable dashboard breadcrumb. Pass an ordered `items` trail; the final
 * segment is rendered as the current (non-clickable) page and every earlier
 * segment with an `href` becomes a clickable link.
 *
 * @example
 * <PathBreadcrumb items={[{ label: "Orders", href: "/orders" }, { label: "ORD32" }]} />
 */
export function PathBreadcrumb({
  items,
  hideIcon = false,
  actions,
  className,
}: PathBreadcrumbProps) {
  const { toggle } = useDashboardSidebar();

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 text-lg",
        className,
      )}
    >
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-3">
        {!hideIcon && (
          <>
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle sidebar"
              className="hidden shrink-0 text-slate-500 transition-colors hover:text-slate-900 lg:inline-flex"
            >
              <PanelsTopLeft className="size-6" />
            </button>
            <span
              className="hidden h-6 w-px shrink-0 bg-slate-300 lg:inline-block"
              aria-hidden
            />
          </>
        )}

        <ol className="flex items-center gap-2.5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const clickable = !isLast && Boolean(item.href);

            return (
              <Fragment key={`${item.label}-${i}`}>
                <li>
                  {clickable ? (
                    <Link
                      href={item.href as string}
                      className="font-medium text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        isLast
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-500",
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
                {!isLast && (
                  <li aria-hidden>
                    <ChevronRight className="size-4 text-slate-300" />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
