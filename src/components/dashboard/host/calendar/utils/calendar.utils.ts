import type { HostBookingSummary } from "@/domain/entities";

export type BookingRole = "check-in" | "check-out" | "staying";

/** A booking placed on a specific calendar day, tagged by its role that day. */
export interface DayBooking {
  booking: HostBookingSummary;
  role: BookingRole;
}

/** Tailwind palette per booking status — used for chips, dots and badges. */
export const STATUS_THEME: Record<
  string,
  { dot: string; chip: string; badge: string; label: string }
> = {
  confirmed: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Confirmed",
  },
  pending: {
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Pending",
  },
  completed: {
    dot: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 border-sky-200",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    label: "Completed",
  },
  cancelled: {
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-600 border-rose-200",
    badge: "bg-rose-50 text-rose-600 border-rose-200",
    label: "Cancelled",
  },
  declined: {
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-600 border-rose-200",
    badge: "bg-rose-50 text-rose-600 border-rose-200",
    label: "Declined",
  },
};

export const FALLBACK_THEME = {
  dot: "bg-slate-400",
  chip: "bg-slate-100 text-slate-600 border-slate-200",
  badge: "bg-slate-100 text-slate-600 border-slate-200",
  label: "Booking",
};

export function themeFor(status?: string) {
  return (status && STATUS_THEME[status]) || FALLBACK_THEME;
}

/** `2026-06-14T...` | `2026-06-14` → `2026-06-14`. Avoids timezone drift. */
export function dateKeyFromISO(iso?: string): string | null {
  if (!iso) return null;
  return iso.slice(0, 10);
}

/** Build a stable `YYYY-MM-DD` key from a local Date. */
export function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a `YYYY-MM-DD` key into a local Date at midnight. */
export function fromKey(key: string): Date {
  return new Date(`${key}T00:00:00`);
}

export function isSameMonth(date: Date, year: number, month: number) {
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * Build a map of `YYYY-MM-DD` → bookings active that day.
 * A booking occupies each night in `[checkIn, checkOut)`, and is also surfaced
 * on the check-out day so hosts see the turnover. Cancelled/declined stays are
 * collapsed to their check-in day only (they no longer occupy nights).
 */
export function bucketByDay(
  bookings: HostBookingSummary[],
): Map<string, DayBooking[]> {
  const map = new Map<string, DayBooking[]>();

  const push = (key: string, entry: DayBooking) => {
    const list = map.get(key);
    if (list) list.push(entry);
    else map.set(key, [entry]);
  };

  for (const booking of bookings) {
    const inKey = dateKeyFromISO(booking.checkIn);
    const outKey = dateKeyFromISO(booking.checkOut);
    if (!inKey) continue;

    const inactive =
      booking.status === "cancelled" || booking.status === "declined";

    if (inactive || !outKey) {
      push(inKey, { booking, role: "check-in" });
      continue;
    }

    const start = fromKey(inKey);
    const end = fromKey(outKey);
    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      const key = toKey(d);
      const role: BookingRole =
        key === inKey ? "check-in" : key === outKey ? "check-out" : "staying";
      push(key, { booking, role });
    }
  }

  return map;
}

/**
 * 6-week (42-cell) grid covering `month`, padded with leading/trailing days
 * from adjacent months. Weeks start on Sunday.
 */
export function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ROLE_LABEL: Record<BookingRole, string> = {
  "check-in": "Check-in",
  "check-out": "Check-out",
  staying: "Staying",
};
