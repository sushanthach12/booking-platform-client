import { parseISO, isValid, startOfDay } from "date-fns";

export interface ParsedBookingParams {
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  infants: number;
  currency: string;
}

const DEFAULT_GUESTS = { adults: 1, children: 0, infants: 0 };
const MIN_ADULTS = 1;
const MAX_GUESTS = 16;

function parseGuests(value: string | null): {
  adults: number;
  children: number;
  infants: number;
} {
  if (!value || typeof value !== "string") return DEFAULT_GUESTS;
  const parts = value.split("-").map((s) => parseInt(s.trim(), 10));
  if (parts.length >= 3 && parts.every((n) => !Number.isNaN(n))) {
    const [adults, children, infants] = parts;
    const a = Math.max(MIN_ADULTS, Math.min(MAX_GUESTS, adults));
    const c = Math.max(0, Math.min(MAX_GUESTS - a, children));
    const i = Math.max(0, Math.min(5, infants));
    return { adults: a, children: c, infants: i };
  }
  const single = parseInt(value, 10);
  if (!Number.isNaN(single) && single >= 1 && single <= MAX_GUESTS) {
    return { adults: single, children: 0, infants: 0 };
  }
  return DEFAULT_GUESTS;
}

function parseDate(value: string | null): Date | null {
  if (!value || typeof value !== "string") return null;
  const d = parseISO(value);
  return isValid(d) ? startOfDay(d) : null;
}

/**
 * Parse booking page searchParams (from URL) into typed dates, guests, and currency.
 * Used by the book page to pre-fill the form from the URL.
 */
export function parseBookingSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ParsedBookingParams {
  const get = (key: string): string | null => {
    const v = searchParams[key];
    if (v == null) return null;
    return Array.isArray(v) ? v[0] ?? null : v;
  };

  const checkIn = parseDate(get("checkIn"));
  const checkOut = parseDate(get("checkOut"));
  const guests = parseGuests(get("guests"));
  const currency = get("currency")?.toUpperCase() || "INR";

  return {
    checkIn,
    checkOut,
    adults: guests.adults,
    children: guests.children,
    infants: guests.infants,
    currency,
  };
}

/**
 * Build query string for booking URL from dates, guests, and currency.
 * Use when navigating from property detail "Reserve" to book page.
 */
export function buildBookingQuery(params: {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  infants: number;
  currency?: string;
}): string {
  const { checkIn, checkOut, adults, children, infants, currency = "INR" } = params;
  const format = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const guests = `${adults}-${children}-${infants}`;
  const q = new URLSearchParams({
    checkIn: format(checkIn),
    checkOut: format(checkOut),
    guests,
    currency,
  });
  return q.toString();
}
