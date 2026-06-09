"use client";

import { Card } from "@/components/ui/card";
import type { HostKpi } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface KpiCardsProps {
  kpis: HostKpi[];
}

function DeltaPill({ delta }: { delta: number }) {
  const positive = delta >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
      )}
    >
      <Icon className="size-3" />
      {positive ? "+" : ""}
      {delta}
    </span>
  );
}

/** Row of four clickable headline metric cards with delta pills. */
export function KpiCards({ kpis }: KpiCardsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card
          key={kpi.key}
          role="button"
          tabIndex={0}
          onClick={() => router.push(kpi.href)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") router.push(kpi.href);
          }}
          className="cursor-pointer rounded-2xl border-slate-100 p-5 shadow-none transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="text-xl" aria-hidden>
              {kpi.emoji}
            </span>
            {kpi.delta != null && <DeltaPill delta={kpi.delta} />}
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {kpi.value}
          </p>
          <p className="mt-1 text-sm text-slate-500">{kpi.label}</p>
          {kpi.caption && (
            <p className="mt-0.5 text-xs text-slate-400">{kpi.caption}</p>
          )}
        </Card>
      ))}
    </div>
  );
}
