declare module "@cashfreepayments/cashfree-js" {
  export type CashfreeMode = "sandbox" | "production";

  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    returnUrl: string;
  }

  export interface CashfreeCheckoutResult {
    paymentDetails?: { paymentMessage: string };
    error?: { message: string; type: string };
    redirect?: boolean;
  }

  export interface CashfreeInstance {
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
  }

  export function load(options: { mode: CashfreeMode }): Promise<CashfreeInstance | null>;
}
