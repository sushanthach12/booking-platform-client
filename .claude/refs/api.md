# API Endpoints & Environment Variables

## Environment Variables

No `.env*` files committed. Create `.env.local`:

| Variable              | Required for      | Notes                                                                                 |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Image upload flow | Base URL for `POST /upload/presign`                                                   |
| `APP_ENV`             | `api.constant.ts` | Set to `"production"` to switch `API_CONSTANTS.BASE_URL` to `https://api.booking.com` |

**No `.env.example` exists yet** — create one when adding real env vars.

## Planned Endpoints (`src/domain/constants/api.constant.ts`)

All defined but none are live yet except `/upload/presign`.

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
```

### Upload (active)

```
POST /upload/presign     ← only real HTTP endpoint today
```

### Properties (planned)

```
GET /api/v1/properties/search   params: location, check_in, check_out, guests, price_min/max, radius
GET /api/v1/properties/:id
```

## Next.js Image Domains

Only `images.unsplash.com` is whitelisted in `next.config.ts`.
Add other domains there when integrating real property images.
