"use client";

import { getPayoutUseCase } from "@/domain/di";
import type {
  IPayout,
  IPayoutAccount,
  IPayoutEarnings,
  IPayoutSummary,
  IPayoutUpcoming,
} from "@/domain/interfaces";
import { useCallback, useEffect, useState } from "react";

const EMPTY_SUMMARY: IPayoutSummary = {
  totalPaidOut: 0,
  paidOutSince: null,
  thisMonth: 0,
  currency: "USD",
};

const EMPTY_EARNINGS: IPayoutEarnings = {
  points: [],
  currency: "USD",
  yoyChange: null,
};

interface PayoutsState {
  accounts: IPayoutAccount[];
  summary: IPayoutSummary;
  upcoming: IPayoutUpcoming | null;
  earnings: IPayoutEarnings;
  payouts: IPayout[];
  total: number;
  loading: boolean;
  error: string | null;
}

/**
 * Loads everything the Payouts screen needs in one shot: linked accounts,
 * headline summary, the next upcoming payout, the earnings chart series, and
 * the payout history. Exposes a `reload()` for use after mutations (e.g. once
 * a new payout account is added).
 */
export function usePayouts() {
  const [state, setState] = useState<PayoutsState>({
    accounts: [],
    summary: EMPTY_SUMMARY,
    upcoming: null,
    earnings: EMPTY_EARNINGS,
    payouts: [],
    total: 0,
    loading: true,
    error: null,
  });

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const useCase = getPayoutUseCase();
      const [accounts, summary, upcoming, earnings, history] =
        await Promise.all([
          useCase.getAccounts(),
          useCase.getSummary(),
          useCase.getUpcoming(),
          useCase.getEarnings(7),
          useCase.getPayouts({ page: 1, limit: 20 }),
        ]);

      if (signal?.cancelled) return;

      setState({
        accounts,
        summary,
        upcoming,
        earnings,
        payouts: history.items,
        total: history.total,
        loading: false,
        error: null,
      });
    } catch (err) {
      if (signal?.cancelled) return;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load payouts",
      }));
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const reload = useCallback(() => load(), [load]);

  return { ...state, reload };
}
