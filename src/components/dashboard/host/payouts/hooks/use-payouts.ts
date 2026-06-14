"use client";

import { getPayoutUseCase } from "@/domain/di";
import type {
  IPayout,
  IPayoutAccount,
  IPayoutBalance,
  IPayoutEarnings,
  IPayoutSummary,
  IPayoutUpcoming,
} from "@/domain/interfaces";
import { toastError, toastSuccess } from "@/lib/utils/toast";
import { useCallback, useEffect, useState } from "react";

const EMPTY_SUMMARY: IPayoutSummary = {
  totalPaidOut: 0,
  paidOutSince: null,
  thisMonth: 0,
  currency: "INR",
};

const EMPTY_EARNINGS: IPayoutEarnings = {
  points: [],
  currency: "INR",
  yoyChange: null,
};

const EMPTY_BALANCE: IPayoutBalance = {
  payableNow: 0,
  onHold: { upcoming: 0, clearing: 0 },
  inTransit: 0,
  lifetimePaidOut: 0,
  availableBalance: 0,
  reserveBalance: 0,
  minPayoutThreshold: 0,
  currency: "INR",
};

interface PayoutsState {
  accounts: IPayoutAccount[];
  summary: IPayoutSummary;
  upcoming: IPayoutUpcoming | null;
  earnings: IPayoutEarnings;
  balance: IPayoutBalance;
  payouts: IPayout[];
  total: number;
  loading: boolean;
  requesting: boolean;
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
    balance: EMPTY_BALANCE,
    payouts: [],
    total: 0,
    loading: true,
    requesting: false,
  });

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const useCase = getPayoutUseCase();
      const [accounts, summary, upcoming, earnings, balance, history] =
        await Promise.all([
          useCase.getAccounts(),
          useCase.getSummary(),
          useCase.getUpcoming(),
          useCase.getEarnings(7),
          useCase.getBalance(),
          useCase.getPayouts({ page: 1, limit: 20 }),
        ]);

      if (signal?.cancelled) return;

      setState((prev) => ({
        ...prev,
        accounts,
        summary,
        upcoming,
        earnings,
        balance,
        payouts: history.items,
        total: history.total,
        loading: false,
      }));
    } catch (err) {
      if (signal?.cancelled) return;
      setState((prev) => ({ ...prev, loading: false }));
      toastError(err, "Failed to load payouts");
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

  /**
   * Triggers a host-initiated payout of the full payable balance, then reloads
   * so the balance + history reflect the new `processing` payout.
   */
  const requestPayout = useCallback(async () => {
    setState((prev) => ({ ...prev, requesting: true }));
    try {
      await getPayoutUseCase().requestPayout();
      toastSuccess("Payout requested. It's on its way to your account.");
      await load();
    } catch (err) {
      toastError(err, "Failed to request payout");
    } finally {
      setState((prev) => ({ ...prev, requesting: false }));
    }
  }, [load]);

  return { ...state, reload, requestPayout };
}
