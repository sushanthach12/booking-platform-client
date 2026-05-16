"use client";

import { getWishlistUseCase } from "@/domain/di";
import { getCookie } from "@/lib/utils/cookies";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manages wishlist toggle state for a single property with optimistic UI.
 *
 * - Pass `initialWishlisted` (from the listing API response) to skip the status
 *   check entirely — zero extra requests per card.
 * - Omit it (or pass `undefined`) on pages like the property detail view where the
 *   initial state isn't known; the hook will fetch it once on mount.
 */
export function useWishlistToggle(
  propertyId: string,
  initialWishlisted?: boolean,
) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted ?? false);
  const [loading, setLoading] = useState(false);
  const didFetch = useRef(false);

  const isAuthed = useCallback(() => !!getCookie("auth_token"), []);

  // Only fetch status when no initial value was provided (e.g. property detail page)
  useEffect(() => {
    if (initialWishlisted !== undefined || didFetch.current || !isAuthed()) return;
    didFetch.current = true;
    let cancelled = false;
    getWishlistUseCase()
      .isWishlisted(propertyId)
      .then((v) => { if (!cancelled) setWishlisted(v); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [propertyId, initialWishlisted, isAuthed]);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthed() || loading) return;

      // Optimistic update — flip immediately
      const next = !wishlisted;
      setWishlisted(next);
      setLoading(true);

      try {
        if (next) {
          await getWishlistUseCase().addToWishlist(propertyId);
        } else {
          await getWishlistUseCase().removeFromWishlist(propertyId);
        }
      } catch {
        // Revert to previous state on failure
        setWishlisted(!next);
      } finally {
        setLoading(false);
      }
    },
    [propertyId, wishlisted, loading, isAuthed],
  );

  return { wishlisted, loading, toggle, isAuthed: isAuthed() };
}
