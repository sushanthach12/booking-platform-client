import { API_CONSTANTS, apiUrl } from '@/domain/constants/api.constant';
import type {
  IBecomeHostPropertyFormData,
  IImageUploadMetadata,
  IOnboardingDraftResume,
} from '@/domain/entities';
import { AMENITIES } from '@/domain/entities';
import type { IHostPropertyRepository } from '@/domain/interfaces';
import { parseApiError } from '@/lib/utils/api-error';
import { getJsonHeaders } from '@/lib/utils/auth-headers';
import 'reflect-metadata';
import { injectable } from 'tsyringe';

const BACKEND_PROPERTY_TYPES = new Set([
  'apartment',
  'house',
  'villa',
  'cabin',
  'condo',
  'townhouse',
  'studio',
  'loft',
  'other',
]);

function normalizePropertyType(raw: string): string {
  const v = raw.trim().toLowerCase();
  return BACKEND_PROPERTY_TYPES.has(v) ? v : 'apartment';
}

function amenityCategory(name: string): string {
  const found = AMENITIES.find(
    (a) => a.name.toLowerCase() === name.trim().toLowerCase(),
  );
  return (found?.category ?? 'GENERAL').toLowerCase();
}

function normalizeRuleType(raw: string): string {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  const allowed = new Set([
    'pets',
    'smoking',
    'parties',
    'quiet_hours',
    'check_in_time',
    'check_out_time',
    'max_guests',
    'no_shoes',
    'no_alcohol',
    'no_smoking',
    'other',
  ]);
  return allowed.has(key) ? key : 'other';
}

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
        : [{ name: 'Essentials', category: 'essentials' }];

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
        cancellationPolicy: 'flexible',
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

    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD), {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Host onboarding failed'));
    }

    const { data } = (await res.json()) as { data: { id: string } };
    return { id: data.id };
  }

  async createDraft(
    data: Pick<
      IBecomeHostPropertyFormData,
      'title' | 'description' | 'propertyType'
    >,
  ): Promise<{ propertyId: string; slug: string }> {
    const body = {
      propertyType: normalizePropertyType(data.propertyType),
      title: data.title,
      description: data.description,
    };

    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT),
      {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(
        await parseApiError(res, 'Failed to create draft property'),
      );
    }

    const { data: d } = (await res.json()) as {
      data: { id: string; slug: string };
    };
    return { propertyId: d.id, slug: d.slug };
  }

  async saveLocation(
    data: Pick<
      IBecomeHostPropertyFormData,
      | 'addressLine1'
      | 'addressLine2'
      | 'city'
      | 'state'
      | 'country'
      | 'postalCode'
      | 'latitude'
      | 'longitude'
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

    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_LOCATION),
      {
        method: 'PUT',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Failed to save location'));
    }
  }

  async savePricing(
    data: Pick<
      IBecomeHostPropertyFormData,
      | 'basePrice'
      | 'currency'
      | 'minNights'
      | 'maxNights'
      | 'maxGuests'
      | 'checkInTime'
      | 'checkOutTime'
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
      cancellationPolicy: 'flexible',
      enableWaitlist: false,
    };

    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PRICING),
      {
        method: 'PUT',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Failed to save pricing'));
    }
  }

  async saveAmenities(
    data: Pick<IBecomeHostPropertyFormData, 'amenities' | 'rules'> & {
      propertyId: string;
    },
  ): Promise<void> {
    const amenities =
      data.amenities.length > 0
        ? data.amenities.map((name) => ({
            name,
            category: amenityCategory(name),
          }))
        : [{ name: 'Essentials', category: 'essentials' }];

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

    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_AMENITIES),
      {
        method: 'PUT',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Failed to save amenities'));
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

    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PHOTOS),
      {
        method: 'PUT',
        headers: getJsonHeaders(),
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Failed to save photos'));
    }
  }

  async publishDraft(data: {
    propertyId: string;
  }): Promise<{ propertyId: string; slug: string }> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_PUBLISH),
      {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify({ propertyId: data.propertyId }),
      },
    );

    if (!res.ok) {
      throw new Error(await parseApiError(res, 'Failed to publish property'));
    }

    const { data: d } = (await res.json()) as {
      data: { id: string; slug: string };
    };
    return { propertyId: d.id, slug: d.slug };
  }

  async resumeDraft(): Promise<IOnboardingDraftResume | null> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT_RESUME),
      {
        method: 'GET',
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

    const res = await fetch(url, {
      method: 'GET',
      headers: getJsonHeaders(),
    });

    if (!res.ok) return null;

    const { data } = (await res.json()) as {
      data: IBecomeHostPropertyFormData | null;
    };
    return data;
  }
}
