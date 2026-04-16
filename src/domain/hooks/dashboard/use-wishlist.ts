"use client";

import { getWishlistUseCase } from "@/domain/di";
import { useCallback, useEffect, useState } from "react";

export function useWishlist() {
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWishlistUseCase().getWishlist();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = useCallback(async (propertyId: string) => {
    await getWishlistUseCase().addToWishlist(propertyId);
    await fetchWishlist();
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (propertyId: string) => {
    await getWishlistUseCase().removeFromWishlist(propertyId);
    setItems((prev) =>
      prev.filter((item) => (item as Record<string, unknown>).propertyId !== propertyId),
    );
  }, []);

  return { items, loading, error, addToWishlist, removeFromWishlist, refetch: fetchWishlist };
}
