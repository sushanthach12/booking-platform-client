import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { WishlistItem } from "@/domain/entities";
import type { IWishlistRepository } from "@/domain/interfaces";
import { parseApiError } from "@/lib/utils/api-error";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import "reflect-metadata";
import { injectable } from "tsyringe";

@injectable()
export class WishlistRepository implements IWishlistRepository {
  async getWishlist(params?: {
    page?: number;
    limit?: number;
  }): Promise<WishlistItem[]> {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    const url = `${apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST)}${q.toString() ? `?${q}` : ""}`;
    const res = await fetch(url, { headers: getJsonHeaders() });
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to load wishlist"));
    }
    const json: { data?: WishlistItem[] } = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  }

  async addToWishlist(propertyId: string): Promise<void> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_ITEM(propertyId)),
      { method: "POST", headers: getJsonHeaders() },
    );
    if (!res.ok) {
      throw new Error(await parseApiError(res, "Failed to add to wishlist"));
    }
  }

  async removeFromWishlist(propertyId: string): Promise<void> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_ITEM(propertyId)),
      { method: "DELETE", headers: getJsonHeaders() },
    );
    if (!res.ok) {
      throw new Error(
        await parseApiError(res, "Failed to remove from wishlist"),
      );
    }
  }

  async isWishlisted(propertyId: string): Promise<boolean> {
    const res = await fetch(
      apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_STATUS(propertyId)),
      { headers: getJsonHeaders() },
    );
    if (!res.ok) return false;
    const json: { data?: { wishlisted?: boolean } } = await res.json();
    return json.data?.wishlisted ?? false;
  }
}
