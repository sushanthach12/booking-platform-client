export interface IWishlistRepository {
  getWishlist(params?: { page?: number; limit?: number }): Promise<unknown[]>;
  addToWishlist(propertyId: string): Promise<void>;
  removeFromWishlist(propertyId: string): Promise<void>;
}
