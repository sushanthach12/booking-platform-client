"use client";

import { getPropertyUseCase } from "@/domain/di";
import type { PropertyEntity } from "@/domain/entities";
import { useState } from "react";

interface UseNearbyLocationArgs {
  /** Location label shown initially (server-resolved). */
  initialLocation: string;
  /** Properties rendered before any location change (server-fetched). */
  initialProperties: PropertyEntity[];
}

interface UseNearbyLocationState {
  location: string;
  properties: PropertyEntity[];
  isLoading: boolean;
  error: string | null;
  /** Refetch the nearby rail for a new location and update the label. */
  changeLocation: (next: string) => Promise<void>;
}

/**
 * Owns the "stays near {location}" rail state. Re-fetches the homepage nearby
 * list through the property use case whenever the guest picks a new location.
 */
export function useNearbyLocation({
  initialLocation,
  initialProperties,
}: UseNearbyLocationArgs): UseNearbyLocationState {
  const [location, setLocation] = useState(initialLocation);
  const [properties, setProperties] = useState(initialProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeLocation = async (next: string): Promise<void> => {
    const trimmed = next.trim();
    setLocation(trimmed);
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPropertyUseCase().getHomeData(trimmed || undefined);
      setProperties(data.nearby);
    } catch {
      setError("Couldn't load stays for that location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { location, properties, isLoading, error, changeLocation };
}
