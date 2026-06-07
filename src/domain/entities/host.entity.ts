/** Host dashboard listing row (from GET /properties/host/me items). */
export interface HostListingSummary {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  propertyType?: string;
  status?: string;
  coverImage?: string | null;
  basePrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Host dashboard booking row (from GET /bookings/host items). */
export interface HostBookingSummary {
  id: string;
  bookingNumber?: string;
  status?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  totalAmount?: number;
  propertyId?: string;
  propertyName?: string;
  currency?: string;
  guestName?: string;
}

/** Aggregate stats shown on the host dashboard overview. */
export interface HostDashboardStats {
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  currency: string;
}

/** A single headline KPI on the overview screen (earnings, occupancy, etc.). */
export interface HostKpi {
  /** Stable key used for click-to-navigate routing. */
  key: "earnings" | "bookings" | "occupancy" | "rating";
  label: string;
  /** Pre-formatted display value, e.g. "$7,100", "82%", "4.91". */
  value: string;
  /** Emoji icon shown in the card. */
  emoji: string;
  /**
   * Percentage delta vs the previous period; null hides the pill.
   * Positive renders as a green "↑" pill.
   */
  delta: number | null;
  /** Optional caption under the value, e.g. "358 reviews". */
  caption?: string;
  /** Route pushed when the card is clicked. */
  href: string;
}

/** Upcoming check-in / check-out entry for the next 7 days. */
export interface HostUpcomingEvent {
  id: string;
  guestName: string;
  propertyName: string;
  type: "check-in" | "check-out";
  date: string;
}

/** Operational stats rendered as progress bars on the overview. */
export interface HostQuickStats {
  activeListings: number;
  totalListings: number;
  responseRate: number;
  acceptanceRate: number;
}
