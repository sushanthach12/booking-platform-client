import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import { AMENITIES } from "@/domain/entities";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";
import type { IHostPropertyRepository } from "@/domain/interfaces";

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

@injectable()
export class HostPropertyRepository implements IHostPropertyRepository {
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

    const res = await fetch(apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD), {
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
}
