'use client';

import { cn } from '@/lib/utils';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  rowsPerPageOptions?: number[];
  className?: string;
}

const ICON_BTN =
  'inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40';

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  rowsPerPageOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  if (total === 0) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t border-border pt-4 text-sm text-muted-foreground',
        className,
      )}
    >
      {/* Left — rows per page */}
      <div className='flex items-center gap-2 shrink-0'>
        <span className='whitespace-nowrap'>Rows per page</span>
        <div className='relative'>
          <select
            value={limit}
            onChange={(e) => {
              onLimitChange?.(Number(e.target.value));
              onPageChange(1);
            }}
            className='h-8 appearance-none rounded-md border border-input bg-background pl-3 pr-7 text-sm font-medium text-foreground font-[inherit] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer'
          >
            {rowsPerPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronRight className='pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 rotate-90 text-muted-foreground' />
        </div>
      </div>

      {/* Right — page info + nav buttons */}
      <div className='flex items-center gap-3 shrink-0'>
        <span className='whitespace-nowrap tabular-nums'>
          Page {page} of {totalPages}
        </span>

        <div className='flex items-center gap-1'>
          {/* First */}
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            aria-label='First page'
            className={ICON_BTN}
          >
            <ChevronFirst className='size-4' />
          </button>

          {/* Prev */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label='Previous page'
            className={ICON_BTN}
          >
            <ChevronLeft className='size-4' />
          </button>

          {/* Next */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label='Next page'
            className={ICON_BTN}
          >
            <ChevronRight className='size-4' />
          </button>

          {/* Last */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            aria-label='Last page'
            className={ICON_BTN}
          >
            <ChevronLast className='size-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
