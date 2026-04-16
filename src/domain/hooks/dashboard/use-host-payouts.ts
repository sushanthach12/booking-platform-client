"use client";

import { getPayoutUseCase } from "@/domain/di";
import type { IPayout } from "@/domain/interfaces";
import { useEffect, useState } from "react";

export function useHostPayouts() {
  const [payouts, setPayouts] = useState<IPayout[]>([]);
  const [upcoming, setUpcoming] = useState<{
    amount: number;
    currency: string;
    scheduledDate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [result, upcomingData] = await Promise.all([
          getPayoutUseCase().getPayouts({ page: 1, limit: 20 }),
          getPayoutUseCase().getUpcoming(),
        ]);
        if (!cancelled) {
          setPayouts(result.items);
          setTotal(result.total);
          setUpcoming(upcomingData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { payouts, upcoming, loading, total };
}
