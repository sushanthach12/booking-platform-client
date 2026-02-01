# Auth, Account & Payment — Design & Architecture

Design direction and architecture for **auth**, **account**, and **payment** areas. Uses a **subtle black/white/grey** palette with optional subtle accents (no Airbnb-style brand colors). All **state and API handling** live in **templates**; child components receive props.

**Related:**

- [Design Reference](./design_reference.md) — Main UI/layout.
- [Booking Platform](./booking_platform.md) — Backend APIs, DB, users, payments.
- [Implementation](./implementation.md) — Phased build plan.

---

## 1. Design Direction

### 1.1 Palette: Black, White, Grey + Subtle Accents

- **Background:** White (`#fff` / `oklch(1 0 0)`) or off-white; dark mode: near-black.
- **Foreground / text:** Black or dark grey; secondary text: mid grey.
- **Borders / dividers:** Light grey; no strong color.
- **Surfaces (cards, inputs):** White or very light grey; subtle borders.
- **Accents:** Optional, minimal — e.g. a single muted blue or green for primary actions, or keep primary as dark grey/black. No red/orange brand blocks.
- **Destructive (errors, delete):** Muted red or dark grey, not bright.

Use CSS variables already in `globals.css` (`--background`, `--foreground`, `--primary`, `--muted`, etc.) and tune them to this B&W/grey scheme so auth/account/payment feel consistent and calm.

### 1.2 Auth Pages (Design Inspiration)

- **Sign in:** Centered card; email + password; “Sign in”; link to “Sign up” and “Forgot password?”. Minimal copy, no heavy imagery.
- **Sign up:** Same layout; email, password, name (optional fields as needed); “Create account”; link to “Sign in”.
- **Forgot password:** Email only; “Send reset link”; back to sign in.
- **Reset password:** New password + confirm; “Reset password”.

Layout: full-bleed background (white or light grey), single column, narrow form card, no sidebar.

### 1.3 Account Page (Design Inspiration)

- **Profile:** Avatar, display name, email (read-only or editable), phone; “Save” when editable.
- **Security:** Change password; optional 2FA toggle.
- **Preferences:** Notifications, language, timezone if needed later.
- **Bookings / Trips:** List of user’s bookings (guest); link to each booking detail.
- **Listings / Host:** If host role, list of own properties; link to manage.
- **Waitlist & Price alerts:** Links or inline list to waitlist entries and price alerts (backend: `GET /api/v1/waitlist`, `GET /api/v1/price-alerts`).

Layout: AppLayout + main content; account nav (tabs or sidebar) for Profile / Security / Bookings / etc. Cards/sections per area; lists simple and scannable.

### 1.4 Payment Page (Design Inspiration)

- **Checkout / Pay for booking:** Booking summary (property, dates, guests, price breakdown); payment method selector (card, etc.); “Pay” button; idempotency handled by backend.
- **Payment method management (account):** List saved methods; add new; remove. Backend: host_payout_methods, or guest payment methods if API exists.
- **Booking confirmation:** After successful payment, confirmation view (booking details, receipt, next steps).

Layout: Same AppLayout; content area = summary + payment form or list of methods. No decorative color; use grey and one subtle accent for primary CTA if desired.

---

## 2. Template-Centric Data Flow

### 2.1 Principle

- **Templates** own:
  - Initial API call(s) for the screen.
  - All state (via hooks) for that screen.
  - Data transformation (API response → UI shape) via utils or hooks.
- **Child components** are presentational: they receive **props** (data + callbacks) from the template. No direct use-case or API calls in leaf components.

This keeps API and state in one place and makes it easier to refactor and test.

### 2.2 Current Project Structure (Data Flow)

```
app/
  page.tsx              → getPropertyUseCase().getProperties() in page; passes to ListingGrid
  search/page.tsx      → getPropertyUseCase().getProperties() in page; passes to PropertyCard list
  properties/[id]/page.tsx → getPropertyUseCase().getPropertyById(id) in page; inline layout + cards
components/
  property/
    templates/
      property-list.tsx   → async server component; fetches via use-case; returns ListingGrid (good pattern)
      property.template.tsx → legacy stub (raw list)
```

- **Good:** `property-list.tsx` is a template that fetches and passes data to `ListingGrid`.
- **To align:** Move property detail logic into a **PropertyDetailsTemplate**: it runs the initial `getPropertyById` (and any extra calls, e.g. availability), holds state/hooks, uses data utils to map API → UI, and passes props to presentational children (gallery, title block, host card, booking widget).

### 2.3 Template Shape (Generic)

