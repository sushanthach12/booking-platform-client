"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="h-9 w-9 flex items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ) : (
          <Button
            key={p}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-9 w-9 p-0 rounded-xl text-sm font-medium transition-all",
              p === page
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
