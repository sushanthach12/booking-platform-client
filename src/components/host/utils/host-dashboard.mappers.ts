import type { HostBookingSummary, HostListingSummary } from "@/domain/entities";

export function mapRawToHostListing(
  raw: Record<string, unknown>,
): HostListingSummary {
  const images = Array.isArray(raw.images) ? (raw.images as unknown[]) : [];
  const firstImage = images[0];
  const coverImage =
    typeof firstImage === "string"
      ? firstImage
      : typeof firstImage === "object" && firstImage
        ? String((firstImage as Record<string, unknown>).url ?? "")
        : undefined;

  const pricing =
    typeof raw.pricing === "object" && raw.pricing
      ? (raw.pricing as Record<string, unknown>)
      : {};
  const stats =
    typeof raw.stats === "object" && raw.stats
      ? (raw.stats as Record<string, unknown>)
      : {};

  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Untitled"),
    status: raw.status != null ? String(raw.status) : undefined,
    basePrice:
      typeof pricing.amount === "number"
        ? pricing.amount
        : typeof raw.basePrice === "number"
          ? raw.basePrice
          : undefined,
    currency:
      typeof pricing.currency === "string"
        ? pricing.currency
        : typeof raw.currency === "string"
          ? raw.currency
          : undefined,
    coverImage: coverImage || undefined,
    rating: typeof stats.rating === "number" ? stats.rating : undefined,
    reviewCount:
      typeof stats.reviewCount === "number" ? stats.reviewCount : undefined,
    location:
      raw.city && raw.country
        ? `${raw.city}, ${raw.country}`
        : typeof raw.location === "string"
          ? raw.location
          : undefined,
  };
}

export function mapRawToHostBooking(
  raw: Record<string, unknown>,
): HostBookingSummary {
  const property =
    typeof raw.property === "object" && raw.property
      ? (raw.property as Record<string, unknown>)
      : {};

  return {
    id: String(raw.id ?? ""),
    bookingNumber:
      raw.bookingNumber != null ? String(raw.bookingNumber) : undefined,
    status: raw.status != null ? String(raw.status) : undefined,
    checkIn: raw.checkInDate != null ? String(raw.checkInDate) : undefined,
    checkOut: raw.checkOutDate != null ? String(raw.checkOutDate) : undefined,
    guestCount:
      typeof raw.guestCount === "number" ? raw.guestCount : undefined,
    totalAmount:
      typeof raw.totalPrice === "number" ? raw.totalPrice : undefined,
    propertyId:
      raw.propertyId != null
        ? String(raw.propertyId)
        : property.id != null
          ? String(property.id)
          : undefined,
    propertyName:
      raw.propertyTitle != null
        ? String(raw.propertyTitle)
        : property.title != null
          ? String(property.title)
          : undefined,
    currency:
      typeof raw.currency === "string" ? raw.currency : undefined,
  };
}
