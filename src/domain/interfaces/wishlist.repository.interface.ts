import type { WishlistItem } from "@/domain/entities";

export interface IWishlistRepository {
  getWishlist(params?: { page?: number; limit?: number }): Promise<WishlistItem[]>;
  addToWishlist(propertyId: string): Promise<void>;
  removeFromWishlist(propertyId: string): Promise<void>;
  isWishlisted(propertyId: string): Promise<boolean>;
}