For any screen that needs API + state:

1. **Template (server or client):**

   - Fetches data (use-case or API client).
   - Optionally uses hooks for local state (e.g. form state, selected tab, modal open).
   - Uses **data utils / hooks** to convert API DTOs → entities or UI models.
   - Renders one or more **child components** and passes:
     - `data` (converted)
     - `onAction` callbacks (e.g. `onSubmit`, `onSave`) that the template implements (and may call use-case/API again).

2. **Child components:**

   - Receive `data` and `onAction` via props.
   - No `getXUseCase()` or `fetch()` inside them.

3. **Page (app route):**
   - Minimal: resolves params (e.g. `id`), renders layout + template, passes params to template.

Example (property detail):

- **Page:** `app/properties/[id]/page.tsx` → `<AppLayout><PropertyDetailsTemplate propertyId={id} /></AppLayout>`.
- **PropertyDetailsTemplate:** Fetches property (and availability if needed) via use-case; maps to UI model with `mapPropertyToDetailView()`; holds state for booking form / modal; passes `property`, `availability`, `onReserve`, etc. to `PropertyDetailView` (presentational).
- **PropertyDetailView:** Only props; renders gallery, title, host card, booking widget.

Same idea for **AuthTemplate** (sign in/up), **AccountTemplate** (profile, bookings, waitlist, price alerts), **PaymentTemplate** (checkout or payment methods).

---

## 3. Backend Alignment (booking_platform.md)

### 3.1 Users & Auth

- **Table:** `users` — id, email, password_hash, name, phone, avatar_url, email_verified, phone_verified, role (guest, host, admin), status, last_login_at.
- **Security:** `user_sessions`, `password_reset_tokens`, `email_verification_tokens`.
- **Implied APIs (to be implemented on backend):** Sign in, sign up, sign out, forgot password, reset password, session/me. Frontend assumes something like:
  - `POST /api/v1/auth/signin`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/signout`
  - `GET /api/v1/auth/me` or `GET /api/v1/users/me`
  - Forgot/reset: `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`

### 3.2 Account-Scoped Data

- **Bookings:** `GET /api/v1/bookings` (user’s bookings) or `GET /api/v1/bookings/my`.
- **Waitlist:** `GET /api/v1/waitlist` — user’s waitlist entries.
- **Price alerts:** `GET /api/v1/price-alerts` — user’s active alerts.
- **Profile:** PATCH `/api/v1/users/me` (or similar) for name, phone, avatar.
- **Host:** If user is host, list properties (backend may expose `GET /api/v1/users/me/properties` or use existing properties search filtered by host).

### 3.3 Payments

- **Table:** `payments` — booking_id, amount, currency, payment_method, status, etc.
- **API:** `POST /api/v1/payments` — body: booking_id, amount, payment_method; returns payment result.
- **Booking flow:** `POST /api/v1/bookings` returns booking with payment intent; then frontend calls `POST /api/v1/payments` or backend ties payment to booking. Idempotency via header (e.g. `X-Idempotency-Key`).
- **Payouts (host):** `host_payout_methods`, `payouts` — account “Payment” or “Payouts” section for hosts.

---

## 4. Minimal Scope (What to Build)

### 4.1 Auth

- **Routes:** `/signin`, `/signup`, `/forgot-password`, `/reset-password?token=...`.
- **Templates:** `AuthSignInTemplate`, `AuthSignUpTemplate`, `AuthForgotPasswordTemplate`, `AuthResetPasswordTemplate`. Each: one API call (or mutation) + form state; data utils if API returns user/session; pass props to small form components.
- **Components:** `SignInForm`, `SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm` (presentational; receive values + `onSubmit`, `onChange` from template).
- **Domain:** `UserEntity` (or reuse from backend DTO); auth use-case/repository (sign in, sign up, forgot, reset) when backend exists.

### 4.2 Account

- **Route:** `/account` (or `/account/profile`, `/account/bookings`, etc.).
- **Template:** `AccountTemplate` — fetches user (and optionally bookings, waitlist, price alerts) in one place; tabs or sub-routes for Profile / Bookings / Waitlist / Price alerts; passes data and handlers to children.
- **Components:** `ProfileSection`, `BookingsList`, `WaitlistList`, `PriceAlertsList` — all receive data and callbacks from template.
- **Domain:** User, Booking, WaitlistEntry, PriceAlert entities and use-cases aligned with backend.

### 4.3 Payment

- **Routes:** `/bookings/[id]/pay` (checkout for a booking), `/account/payment-methods` (optional).
- **Templates:** `PaymentCheckoutTemplate` (booking id from route; fetch booking, then submit payment), `PaymentMethodsTemplate` (list/add/remove methods if API exists).
- **Components:** `CheckoutSummary`, `PaymentForm` (card input, pay button); `PaymentMethodsList` — presentational; template passes booking, amount, `onPay`, etc.
- **Domain:** Booking entity, Payment use-case/repository (POST payment, GET payment methods if any).

### 4.4 Shared

- **Layout:** Auth pages use a simple **AuthLayout** (no sidebar; centered content). Account and Payment use existing **AppLayout**.
- **UI:** Reuse existing Card, Button, Input, etc.; style with B&W/grey + subtle accent in `globals.css` so auth/account/payment match.

---

## 5. File Layout (Suggested)

```
src/
├── app/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── account/
│   │   ├── page.tsx
│   │   └── payment-methods/page.tsx  (optional)
│   └── bookings/
│       └── [id]/
│           └── pay/page.tsx
├── components/
│   ├── auth/
│   │   ├── templates/
│   │   │   ├── sign-in-template.tsx
│   │   │   ├── sign-up-template.tsx
│   │   │   └── ...
│   │   ├── sign-in-form.tsx
│   │   ├── sign-up-form.tsx
│   │   └── auth-layout.tsx
│   ├── account/
│   │   ├── templates/
│   │   │   └── account-template.tsx
│   │   ├── profile-section.tsx
│   │   ├── bookings-list.tsx
│   │   └── ...
│   ├── payment/
│   │   ├── templates/
│   │   │   ├── checkout-template.tsx
│   │   │   └── payment-methods-template.tsx
│   │   ├── checkout-summary.tsx
│   │   └── payment-form.tsx
│   └── property/
│       └── templates/
│           ├── property-list.tsx
│           └── property-details-template.tsx  (refactor from [id]/page)
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── booking.entity.ts
│   │   └── ...
│   ├── use-cases/
│   │   ├── auth.use-case.ts
│   │   ├── user.use-case.ts
│   │   ├── booking.use-case.ts
│   │   └── payment.use-case.ts
│   └── ...
└── lib/
    ├── hooks/
    │   ├── use-auth.ts
    │   └── use-booking.ts
    └── utils/
        ├── map-api-property.ts
        ├── map-api-booking.ts
        └── ...
