import { API_CONSTANTS, apiUrl } from "@/domain/constants/api.constant";
import type { WishlistItem } from "@/domain/entities";
import type { IWishlistRepository } from "@/domain/interfaces";
import { getJsonHeaders } from "@/lib/utils/auth-headers";
import { request, requestVoid } from "@/domain/http";
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
    const json = await request<{ data?: WishlistItem[] }>(url, {
      headers: getJsonHeaders(),
      fallbackMessage: "Failed to load wishlist",
    });
    return Array.isArray(json.data) ? json.data : [];
  }

  async addToWishlist(propertyId: string): Promise<void> {
    await requestVoid(
      apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_ITEM(propertyId)),
      {
        method: "POST",
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to add to wishlist",
      },
    );
  }

  async removeFromWishlist(propertyId: string): Promise<void> {
    await requestVoid(
      apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_ITEM(propertyId)),
      {
        method: "DELETE",
        headers: getJsonHeaders(),
        fallbackMessage: "Failed to remove from wishlist",
      },
    );
  }

  async isWishlisted(propertyId: string): Promise<boolean> {
    // Status check is best-effort: any failure means "not wishlisted".
    try {
      const json = await request<{ data?: { wishlisted?: boolean } }>(
        apiUrl(API_CONSTANTS.ENDPOINTS.USERS.ME_WISHLIST_STATUS(propertyId)),
        { headers: getJsonHeaders() },
      );
      return json.data?.wishlisted ?? false;
    } catch {
      return false;
    }
  }
}
