export const PROPERTY_TYPES = [
  "APARTMENT",
  "HOUSE",
  "CONDO",
  "VILLA",
  "STUDIO",
  "LOFT",
  "CABIN",
  "COTTAGE",
];

export const AMENITIES = [
  { name: "WiFi", category: "ESSENTIALS" },
  { name: "Kitchen", category: "ESSENTIALS" },
  { name: "Parking", category: "ESSENTIALS" },
  { name: "Air Conditioning", category: "COMFORT" },
  { name: "Heating", category: "COMFORT" },
  { name: "Washer", category: "AMENITIES" },
  { name: "Dryer", category: "AMENITIES" },
  { name: "TV", category: "ENTERTAINMENT" },
];

export interface IBecomeHostPropertyFormData {
  // Step 1: Basic Info
  title: string;
  description: string;
  propertyType: string;

  // Step 2: Location
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  /** Required by core `HostOnboardingLocationDto` (non-zero; refine with geocoding later). */
  latitude: number;
  longitude: number;

  // Step 3: Pricing & Policies
  basePrice: number;
  currency: string;
  minNights: number;
  maxNights: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;

  // Step 4: Amenities & Rules
  amenities: string[];
  rules: Array<{ type: string; allowed: boolean; description?: string }>;

  // Step 5: Photos
  images: string[];
}
