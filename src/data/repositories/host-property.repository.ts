import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type {
  IBecomeHostPropertyFormData,
  IImageUploadMetadata,
  IOnboardingDraftResume,
} from "@/domain/entities";
import { AMENITIES } from "@/domain/entities";
import type { IHostPropertyRepository } from "@/domain/interfaces";
import { parseApiError } from "@/lib/utils/api-error";
import { apiFetch } from "@/lib/utils/api-fetch";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

const BACKEND_PROPERTY_TYPES = new Set([
  "apartment",
  "house",
  "villa",
  "cabin",
  "condo",
  "townhouse",
  "studio",
  "loft",
  "other",
]);

function normalizePropertyType(raw: string): string {
  const v = raw.trim().toLowerCase();
  return BACKEND_PROPERTY_TYPES.has(v) ? v : "apartment";
}

function amenityCategory(name: string): string {
  const found = AMENITIES.find(
    (a) => a.name.toLowerCase() === name.trim().toLowerCase(),
  );
  return (found?.category ?? "GENERAL").toLowerCase();
}

function normalizeRuleType(raw: string): string {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const allowed = new Set([
    "pets",
    "smoking",
    "parties",
    "quiet_hours",
    "check_in_time",
    "check_out_time",
    "max_guests",
    "no_shoes",
    "no_alcohol",
    "no_smoking",
    "other",
  ]);
  return allowed.has(key) ? key : "other";
}

// ----- Draft API response normalisation -----

/** Nested shape the backend may return for a draft property. */
interface RawDraftApiResponse {
  // Flat fields (already matches IBecomeHostPropertyFormData)
  title?: string;
  description?: string;
  propertyType?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  basePrice?: number;
  currency?: string;
  minNights?: number;
  maxNights?: number;
  maxGuests?: number;
  checkInTime?: string;
  checkOutTime?: string;
  amenities?: string[] | { name: string; category?: string }[];
  rules?: Array<{
    type?: string;
    ruleType?: string;
    allowed: boolean;
    description?: string;
  }>;
  images?: string[];

  // Nested shapes (mirrors what we POST during onboarding)
  basicInfo?: {
    title?: string;
    description?: string;
    propertyType?: string;
  };
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
  pricingAndPolicies?: {
    basePrice?: number;
    currency?: string;
    minNights?: number;
    maxNights?: number;
    maxGuests?: number;
    checkInTime?: string;
    checkOutTime?: string;
  };
  amenitiesAndRules?: {
    amenities?: { name: string; category?: string }[];
    rules?: Array<{
      type?: string;
      ruleType?: string;
      allowed: boolean;
      description?: string;
    }>;
  };
  media?: {
    imageUrls?: string[];
    images?: Array<{
      url: string;
      altText?: string;
      displayOrder?: number;
      isPrimary?: boolean;
      fileSize?: number;
      mimeType?: string;
    }>;
  };
}

/** Strip seconds from PostgreSQL time strings: "15:00:00" → "15:00" */
function toHHmm(t?: string): string | undefined {
  if (!t) return undefined;
  return t.length > 5 ? t.slice(0, 5) : t;
}

function normalizeDraftResponse(
  raw: RawDraftApiResponse,
): IBecomeHostPropertyFormData {
  const bi = raw.basicInfo ?? {};
  const loc = raw.location ?? {};
  const pp = raw.pricingAndPolicies ?? {};
  const ar = raw.amenitiesAndRules ?? {};
  const media = raw.media ?? {};

  const rawAmenities =
    ar.amenities ??
    (raw.amenities as { name: string }[] | string[] | undefined) ??
    [];
  const amenities: string[] = rawAmenities.map((a) =>
    typeof a === "string" ? a : a.name,
  );

  const rawRules = ar.rules ?? raw.rules ?? [];
  const rules = rawRules.map((r) => ({
    type: r.type ?? r.ruleType ?? "other",
    allowed: r.allowed,
    description: r.description,
  }));

  return {
    title: bi.title ?? raw.title ?? "",
    description: bi.description ?? raw.description ?? "",
    propertyType: bi.propertyType ?? raw.propertyType ?? "",

    addressLine1: loc.addressLine1 ?? raw.addressLine1 ?? "",
    addressLine2: loc.addressLine2 ?? raw.addressLine2 ?? "",
    city: loc.city ?? raw.city ?? "",
    state: loc.state ?? raw.state ?? "",
    country: loc.country ?? raw.country ?? "",
    postalCode: loc.postalCode ?? raw.postalCode ?? "",
    latitude: Number(loc.latitude ?? raw.latitude ?? 0),
    longitude: Number(loc.longitude ?? raw.longitude ?? 0),

    basePrice: Number(pp.basePrice ?? raw.basePrice ?? 0),
    currency: pp.currency ?? raw.currency ?? "USD",
    minNights: Number(pp.minNights ?? raw.minNights ?? 1),
    maxNights: Number(pp.maxNights ?? raw.maxNights ?? 30),
    maxGuests: Number(pp.maxGuests ?? raw.maxGuests ?? 1),
    checkInTime: toHHmm(pp.checkInTime ?? raw.checkInTime) ?? "15:00",
    checkOutTime: toHHmm(pp.checkOutTime ?? raw.checkOutTime) ?? "11:00",

    amenities,
    rules,

    images:
      media.imageUrls ??
      media.images?.map((img) => img.url) ??
      (raw.images as string[] | undefined) ??
      [],
  };
}

