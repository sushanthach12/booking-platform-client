/** Host dashboard listing row (from GET /properties/host/me items). */
export interface HostListingSummary {
  id: string;
  title: string;
  status?: string;
  basePrice?: number;
  currency?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
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
}

/** Aggregate stats shown on the host dashboard overview. */
export interface HostDashboardStats {
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  currency: string;
}
