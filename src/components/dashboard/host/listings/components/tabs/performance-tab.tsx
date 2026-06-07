"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { HostBookingSummary } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { format, parseISO, subMonths } from "date-fns";

interface PerformanceTabProps {
  bookings: HostBookingSummary[];
  rating: number;
  reviewCount: number;
  currency: string;
}

interface MonthPoint {
  label: string;
  amount: number;
}

/** Buckets booking revenue into the last 7 calendar months (oldest → newest). */
function monthlyRevenue(
  bookings: HostBookingSummary[],
  now: Date,
): MonthPoint[] {
  const buckets: MonthPoint[] = [];
  const keyToIndex = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = subMonths(now, i);
    const key = format(d, "yyyy-MM");
    keyToIndex.set(key, buckets.length);
    buckets.push({ label: format(d, "MMM"), amount: 0 });
  }
  for (const b of bookings) {
    if (!b.checkIn || b.totalAmount == null) continue;
    const key = format(parseISO(b.checkIn), "yyyy-MM");
    const idx = keyToIndex.get(key);
    if (idx != null) buckets[idx].amount += b.totalAmount;
  }
  return buckets;
}

function KpiCard({
  label,
  value,
  caption,
  dotClass,
}: {
  label: string;
  value: string;
  caption: string;
  dotClass: string;
}) {
  return (
    <Card className="rounded-[14px] border-slate-100 shadow-none">
      <CardContent className="p-[22px]">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className={cn("size-1.5 rounded-full", dotClass)} />
          {caption}
        </p>
      </CardContent>
    </Card>
  );
}

export function PerformanceTab({
  bookings,
  rating,
  reviewCount,
  currency,
}: PerformanceTabProps) {
  // Stable "now" derived from the latest booking (avoids non-deterministic Date).
  const latest = bookings.reduce<string | null>(
    (acc, b) => (b.checkIn && (!acc || b.checkIn > acc) ? b.checkIn : acc),
    null,
  );
  const now = latest ? parseISO(latest) : new Date();
  const points = monthlyRevenue(bookings, now);
  const totalRevenue = points.reduce((s, p) => s + p.amount, 0);
  const max = points.reduce((m, p) => Math.max(m, p.amount), 0);
  const ceiling = max > 0 ? Math.ceil(max / 1000) * 1000 : 1000;

  // SVG geometry
  const VB_W = 520;
  const VB_H = 180;
  const BAR_W = 42;
  const GAP = 68;
  const baseY = VB_H - 24;
  const chartH = baseY - 10;
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Revenue (7mo)"
          value={formatCurrency(totalRevenue, currency, 0)}
          caption="all bookings"
          dotClass="bg-emerald-500"
        />
        <KpiCard
          label="Avg occupancy"
          value="—"
          caption="last 30 days"
          dotClass="bg-blue-500"
        />
        <KpiCard
          label="Avg rating"
          value={rating > 0 ? rating.toFixed(2) : "—"}
          caption={`${reviewCount} reviews`}
          dotClass="bg-amber-400"
        />
      </div>

      <Card className="rounded-2xl border-slate-100 shadow-none">
        <CardContent className="p-6">
          <h2 className="font-bold text-slate-900">Revenue trend</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Monthly revenue from this listing — last 7 months
          </p>

          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="mt-6 w-full"
            role="img"
            aria-label="Monthly revenue bar chart"
          >
            {/* Gridlines + axis labels */}
            {ticks.map((t) => {
              const y = baseY - t * chartH;
              return (
                <g key={t}>
                  <line
                    x1={28}
                    x2={VB_W}
                    y1={y}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                  />
                  <text x={0} y={y + 3} fontSize={9} fill="#94a3b8">
                    {Math.round((ceiling * t) / 1000)}k
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {points.map((p, i) => {
              const h = ceiling > 0 ? (p.amount / ceiling) * chartH : 0;
              const x = 40 + i * GAP;
              const isLast = i === points.length - 1;
              return (
                <g key={p.label}>
                  <rect
                    x={x}
                    y={baseY - h}
                    width={BAR_W}
                    height={Math.max(0, h)}
                    rx={5}
                    fill="#3b82f6"
                    fillOpacity={isLast ? 1 : 0.55}
                  />
                  {isLast && p.amount > 0 && (
                    <text
                      x={x + BAR_W / 2}
                      y={baseY - h - 6}
                      fontSize={10}
                      fontWeight={700}
                      fill="#3b82f6"
                      textAnchor="middle"
                    >
                      ${(p.amount / 1000).toFixed(1)}k
                    </text>
                  )}
                  <text
                    x={x + BAR_W / 2}
                    y={VB_H - 6}
                    fontSize={10}
                    fill="#94a3b8"
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>
    </div>
  );
}