// ----- Published property API response normalisation -----

/** Shape returned by GET /api/v1/properties/details for a published property. */
interface RawPublishedApiResponse {
  title?: string;
  description?: string;
  propertyType?: string;
  status?: string;
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number | string;
    longitude?: number | string;
  };
  pricing?: {
    basePrice?: number;
    currency?: string;
    minNights?: number;
    maxNights?: number;
    maxGuests?: number;
    checkInTime?: string;
    checkOutTime?: string;
  };
  amenities?: Array<{ name?: string; category?: string } | string>;
  rules?: Array<{
    type?: string;
    ruleType?: string;
    allowed: boolean;
    description?: string;
  }>;
  images?: Array<{ url?: string } | string>;
}

function normalizePublishedResponse(
  raw: RawPublishedApiResponse,
): IBecomeHostPropertyFormData {
  const loc = raw.location ?? {};
  const pp = raw.pricing ?? {};

  const amenities: string[] = (raw.amenities ?? [])
    .map((a) => (typeof a === "string" ? a : (a.name ?? "")))
    .filter(Boolean);

  const rules = (raw.rules ?? []).map((r) => ({
    type: r.type ?? r.ruleType ?? "other",
    allowed: r.allowed,
    description: r.description,
  }));

  const imageUrls: string[] = (raw.images ?? [])
    .map((img) => (typeof img === "string" ? img : (img.url ?? "")))
    .filter(Boolean);

  return {
    title: raw.title ?? "",
    description: raw.description ?? "",
    propertyType: raw.propertyType ?? "",
    addressLine1: loc.addressLine1 ?? "",
    addressLine2: loc.addressLine2 ?? "",
    city: loc.city ?? "",
    state: loc.state ?? "",
    country: loc.country ?? "",
    postalCode: loc.postalCode ?? "",
    latitude: Number(loc.latitude ?? 40.7128),
    longitude: Number(loc.longitude ?? -74.006),
    basePrice: Number(pp.basePrice ?? 0),
    currency: pp.currency ?? "USD",
    minNights: Number(pp.minNights ?? 1),
    maxNights: Number(pp.maxNights ?? 30),
    maxGuests: Number(pp.maxGuests ?? 1),
    checkInTime: toHHmm(pp.checkInTime) ?? "15:00",
    checkOutTime: toHHmm(pp.checkOutTime) ?? "11:00",
    amenities,
    rules,
    images: imageUrls,
  };
}

// ----- Repository -----

@injectable()
export class HostPropertyRepository implements IHostPropertyRepository {
  /** @deprecated Use step-based methods instead. */
  async onboardHost(
    formData: IBecomeHostPropertyFormData,
    imageUrls: string[],
  ): Promise<{ id: string }> {
    const amenities =
      formData.amenities.length > 0
        ? formData.amenities.map((name) => ({
            name,
            category: amenityCategory(name),
          }))
        : [{ name: "Essentials", category: "essentials" }];

    const rules =
      formData.rules?.map((r) => ({
        ruleType: normalizeRuleType(r.type),
        allowed: r.allowed,
        description: r.description,
      })) ?? [];

    const body = {
      basicInfo: {
        propertyType: normalizePropertyType(formData.propertyType),
        title: formData.title,
        description: formData.description,
      },
      location: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      pricingAndPolicies: {
        basePrice: formData.basePrice,
        currency: formData.currency,
        minNights: formData.minNights,
        maxNights: formData.maxNights,
        maxGuests: formData.maxGuests,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        cancellationPolicy: "flexible",
        enableWaitlist: false,
      },
      amenitiesAndRules: {
        amenities,
        rules: rules.length > 0 ? rules : undefined,
      },
      media: {
        imageUrls,
      },
    };

    const res = await apiFetch(apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD), {
      method: "POST",
      headers: getJsonHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Host onboarding failed"));
    }

    const { data } = (await res.json()) as { data: { id: string } };
    return { id: data.id };
  }

  async createDraft(
    data: Pick<
      IBecomeHostPropertyFormData,
      "title" | "description" | "propertyType"
    > & { propertyId?: string },
  ): Promise<{ propertyId: string; slug: string }> {
    const body: Record<string, unknown> = {
      propertyType: normalizePropertyType(data.propertyType),
      title: data.title,
      description: data.description,
    };
    if (data.propertyId) body.propertyId = data.propertyId;

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const msg = await parseApiError(res, "Failed to create draft property");
      // Backend signals the draft was already published/active
      if (msg.includes("PROPERTY_NOT_IN_DRAFT_STATUS")) {
        throw Object.assign(new Error("PROPERTY_NOT_IN_DRAFT_STATUS"), {
          code: "PROPERTY_NOT_IN_DRAFT_STATUS",
        });
      }
      throw new Error(msg);
    }

