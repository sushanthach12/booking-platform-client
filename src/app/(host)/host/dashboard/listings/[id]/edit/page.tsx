import { HostPropertyEditTemplate } from "@/components/host/templates/host-property-edit-template";
import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { IBecomeHostPropertyFormData } from "@/domain/entities";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HostPropertyEditPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/signin");

  const headers = { Authorization: `JWT ${token}` };

  // Try draft first, then fall back to live property
  let initialData: IBecomeHostPropertyFormData | null = null;

  try {
    const draftRes = await fetch(
      `${apiUrl(API_CONSTANTS.ENDPOINTS.HOST.ONBOARD_DRAFT)}?propertyId=${id}`,
      { headers, cache: "no-store" },
    );
    if (draftRes.ok) {
      const json: { data?: IBecomeHostPropertyFormData } = await draftRes.json();
      if (json.data) initialData = json.data;
    }
  } catch {
    // try live property below
  }

  if (!initialData) {
    try {
      const propRes = await fetch(
        `${apiUrl(API_CONSTANTS.ENDPOINTS.PROPERTIES.DETAILS)}?propertyId=${id}`,
        { headers, cache: "no-store" },
      );
      if (propRes.ok) {
        const json: { data?: Record<string, unknown> } = await propRes.json();
        const d = json.data;
        if (d) {
          const pricing = (typeof d.pricing === "object" && d.pricing
            ? d.pricing
            : {}) as Record<string, unknown>;
          initialData = {
            title: String(d.title ?? ""),
            description: String(d.description ?? ""),
            propertyType: String(d.propertyType ?? ""),
            addressLine1: String(d.addressLine1 ?? d.address ?? ""),
            addressLine2: String(d.addressLine2 ?? ""),
            city: String(d.city ?? ""),
            state: String(d.state ?? ""),
            country: String(d.country ?? ""),
            postalCode: String(d.postalCode ?? ""),
            latitude: typeof d.latitude === "number" ? d.latitude : 40.7128,
            longitude: typeof d.longitude === "number" ? d.longitude : -74.006,
            basePrice: typeof pricing.amount === "number" ? pricing.amount : (typeof d.basePrice === "number" ? d.basePrice : 0),
            currency: typeof pricing.currency === "string" ? pricing.currency : "USD",
            minNights: typeof d.minNights === "number" ? d.minNights : 1,
            maxNights: typeof d.maxNights === "number" ? d.maxNights : 30,
            maxGuests: typeof d.maxGuests === "number" ? d.maxGuests : 1,
            checkInTime: typeof d.checkInTime === "string" ? d.checkInTime : "15:00",
            checkOutTime: typeof d.checkOutTime === "string" ? d.checkOutTime : "11:00",
            amenities: Array.isArray(d.amenities) ? (d.amenities as string[]) : [],
            rules: Array.isArray(d.rules)
              ? (d.rules as Array<{ type: string; allowed: boolean; description?: string }>)
              : [],
            images: [],
          };
        }
      }
    } catch {
      // fall through with null
    }
  }

  return <HostPropertyEditTemplate propertyId={id} initialData={initialData} />;
}
