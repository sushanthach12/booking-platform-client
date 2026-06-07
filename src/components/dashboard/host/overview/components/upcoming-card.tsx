"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { HostUpcomingEvent } from "@/domain/entities";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface UpcomingCardProps {
  events: HostUpcomingEvent[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "G";
}

const TYPE_PILL: Record<HostUpcomingEvent["type"], string> = {
  "check-in": "bg-emerald-50 text-emerald-700",
  "check-out": "bg-violet-50 text-violet-700",
};

const TYPE_LABEL: Record<HostUpcomingEvent["type"], string> = {
  "check-in": "Check-in",
  "check-out": "Check-out",
};

/** Next-7-days check-in / check-out feed with color-coded type pills. */
export function UpcomingCard({ events }: UpcomingCardProps) {
  return (
    <Card className="rounded-2xl border-slate-100 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Upcoming</h2>
          <span className="text-xs text-slate-400">Next 7 days</span>
        </div>

        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Nothing scheduled in the next 7 days.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback className="bg-slate-100 text-[10px] text-slate-500">
                    {initials(e.guestName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {e.guestName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {e.propertyName}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      TYPE_PILL[e.type],
                    )}
                  >
                    {TYPE_LABEL[e.type]}
                  </span>
                  <span className="text-xs text-slate-400">
                    {format(parseISO(e.date), "MMM d")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