```

---

## 6. Data Utils & Hooks (Template Support)

- **Purpose:** Turn API/backend DTOs into the shapes the UI expects; keep this in one place so templates stay simple.
- **Examples:**
  - `mapApiPropertyToEntity(response)` — API property → `PropertyEntity`.
  - `mapApiBookingToView(response)` — API booking → `{ id, propertyTitle, checkIn, checkOut, total, status }` for lists/detail.
  - `mapApiUserToEntity(response)` — API user → `UserEntity` (id, name, email, avatar, role).
- **Hooks (used inside templates or pages):**
  - `useAuth()` — current user, signIn, signOut (calls auth use-case/API).
  - `useBooking(id)` — fetch booking by id for checkout.
  - `useUserBookings()` — list for account page.

Templates call use-cases or these hooks, then pass converted data to children.

---

## 7. Color Tokens (Minimal B&W/Grey)

Use existing Tailwind/theme variables; override only for auth/account/payment if you want a stricter B&W look:

- **Background:** `--background`: white (light) / near-black (dark).
- **Foreground:** `--foreground`: black/dark grey.
- **Muted:** `--muted`, `--muted-foreground`: light grey bg, mid grey text.
- **Primary:** `--primary`: dark grey or black for buttons/links; `--primary-foreground`: white. Optionally a single muted accent (e.g. `oklch(0.45 0.02 250)` for a subtle blue) for primary CTA only.
- **Border / input:** Light grey; no colored borders.
- **Destructive:** Muted red or dark grey.

This keeps the app neutral and lets auth/account/payment feel consistent with the rest of the product.

---

## 8. Summary

- **Design:** Auth, account, payment screens are minimal: black/white/grey with optional subtle accents; no Airbnb-style colors.
- **Architecture:** Templates own API calls, state, and data conversion; they pass props to presentational children.
- **Backend:** Align with `booking_platform.md` (users, auth, bookings, payments, waitlist, price alerts).
- **Scope:** Add auth (sign in/up, forgot/reset), account (profile, bookings, waitlist, price alerts), payment (checkout for booking; optional payment methods). Refactor property detail into `PropertyDetailsTemplate` for consistency.
- **Placement:** Auth layout for auth routes; AppLayout for account and payment; new domain entities/use-cases and data utils as needed.