    const { data: d } = (await res.json()) as {
      data: { id: string; slug: string };
    };
    return { propertyId: d.id, slug: d.slug };
  }

  async saveLocation(
    data: Pick<
      IBecomeHostPropertyFormData,
      | "addressLine1"
      | "addressLine2"
      | "city"
      | "state"
      | "country"
      | "postalCode"
      | "latitude"
      | "longitude"
    > & { propertyId: string },
  ): Promise<void> {
    const body = {
      propertyId: data.propertyId,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || undefined,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_LOCATION),
      {
        method: "PUT",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to save location"));
    }
  }

  async savePricing(
    data: Pick<
      IBecomeHostPropertyFormData,
      | "basePrice"
      | "currency"
      | "minNights"
      | "maxNights"
      | "maxGuests"
      | "checkInTime"
      | "checkOutTime"
    > & { propertyId: string },
  ): Promise<void> {
    const body = {
      propertyId: data.propertyId,
      basePrice: data.basePrice,
      currency: data.currency,
      minNights: data.minNights,
      maxNights: data.maxNights,
      maxGuests: data.maxGuests,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      cancellationPolicy: "flexible",
      enableWaitlist: false,
    };

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PRICING),
      {
        method: "PUT",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to save pricing"));
    }
  }

  async saveAmenities(
    data: Pick<IBecomeHostPropertyFormData, "amenities" | "rules"> & {
      propertyId: string;
    },
  ): Promise<void> {
    const amenities =
      data.amenities.length > 0
        ? data.amenities.map((name) => ({
            name,
            category: amenityCategory(name),
          }))
        : [{ name: "Essentials", category: "essentials" }];

    const rules =
      data.rules?.map((r) => ({
        ruleType: normalizeRuleType(r.type),
        allowed: r.allowed,
        description: r.description,
      })) ?? [];

    const body = {
      propertyId: data.propertyId,
      amenities,
      rules: rules.length > 0 ? rules : undefined,
    };

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_AMENITIES),
      {
        method: "PUT",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to save amenities"));
    }
  }

  async savePhotos(data: {
    propertyId: string;
    images: IImageUploadMetadata[];
  }): Promise<void> {
    const body = {
      propertyId: data.propertyId,
      images: data.images.map((img, i) => ({
        url: img.url,
        altText: img.altText,
        displayOrder: img.displayOrder ?? i,
        isPrimary: img.isPrimary ?? i === 0,
        fileSize: img.fileSize,
        mimeType: img.mimeType,
        thumbnailUrl: img.thumbnailUrl,
        caption: img.caption,
        width: img.width,
        height: img.height,
      })),
    };

    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PHOTOS),
      {
        method: "PUT",
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to save photos"));
    }
  }

  async publishDraft(data: {
    propertyId: string;
  }): Promise<{ propertyId: string; slug: string }> {
    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PUBLISH),
      {
        method: "POST",
        headers: getJsonHeaders(),
        body: JSON.stringify({ propertyId: data.propertyId }),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to publish property"));
    }

    const { data: d } = (await res.json()) as {
      data: { id: string; slug: string };
    };
    return { propertyId: d.id, slug: d.slug };
  }

  async resumeDraft(): Promise<IOnboardingDraftResume | null> {
    const res = await apiFetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT_RESUME),
      {
        method: "GET",
        headers: getJsonHeaders(),
      },
    );

    if (!res.ok) return null;

    const { data } = (await res.json()) as {
      data: IOnboardingDraftResume | null;
    };
    return data;
  }

  async getDraftDetails(
    propertyId: string,
  ): Promise<IBecomeHostPropertyFormData | null> {
    const url =
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT) +
      `?propertyId=${encodeURIComponent(propertyId)}`;

    const res = await apiFetch(url, {
      method: "GET",
      headers: getJsonHeaders(),
    });

    if (!res.ok) return null;

    // The API may return either a flat IBecomeHostPropertyFormData or a nested
    // shape that mirrors the onboarding request body. Normalise both.
    const { data } = (await res.json()) as { data: RawDraftApiResponse | null };
    if (!data) return null;
    return normalizeDraftResponse(data);
  }

  /** Fetch property data for the edit page — works for any status the host owns. */
  async getPropertyForEdit(propertyId: string): Promise<{
    form: IBecomeHostPropertyFormData;
    imageMetadata: IImageUploadMetadata[];
  } | null> {
    const url =
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT) +
      `?propertyId=${encodeURIComponent(propertyId)}`;

    const res = await apiFetch(url, {
      method: "GET",
      headers: getJsonHeaders(),
    });

    if (!res.ok) return null;

    const { data } = (await res.json()) as { data: RawDraftApiResponse | null };
    if (!data) return null;

    const form = normalizeDraftResponse(data);

    // Extract full image metadata from the response when available
    const rawImages = data.media?.images ?? [];
    const imageMetadata: IImageUploadMetadata[] = rawImages.map((img, i) => ({
      url: img.url,
      altText: img.altText,
      displayOrder: img.displayOrder ?? i,
      isPrimary: img.isPrimary ?? i === 0,
      fileSize: img.fileSize,
      mimeType: img.mimeType,
    }));

    return { form, imageMetadata };
  }
}
