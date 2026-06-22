"use client";

import { getPropertyUseCase } from "@/domain/di";
import type { HomeData } from "@/domain/entities";
import { useEffect, useState } from "react";

interface UseHomeDataState {
  data: HomeData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches the aggregated homepage data (featured + nearby + destinations) on
 * the client. The call runs in the browser — not on the server — because the
 * API's CDN bot protection blocks server-to-server requests from the deploy
 * host, while normal browser traffic passes.
 */
export function useHomeData(location: string): UseHomeDataState {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // `location` is fixed for the homepage, so this runs once on mount; initial
    // state (isLoading: true, error: null) already covers the loading phase.
    let active = true;

    getPropertyUseCase()
      .getHomeData(location)
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) {
          setError("We couldn't load stays right now. Please refresh.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location]);

  return { data, isLoading, error };
}
