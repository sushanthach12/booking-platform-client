"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { IPayoutEarnings } from "@/domain/interfaces";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface EarningsChartProps {
  earnings: IPayoutEarnings;
}

/** Rounds an amount up to a "nice" axis ceiling (e.g. 7.1k → 7k grid steps). */
function buildScale(max: number): { ceiling: number; ticks: number[] } {
  if (max <= 0) return { ceiling: 1000, ticks: [0, 1000] };
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const ceiling = Math.ceil(max / step) * step;
  const tickCount = 4;
  const ticks = Array.from(
    { length: tickCount + 1 },
    (_, i) => (ceiling / tickCount) * i,
  );
  return { ceiling, ticks };
}

function formatTick(value: number): string {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(Math.round(value));
}

function formatBarValue(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value}`;
}

/**
 * Earnings overview rendered as a lightweight CSS bar chart — avoids pulling in
 * a charting dependency for a single read-only visual. The tallest (latest) bar
 * is highlighted and labelled, matching the dashboard design.
 */
export function EarningsChart({ earnings }: EarningsChartProps) {
  const { points, yoyChange } = earnings;
  const max = points.reduce((m, p) => Math.max(m, p.amount), 0);
  const { ceiling, ticks } = buildScale(max);
  const peakIndex = points.reduce(
    (peak, p, i) => (p.amount > points[peak]?.amount ? i : peak),
    0,
  );

  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Earnings Overview</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Last {points.length} months
            </p>
          </div>
          {yoyChange != null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                yoyChange >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600",
              )}
            >
              <TrendingUp className="size-3.5" />
              {yoyChange >= 0 ? "+" : ""}
              {yoyChange}% YoY
            </span>
          )}
        </div>

        {points.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">
            No earnings data yet.
          </p>
        ) : (
          <div className="mt-8 flex gap-3">
            {/* Y axis */}
            <div className="flex h-64 w-8 shrink-0 flex-col-reverse justify-between pb-7 text-right text-xs text-slate-400">
              {ticks.map((tick) => (
                <span key={tick}>{formatTick(tick)}</span>
              ))}
            </div>

            {/* Bars */}
            <div className="relative flex h-64 flex-1 items-end justify-between gap-2 sm:gap-4">
              {/* Grid lines */}
              <div className="pointer-events-none absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
                {ticks
                  .slice()
                  .reverse()
                  .map((tick) => (
                    <div key={tick} className="h-px w-full bg-slate-100" />
                  ))}
              </div>

              {points.map((point, i) => {
                const heightPct =
                  ceiling > 0 ? (point.amount / ceiling) * 100 : 0;
                const isPeak = i === peakIndex;
                return (
                  <div
                    key={point.month}
                    className="relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {isPeak && (
                      <span className="absolute -top-1 text-sm font-bold text-blue-600">
                        {formatBarValue(point.amount)}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-full max-w-14 rounded-t-lg transition-all",
                        isPeak ? "bg-blue-500" : "bg-blue-200",
                      )}
                      style={{ height: `calc(${heightPct}% - 1.75rem)` }}
                      title={formatBarValue(point.amount)}
                    />
                    <span className="mt-2 h-5 text-xs text-slate-400">
                      {point.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
