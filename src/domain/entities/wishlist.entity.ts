export interface WishlistPropertySnapshot {
  title: string;
  coverImage: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  basePrice: number | null;
  currency: string | null;
}

export interface WishlistItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property: WishlistPropertySnapshot | null;
}
