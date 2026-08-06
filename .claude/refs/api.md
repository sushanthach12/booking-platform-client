# API Endpoints & Environment Variables

## Environment Variables

No `.env*` files committed. Create `.env.local`:

| Variable                       | Required for                   | Notes                                                                                                                                        |
| ------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | All HTTP calls                 | Public base URL for API requests (e.g. `http://localhost:8001`)                                                                                |
| `API_INTERNAL_URL`             | SSR calls                      | Server-only. When set, SSR hits the API origin directly to bypass Cloudflare bot protection. Never prefix with `NEXT_PUBLIC_`                  |
| `INTERNAL_API_SECRET`          | SSR calls                      | Server-only. Sent as `x-origin-key`; a Cloudflare WAF skip-rule allowlists it                                                                  |
| `NEXT_PUBLIC_SITE_URL`         | SEO metadata                   | Defaults to `https://stayly.sushanthh.com` if unset                                                                                            |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google login (`<GoogleLogin>`) | Google OAuth Web client id. Must match the backend's `GOOGLE_CLIENT_ID`. If unset, the Google button is hidden and email/password still works. |

`APP_ENV` is no longer used.

---

## Contract rules — read before writing any request

### 1. Strict payload rejection

The backend runs a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.

- Any body key not declared on the DTO → `400 property <key> should not exist`.
- **Query params obey the same rule** — `@Query() dto: SomeDto` runs through the same pipe.
- One stray key fails the whole request, not just that field.

**Never** spread a form object or domain entity into `JSON.stringify`. Build every body
from an explicit allow-list of keys taken from the tables below.

### 2. Identifiers are not always path params

The backend refactor moved most identifiers off the path. There is no single rule — it is
per-route. The `Identifier` column below is authoritative.

| Placement       | Used by                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Query param** | Property CRUD, property details, analytics, availability, booking details, host properties            |
| **Body**        | Host onboarding steps 2–5 and publish (`propertyId` inside the payload)                               |
| **Path param**  | Booking sub-resources, property calendar / images / amenities, wishlist items, review reply           |

### 3. Response envelope

Everything returns `{ data, meta? }` except `POST /storage/presign`, which is un-enveloped.
Paginated list routes put the array on `data` and totals on `meta`.

---

## Endpoints

`BASE = {NEXT_PUBLIC_API_URL}/api/v1` — built by `apiUrl()` in `src/domain/constants/api.constant.ts`.

### Auth

| Method | Path                   | Identifier | Payload                                            |
| ------ | ---------------------- | ---------- | -------------------------------------------------- |
| POST   | `/auth/register`       | —          | `{email, password, name, userType?}` — sends OTP    |
| POST   | `/auth/signup`         | —          | alias of `/auth/register`                          |
| POST   | `/auth/login`          | —          | `{email, password, userType?}` — sends OTP          |
| POST   | `/auth/verify-otp`     | —          | `{email, context, otp}` — returns tokens            |
| POST   | `/auth/resend-otp`     | —          | `{email, context}`                                  |
| POST   | `/auth/social/google`  | —          | `{idToken}` — **Google only**, no facebook/apple    |
| PATCH  | `/auth/become-host`    | —          | none — reissues tokens                              |
| POST   | `/auth/logout`         | —          | none — invalidates the access token server-side     |
| POST   | `/auth/refresh`        | —          | `{refreshToken}`                                    |
| POST   | `/auth/forgot-password`| —          | `{email}`                                           |
| POST   | `/auth/reset-password` | —          | `{token, newPassword}`                              |

### Users

| Method | Path                                  | Identifier | Payload                                    |
| ------ | ------------------------------------- | ---------- | ------------------------------------------ |
| GET    | `/users/profile`                      | —          | **GET only** — there is no PATCH here      |
| GET    | `/users/me`                           | —          | alias of `/users/profile`                  |
| PATCH  | `/users/me`                           | —          | `{name?, phone?, bio?, avatar?}` — **only these four keys** |
| PATCH  | `/users/me/become-host`               | —          | none                                       |
| GET    | `/users/me/wishlist`                  | `?page&limit` | → `{data: items[], meta}`               |
| POST   | `/users/me/wishlist/:propertyId`      | path       | none                                       |
| DELETE | `/users/me/wishlist/:propertyId`      | path       | none                                       |
| GET    | `/users/me/wishlist/:propertyId/status` | path     | → `{data: {wishlisted}}`                   |

