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
  /** Fixed cleaning fee charged per stay. */
  cleaningFee?: number;
  /** Service fee as a percentage of the subtotal (e.g. 10 = 10%). */
  serviceFeePercentage?: number;
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
  /** Populated by backend when request is authenticated */
  isWishlisted?: boolean;
}

/** Body for POST /api/v1/properties/search */
export interface PropertySearchParams {
  query?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: "price" | "rating" | "distance" | "created_at";
  sortOrder?: "asc" | "desc";
}
