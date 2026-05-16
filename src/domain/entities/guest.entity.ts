export interface GuestProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  memberSince: string;
  bio: string;
  location: string;
  isVerified: boolean;
}

export interface GuestBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  currency: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  coverImage: string;
  reviewLeft?: boolean;
}

export interface GuestBookingsSummary {
  upcoming: GuestBooking[];
  past: GuestBooking[];
  stats: {
    totalTrips: number;
    countriesVisited: number;
    nightsStayed: number;
    totalSpent: number;
  };
}
