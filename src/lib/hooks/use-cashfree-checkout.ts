'use client';

import {
  load,
  type CashfreeInstance,
  type CashfreeCheckoutOptions,
  type CashfreeCheckoutResult,
  type CashfreeMode,
} from '@cashfreepayments/cashfree-js';
import { useCallback, useRef } from 'react';

const MODE: CashfreeMode =
  (process.env.NEXT_PUBLIC_CASHFREE_MODE as CashfreeMode) ?? 'sandbox';

export type { CashfreeCheckoutOptions, CashfreeCheckoutResult };

export function useCashfreeCheckout() {
  const cashfreeRef = useRef<CashfreeInstance | null>(null);

  const checkout = useCallback(
    async (options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult> => {
      if (!cashfreeRef.current) {
        cashfreeRef.current = await load({ mode: MODE });
      }

      const cashfree = cashfreeRef.current;
      if (!cashfree) {
        return { error: { message: 'Cashfree failed to load', type: 'load_error' } };
      }

      return cashfree.checkout(options);
    },
    [],
  );

  return { checkout };
}
