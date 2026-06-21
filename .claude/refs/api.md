# API Endpoints & Environment Variables

## Environment Variables

No `.env*` files committed. Create `.env.local`:

| Variable               | Required for   | Notes                                                        |
| ---------------------- | -------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL`  | All HTTP calls | Base URL for all API requests (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_SITE_URL` | SEO metadata   | Defaults to `https://stayly.sushanthh.com` if unset          |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google login (`<GoogleLogin>`) | Google OAuth Web client id. Must match the backend's `GOOGLE_CLIENT_ID`. If unset, the Google button is hidden and email/password still works. |

`.env.example` lives at the web root. `APP_ENV` is no longer used.

## Active Endpoints (`src/domain/constants/api.constant.ts`)

### Auth

```
POST /auth/login
POST /auth/signup
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
POST /auth/resend-verification
POST /auth/logout
GET  /auth/me
POST /auth/refresh-token
POST /auth/verify-token
POST /auth/social/:provider
```

### Upload (active)

```
POST /upload/presign     ← get presigned S3 URL, then PUT binary directly to S3
```

### Properties

```
GET /api/v1/properties/search   params: location, check_in, check_out, guests, price_min/max, radius
GET /api/v1/properties/:id
```

### Bookings

```
POST /api/v1/bookings/preview-checkout
GET  /api/v1/bookings/check-availability
POST /api/v1/bookings
GET  /api/v1/bookings              (guest bookings)
GET  /api/v1/bookings/host         (host reservations)
GET  /api/v1/bookings/:id
POST /api/v1/bookings/:id/cancel
```

### Host Properties

```
POST  /api/v1/host/properties/draft
PATCH /api/v1/host/properties/:id/location
PATCH /api/v1/host/properties/:id/pricing
PATCH /api/v1/host/properties/:id/amenities
PATCH /api/v1/host/properties/:id/photos
POST  /api/v1/host/properties/:id/publish
GET   /api/v1/host/properties/:id/draft
```

## Next.js Image Domains

Only `images.unsplash.com` is whitelisted in `next.config.ts`.
Add other domains there when integrating real property images from S3 or a CDN.
