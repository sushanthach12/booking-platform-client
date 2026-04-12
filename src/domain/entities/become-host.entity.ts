/** Values must match backend `EPropertyType` enum exactly. */
export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "condo",
  "villa",
  "studio",
  "loft",
  "cabin",
  "townhouse",
  "other",
] as const;

/** Mirrors backend `EPropertyAmenityCategory` — values must match exactly. */
export enum EAmenityCategory {
  GENERAL = "general",
  ESSENTIALS = "essentials",
  FEATURES = "features",
  LOCATION = "location",
  SAFETY = "safety",
}

export const AMENITIES: { name: string; category: EAmenityCategory }[] = [
  { name: "WiFi", category: EAmenityCategory.ESSENTIALS },
  { name: "Kitchen", category: EAmenityCategory.ESSENTIALS },
  { name: "Parking", category: EAmenityCategory.FEATURES },
  { name: "Air Conditioning", category: EAmenityCategory.FEATURES },
  { name: "Heating", category: EAmenityCategory.FEATURES },
  { name: "Washer", category: EAmenityCategory.FEATURES },
  { name: "Dryer", category: EAmenityCategory.FEATURES },
  { name: "TV", category: EAmenityCategory.GENERAL },
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

/** Image with full metadata captured at upload time from the browser File object. */
export interface IImageUploadMetadata {
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  /** Original filename used as alt text fallback. */
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
  /** File size in bytes (from File.size). */
  fileSize?: number;
  /** MIME type (from File.type). */
  mimeType?: string;
}

/** Returned by GET /host/onboard/draft/resume to restore wizard state. */
export interface IOnboardingDraftResume {
  propertyId: string;
  completedSteps: number[];
  currentStep: number;
}