### Properties

| Method | Path                              | Identifier                            | Payload                                              |
| ------ | --------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| POST   | `/properties/listing`             | —                                     | `{page, limit}` — both **required**                  |
| POST   | `/properties`                     | —                                     | `CreatePropertyDto` (host)                           |
| GET    | `/properties/details`             | `?propertyId&includeRelations`        | —                                                    |
| PATCH  | `/properties/details`             | `?propertyId`                         | `{title?, description?, propertyType?, status?}`     |
| DELETE | `/properties`                     | `?propertyId`                         | —                                                    |
| PATCH  | `/properties/status`              | `?propertyId`                         | `{status}` — **status only, propertyId is a query param** |
| POST   | `/properties/search`              | —                                     | `SearchPropertiesDto`                                |
| GET    | `/properties/search`              | query = `SearchPropertiesDto`         | alias                                                |
| GET    | `/properties/nearby`              | `?latitude&longitude&radius&limit`    | —                                                    |
| GET    | `/properties/host/me`             | `?page&limit&status&propertyType`     | —                                                    |
| GET    | `/properties/analytics`           | `?propertyId&startDate&endDate`       | —                                                    |
| GET    | `/properties/availability`        | `?propertyId&startDate&endDate&roomId`| —                                                    |
| PATCH  | `/properties/availability/bulk`   | `?propertyId`                         | `{updates[]}`                                        |
| PATCH  | `/properties/availability/range`  | `?propertyId`                         | `{startDate, endDate, available, roomId?, price?, minNights?, maxNights?, note?, blockReason?}` |
| GET    | `/properties/:id`                 | path                                  | alias of `details?includeRelations=true`             |

**Status enum:** `draft | active | inactive | deleted`. There is **no `paused`** —
that is a UI label for `inactive`.

**Search sort:** `sortBy ∈ {price, rating, distance, created_at}`, `sortOrder ∈ {asc, desc}`.

### Property calendar

| Method | Path                                          | Identifier                         | Notes                                                       |
| ------ | --------------------------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| GET    | `/properties/:propertyId/stats`               | path                               | host only                                                    |
| GET    | `/properties/:propertyId/calendar`            | path + `?from&to`                  |                                                              |
| GET    | `/properties/availability/range`              | `?propertyId&startDate&endDate`    | **public**. Returns `data: Array<{date, blockReason}>` — an array of unavailable dates, *not* `{bookedDates}` |
| POST   | `/properties/:propertyId/calendar/block`      | path                               | `{startDate, endDate, reason?}`                              |
| DELETE | `/properties/:propertyId/calendar/:blockId`   | path                               | `blockId` is the **date string**, not a row id               |

### Host onboarding

`propertyId` travels **in the body** for every step after step 1.

