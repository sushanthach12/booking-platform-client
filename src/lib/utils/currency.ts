const DEFAULT_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "INR";

/**
 * Formats a monetary amount as an INR string (e.g. "₹1,50,000").
 * Falls back to INR when no currency is supplied.
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  fractionDigits = 0,
): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
