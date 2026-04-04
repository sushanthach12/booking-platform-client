export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  PREFIX: "/api/core/v1",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
    },
    USERS: {
      PROFILE: "/users/profile",
    },
    PROPERTIES: {
      LISTING: "/properties/listing",
      SEARCH: "/properties/search",
      DETAILS: "/properties/details",
      NEARBY: "/properties/nearby",
      ROOT: "/properties",
      HOST_ME: "/properties/host/me",
      ANALYTICS: "/properties/analytics",
      AVAILABILITY: "/properties/availability",
      AVAILABILITY_RANGE: "/properties/availability/range",
      AVAILABILITY_BULK: "/properties/availability/bulk",
      STATUS: "/properties/status",
    },
    HOST: {
      ONBOARD: "/host/onboard",
    },
    PROPERTY_IMAGES: (propertyId: string) => `/properties/${propertyId}/images`,
    PROPERTY_AMENITIES: (propertyId: string) => `/properties/${propertyId}/amenities`,
    PROPERTY_AMENITIES_ALL: (propertyId: string) =>
      `/properties/${propertyId}/amenities/all`,
    BOOKINGS: {
      ROOT: "/bookings",
      CHECKOUT_PREVIEW: "/bookings/checkout/preview",
      CHECK_AVAILABILITY: "/bookings/check-availability",
      HOST: "/bookings/host",
      DETAILS: "/bookings/details",
      CONFIRM: (bookingId: string) => `/bookings/${bookingId}/confirm`,
      CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
    },
    UPLOAD: {
      PRESIGN: "/upload/presign",
    },
  },
} as const;

/** Core API (gateway + versioned core prefix). */
export function apiUrl(path: string): string {
  return `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PREFIX}${path}`;
}

/** Presign is not under `/api/core/v1` in this stack — direct to gateway root. */
export function uploadPresignUrl(): string {
  return `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.ENDPOINTS.UPLOAD.PRESIGN}`;
}
