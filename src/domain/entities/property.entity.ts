/**
 * Property entity aligned with backend `properties` table and design reference §12.
 * Backend: GET /api/v1/properties/search, GET /api/v1/properties/:id
 */

export interface PropertyLocation {
  city: string;
  state?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
}

export interface PropertyHost {
  id?: string;
  name: string;
  image?: string;
  isSuperhost?: boolean;
}

export interface PropertyStats {
  rating: number;
  reviewCount: number;
}

export interface PropertyPricing {
  amount: number;
  currency: string;
  frequency: "night" | "person" | "week";
}

export interface PropertyEntity {
  id: string;
  /** Backend: title */
  name?: string;
  title: string;
  /** Backend: property_type — e.g. "Entire rental unit", "Private room" */
  type?: string;
  description?: string;
  location: PropertyLocation;
  host?: PropertyHost;
  stats?: PropertyStats;
  amenities?: string[];
  pricing: PropertyPricing;
  images: string[];
  /** Backend: bedrooms, beds, bathrooms */
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  /** Backend: status — draft, active, inactive, deleted */
  status?: string;
}

/** Query params for GET /api/v1/properties/search (booking_platform.md) */
export interface PropertySearchParams {
  location?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  price_min?: number;
  price_max?: number;
  radius?: number;
}
