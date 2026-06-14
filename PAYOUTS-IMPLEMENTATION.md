# Web — Payout Screen Changes: Implementation Procedure

> Actionable build spec for the web app. Source of truth for decisions: [`../PAYOUTS-AND-GAPS-PLAN.md`](../PAYOUTS-AND-GAPS-PLAN.md). Backend contract: [`../backend/PAYOUTS-IMPLEMENTATION.md`](../backend/PAYOUTS-IMPLEMENTATION.md).
> **No code in this doc** — states *what* changes, *where*, following existing conventions.

---

## Good news: most of it already exists

The host Payout screen is already built and HTTP-wired:

- Page: `src/app/(core)/dashboard/host/payouts/page.tsx` → `PayoutsTemplate` → `PayoutsView`.
- Components: `payout-stats`, `payout-history`, `earnings-chart`, `payout-accounts-card`, `add-payout-method-modal` (full bank-account wizard with IFSC/account validation).
- Data layer: `PayoutUseCase`, `IPayoutRepository` + `PayoutRepository` (real HTTP via `request<T>`), DI tokens in `domain/di/types.ts` + getter `getPayoutUseCase()`, endpoints in `domain/constants/api.constant.ts`, hook `components/dashboard/host/payouts/hooks/use-payouts.ts`.

**So the work is additive**, not greenfield. Two new capabilities: **(A) show payable + on-hold balance**, and **(B) host-initiated "Pay out" action**. Plus small transparency tweaks.

---

## Conventions to follow (existing, do not deviate)

- HTTP only inside the repository, called via the use case, surfaced through the `use-payouts` hook. **Never fetch from components.**
- Repo methods use `request<T>(apiUrl(API_CONSTANTS.ENDPOINTS.PAYOUTS.*), { headers: getJsonHeaders(), fallbackMessage })`.
- Page → `*-template.tsx` (server) → `*-view.tsx` (`"use client"`). Components < ~200 lines.
- Use shadcn components; prompt to install if missing.
- **No timezone math on the client** — backend sends UTC ISO strings; format for display only (e.g. `becomesPayableOn`).

---

## Change 1 — New API endpoints

`src/domain/constants/api.constant.ts` → `ENDPOINTS.PAYOUTS`:
- add `BALANCE: "/payouts/balance"`
- add `REQUEST: "/payouts/request"`

---

## Change 2 — Interfaces (`src/domain/interfaces/payout.repository.interface.ts`)

- New `IPayoutBalance`:
  - `payableNow: number` — withdrawable now (`available − reserve`, gated by threshold)
  - `onHold: { upcoming: number; clearing: number }` — incoming, not yet payable
  - `inTransit: number` — dispatched, awaiting confirmation
  - `lifetimePaidOut: number`
  - `reserveBalance: number`, `minPayoutThreshold: number`, `currency: string`
- New `IRequestPayoutResult` — `{ payoutId: string; amount: number; status: string }`.
- Extend `IPayoutAccount` with `beneficiaryStatus?: "VERIFIED" | "INITIATED" | "INVALID" | "FAILED"` (gates whether payout is allowed).
- Optional: extend payout/earning history items with per-booking `gross`, `platformFee`, `net`, and `becomesPayableOn?` (clearing lines) for transparency.
- Add to `IPayoutRepository`: `getBalance(): Promise<IPayoutBalance>` and `requestPayout(): Promise<IRequestPayoutResult>`.

---

## Change 3 — Repository (`src/data/repositories/payout.repository.ts`)

- `getBalance()` → GET `PAYOUTS.BALANCE`, `fallbackMessage: "Failed to load balance"`.
- `requestPayout()` → POST `PAYOUTS.REQUEST` (no body; backend computes payable), `fallbackMessage: "Failed to request payout"`.

---

## Change 4 — Use case (`src/domain/use-cases/payout.use-case.ts`)

- `getBalance()` → `repo.getBalance()`.
- `requestPayout()` → `repo.requestPayout()`.

---

## Change 5 — Hook (`src/components/dashboard/host/payouts/hooks/use-payouts.ts`)

- Add `balance` to state; include `getBalance()` in the existing `Promise.all` load.
- Add `requestPayout()` action: calls use case, then `reload()` to refresh balance + history; `toastError` on failure, success toast on ok. Track a `requesting` flag for button state.

---

## Change 6 — UI

### 6a. Payable balance card (new) — `components/payable-balance-card.tsx`
- Hero number: **Payable now** + currency. Primary **"Pay out"** button.
- Button disabled with helper text when:
  - `payableNow < minPayoutThreshold` → "Minimum ₹X to pay out"
  - no `VERIFIED` account → "Add a verified bank account first"
  - `requesting` in flight → spinner.
- Confirmation step (shadcn dialog) before calling `requestPayout()`.

### 6b. On-hold breakdown (new) — `components/on-hold-card.tsx`
- Show **On hold** = `upcoming + clearing`, with the two sub-lines explained:
  - *Upcoming* — from confirmed bookings, stay not finished.
  - *Clearing* — completed, releases on `becomesPayableOn` (per-line date).
- This is the host's "money coming in" view (replaces a literal "wallet"). **No "wallet" wording.**

### 6c. Reuse existing
- `payout-stats` — add `inTransit` + `lifetimePaidOut` from balance.
- `payout-history` — optionally show per-row gross / platform fee / net (commission transparency).
- `payout-accounts-card` — show `beneficiaryStatus` badge (Verified / Pending / Invalid).
- `add-payout-method-modal` — handle non-`VERIFIED` responses (show pending/invalid message); optionally add UPI option once backend supports it.

### 6d. States
- Loading skeletons (existing pattern), empty state (no earnings yet), error toasts.

---

## Out of scope (web)
- No commission *calculation* on the client — backend sends computed `platformFee`/`net`.
- No release/scheduling logic on the client — backend-driven; the screen just reflects balance states.

---

## Verification
- `payableNow` reflects backend; "Pay out" disabled until threshold + verified account.
- Requesting a payout creates a `processing` payout, moves amount to `inTransit`, history updates after `reload()`.
- On-hold shows upcoming + clearing with correct `becomesPayableOn` dates (UTC → local display only).
- `pnpm run lint && pnpm run build` clean.
