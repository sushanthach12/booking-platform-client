export const API_CONSTANTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  PREFIX: "/api/v1",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      REFRESH_TOKEN: "/auth/refresh",
    },
    USERS: {
      PROFILE: "/users/profile",
      ME: "/users/me",
      ME_BECOME_HOST: "/users/me/become-host",
      ME_WISHLIST: "/users/me/wishlist",
      ME_WISHLIST_ITEM: (propertyId: string) =>
        `/users/me/wishlist/${propertyId}`,
      ME_WISHLIST_STATUS: (propertyId: string) =>
        `/users/me/wishlist/${propertyId}/status`,
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
      ONBOARD_DRAFT: "/host/onboard/draft",
      ONBOARD_DRAFT_RESUME: "/host/onboard/draft/resume",
      ONBOARD_LOCATION: "/host/onboard/location",
      ONBOARD_PRICING: "/host/onboard/pricing",
      ONBOARD_AMENITIES: "/host/onboard/amenities",
      ONBOARD_PHOTOS: "/host/onboard/photos",
      ONBOARD_PUBLISH: "/host/onboard/publish",
    },
    PROPERTY_STATS: (propertyId: string) => `/properties/${propertyId}/stats`,
    PROPERTY_CALENDAR: (propertyId: string) =>
      `/properties/${propertyId}/calendar`,
    PROPERTY_CALENDAR_BLOCK: (propertyId: string) =>
      `/properties/${propertyId}/calendar/block`,
    PROPERTY_CALENDAR_UNBLOCK: (propertyId: string, blockId: string) =>
      `/properties/${propertyId}/calendar/${blockId}`,
    PROPERTY_IMAGES: (propertyId: string) => `/properties/${propertyId}/images`,
    PROPERTY_AMENITIES: (propertyId: string) =>
      `/properties/${propertyId}/amenities`,
    PROPERTY_AMENITIES_ALL: (propertyId: string) =>
      `/properties/${propertyId}/amenities/all`,
    BOOKINGS: {
      ROOT: "/bookings",
      CHECKOUT_PREVIEW: "/bookings/checkout/preview",
      CHECK_AVAILABILITY: "/bookings/check-availability",
      HOST: "/bookings/host",
      SUMMARY: "/bookings/summary",
      DETAILS: "/bookings/details",
      CONFIRM: (bookingId: string) => `/bookings/${bookingId}/confirm`,
      CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
      UPDATE_STATUS: (bookingId: string) => `/bookings/${bookingId}/status`,
      GET_STATUS: (bookingId: string) => `/bookings/${bookingId}/status`,
      RETRY_PAYMENT: (bookingId: string) => `/bookings/${bookingId}/retry-payment`,
    },
    PAYOUTS: {
      ROOT: "/payouts",
      UPCOMING: "/payouts/upcoming",
    },
    UPLOAD: {
      PRESIGN: "/storage/presign",
    },
  },
} as const;

/** Core API (gateway + versioned core prefix). */
export function apiUrl(path: string): string {
  return `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PREFIX}${path}`;
}

/** Presign lives under the core versioned prefix. */
export function uploadPresignUrl(): string {
  return `${API_CONSTANTS.BASE_URL}${API_CONSTANTS.PREFIX}${API_CONSTANTS.ENDPOINTS.UPLOAD.PRESIGN}`;
}