| Method | Path                          | Payload                                                                                                                                          |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/host/onboard/draft`         | `{propertyType, title, description, propertyId?}` → 201. Passing `propertyId` updates the existing draft                                          |
| PUT    | `/host/onboard/location`      | `{propertyId, addressLine1, addressLine2?, city, state, country, postalCode, latitude, longitude}`                                                |
| PUT    | `/host/onboard/pricing`       | `{propertyId, basePrice, currency, charges?, minNights, maxNights, maxGuests, checkInTime, checkOutTime, cancellationPolicy, enableWaitlist}`     |
| PUT    | `/host/onboard/amenities`     | `{propertyId, amenities[{name, category, description?, icon?}], rules?[{ruleType, allowed, description?}]}`                                       |
| PUT    | `/host/onboard/photos`        | `{propertyId, images[{url, thumbnailUrl?, caption?, altText?, displayOrder?, isPrimary?, width?, height?, fileSize?, mimeType?}]}` — 1 to 50      |
| POST   | `/host/onboard/publish`       | `{propertyId}`                                                                                                                                    |
| GET    | `/host/onboard/draft/resume`  | —                                                                                                                                                 |
| GET    | `/host/onboard/draft`         | `?propertyId`                                                                                                                                     |

`POST /host/onboard` (legacy single-shot) is **commented out in the controller** — it does not exist.

`checkInTime` / `checkOutTime` must be `HH:mm` 24-hour. `currency` must be a 3-letter ISO 4217 code.
`cancellationPolicy ∈ {flexible, moderate, strict}`. `category ∈ {general, essentials, features, location, safety}`.
`ruleType ∈ {pets, smoking, parties, quiet_hours, check_in_time, check_out_time, max_guests, no_shoes, no_alcohol, no_smoking, other}`.

### Bookings

| Method | Path                                | Identifier                              | Payload                                                                                                        |
| ------ | ----------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| POST   | `/bookings`                         | —                                       | `{propertyId, roomId?, checkInDate, checkOutDate, guestCount, specialRequests?, idempotencyKey, paymentMethod, quoteToken?}` |
| GET    | `/bookings`                         | `?propertyId&tab&status&paymentStatus&startDate&endDate&page&limit&sortBy&sortOrder` | —                            |
| GET    | `/bookings/summary`                 | —                                       | guest only                                                                                                       |
| GET    | `/bookings/details`                 | `?bookingId`                            | —                                                                                                                |
| GET    | `/bookings/:bookingId/status`       | path                                    | lightweight polling — `{status, paymentStatus}`                                                                  |
| POST   | `/bookings/:bookingId/retry-payment`| path                                    | —                                                                                                                |
| PATCH  | `/bookings/:bookingId/cancel`       | path                                    | `{reason?}` — inline type, so *not* whitelist-validated                                                          |
| POST   | `/bookings/checkout/preview`        | —                                       | `{propertyId, roomId?, checkInDate, checkOutDate, guestCount}` — returns `quoteToken` (10-min TTL)                |
| POST   | `/bookings/check-availability`      | —                                       | `{propertyId, checkInDate, checkOutDate, roomId?}` — public                                                      |
| GET    | `/bookings/host`                    | same query as `/bookings`               | host only                                                                                                        |
| PATCH  | `/bookings/:bookingId/status`       | path                                    | `{status: accepted \| declined \| cancelled, reason?}`                                                           |
| PATCH  | `/bookings/:bookingId/confirm`      | path                                    | host only                                                                                                        |

### Reviews

| Method | Path                          | Identifier    | Payload                          |
| ------ | ----------------------------- | ------------- | -------------------------------- |
| POST   | `/reviews`                    | —             | `{bookingId, rating, comment}` → 201 |
| GET    | `/reviews/booking/:bookingId` | path          | —                                |
| GET    | `/reviews/host`               | `?page&limit` | → `{data, meta}`                 |
| GET    | `/reviews/host/summary`       | —             | —                                |
| POST   | `/reviews/:reviewId/reply`    | path          | `{text}`                         |

### Payouts

| Method | Path                              | Identifier | Payload                                                                     |
| ------ | --------------------------------- | ---------- | --------------------------------------------------------------------------- |
| GET    | `/payouts`                        | `?page&limit` | → `{data, meta}`                                                         |
| GET    | `/payouts/upcoming`               | —          | —                                                                           |
| GET    | `/payouts/summary`                | —          | —                                                                           |
| GET    | `/payouts/balance`                | —          | —                                                                           |
| GET    | `/payouts/earnings`               | `?months`  | —                                                                           |
| GET    | `/payouts/accounts`               | —          | —                                                                           |
| POST   | `/payouts/accounts`               | —          | `{accountType?, accountHolder, bankName?, accountNumber?, ifsc?, upiId?}` → 201 |
| PATCH  | `/payouts/accounts/:id/primary`   | path       | none                                                                        |
| DELETE | `/payouts/accounts/:id`           | path       | none → 204                                                                  |
| POST   | `/payouts/request`                | —          | none → 201                                                                  |

### Storage & Home

| Method | Path               | Payload                                                                       |
| ------ | ------------------ | ----------------------------------------------------------------------------- |
| POST   | `/storage/presign` | `{fileName, contentType, folder?}` — response is **un-enveloped**, then PUT the binary to the returned URL |
| GET    | `/home`            | `?location&limit` — public. Returns `{featured, nearby, destinations}`         |

---

## Next.js Image Domains

Only `images.unsplash.com` is whitelisted in `next.config.ts`.
Add other domains there when integrating real property images from R2 or a CDN.
