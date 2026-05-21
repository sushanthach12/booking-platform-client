import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  CancellationPolicyType,
  PropertyEntity,
  PropertyLocation,
  PropertySearchParams,
} from "@/domain/entities";
import type { IPropertyRepository } from "@/domain/interfaces";
import { apiFetch } from "@/lib/utils/api-fetch";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

const PLACEHOLDER_IMAGE = "/next.svg";

interface ApiPropertySummary {
  id: string;
  title: string;
  description?: string | null;
  slug?: string;
  propertyType?: string;
  status?: string;
  coverImage?: string | null;
  location?: ApiLocation;
  pricing?: ApiPricing;
  ratings?: ApiRatings;
}

interface ApiListResponse {
  data: {
    results: ApiPropertySummary[];
    pagination?: { totalItems?: number };
  };
}

interface ApiLocation {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface ApiPricing {
  basePrice?: number;
  currency?: string;
}

interface ApiDetails {
  maxGuests?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
}

interface ApiRatings {
  averageRating?: number;
  totalReviews?: number;
}

interface ApiPolicy {
  cancellationPolicy?: string;
  checkInTime?: string;
  checkOutTime?: string;
  maxGuests?: number;
}

interface ApiPropertyDetail extends ApiPropertySummary {
  location?: ApiLocation;
  pricing?: ApiPricing;
  details?: ApiDetails;
  ratings?: ApiRatings;
  images?: Array<{ url?: string }>;
  amenities?: Array<{ name?: string }>;
  policy?: ApiPolicy;
}

function mapLocation(loc?: ApiLocation): PropertyLocation {
  return {
    city: loc?.city ?? "—",
    state: loc?.state,
    country: loc?.country,
    coordinates:
      loc?.latitude != null && loc?.longitude != null
        ? { lat: loc.latitude, lng: loc.longitude }
        : undefined,
  };
}

function mapSummaryToEntity(p: ApiPropertySummary): PropertyEntity {
  const typeLabel = p.propertyType
    ? p.propertyType.replace(/_/g, " ")
    : undefined;
  return {
    id: p.id,
    title: p.title,
    name: p.title,
    type: typeLabel,
    description: p.description ?? undefined,
    location: mapLocation(p.location),
    stats: p.ratings
      ? {
          rating: p.ratings.averageRating ?? 0,
          reviewCount: p.ratings.totalReviews ?? 0,
        }
      : undefined,
    pricing: {
      amount: p.pricing?.basePrice ?? 0,
      currency: p.pricing?.currency ?? "USD",
      frequency: "night",
    },
    images: p.coverImage ? [p.coverImage] : [PLACEHOLDER_IMAGE],
    status: p.status,
  };
}

function mapDetailToEntity(p: ApiPropertyDetail): PropertyEntity {
  const images = p.images?.map((i) => i.url).filter(Boolean) as
    | string[]
    | undefined;
  const amenities = p.amenities?.map((a) => a.name).filter(Boolean) as
    | string[]
    | undefined;

  return {
    id: p.id,
    title: p.title,
    name: p.title,
    type: p.propertyType?.replace(/_/g, " "),
    description: p.description ?? undefined,
    location: mapLocation(p.location),
    host: { name: "Host" },
    stats: p.ratings
      ? {
          rating: p.ratings.averageRating ?? 0,
          reviewCount: p.ratings.totalReviews ?? 0,
        }
      : undefined,
    amenities,
    pricing: {
      amount: p.pricing?.basePrice ?? 0,
      currency: p.pricing?.currency ?? "USD",
      frequency: "night",
    },
    images: images && images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    bedrooms: p.details?.bedrooms,
    beds: p.details?.beds,
    bathrooms: p.details?.bathrooms,
    status: p.status,
    cancellationPolicy: p.policy?.cancellationPolicy as
      | CancellationPolicyType
      | undefined,
    checkInTime: p.policy?.checkInTime,
    checkOutTime: p.policy?.checkOutTime,
    maxGuests: p.details?.maxGuests ?? p.policy?.maxGuests,
  };
}

@injectable()
export class PropertyRepository implements IPropertyRepository {
  async getProperties(): Promise<PropertyEntity[]> {
    try {
      const res = await fetch(
        apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.LISTING),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 50 }),
        },
      );

      if (!res.ok) {
        return [];
      }

      const json: ApiListResponse = await res.json();
      return json.data.results.map(mapSummaryToEntity);
    } catch {
      return [];
    }
  }

  async getPropertyById(id: string): Promise<PropertyEntity | null> {
    try {
      const q = new URLSearchParams({
        propertyId: id,
        includeRelations: "true",
      });
      const res = await fetch(
        `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.DETAILS)}?${q.toString()}`,
        { headers: getJsonHeaders() },
      );

      if (res.status === 404) return null;
      if (!res.ok) {
        return null;
      }

      const { data }: { data: ApiPropertyDetail } = await res.json();
      return mapDetailToEntity(data);
    } catch {
      return null;
    }
  }

  async searchProperties(
    params?: PropertySearchParams,
  ): Promise<PropertyEntity[]> {
    const body: Record<string, unknown> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    };
    if (params?.query) body.query = params.query;
    if (params?.location) body.location = params.location;
    if (params?.latitude != null) body.latitude = params.latitude;
    if (params?.longitude != null) body.longitude = params.longitude;
    if (params?.radius != null) body.radius = params.radius;
    if (params?.checkIn) body.checkIn = params.checkIn;
    if (params?.checkOut) body.checkOut = params.checkOut;
    if (params?.guests != null) body.guests = params.guests;
    if (params?.propertyType?.length)
      body.propertyType = params.propertyType.map((t) => t.toLowerCase());
    if (params?.minPrice != null) body.minPrice = params.minPrice;
    if (params?.maxPrice != null) body.maxPrice = params.maxPrice;
    if (params?.amenities?.length) body.amenities = params.amenities;
    if (params?.minBeds != null) body.minBeds = params.minBeds;
    if (params?.minBathrooms != null) body.minBathrooms = params.minBathrooms;
    if (params?.sortBy) body.sortBy = params.sortBy;
    if (params?.sortOrder) body.sortOrder = params.sortOrder;

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.SEARCH),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error("Search failed. Please try again.");
    }

    const json: ApiListResponse = await res.json();
    return (json.data?.results ?? []).map(mapSummaryToEntity);
  }
}
