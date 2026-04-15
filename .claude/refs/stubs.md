# What's Real vs Mocked vs TODO

This project is now largely production-ready on the frontend. Before touching any feature, check its status here.

## Real (works today)

| Feature                              | Notes                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------- |
| Image upload                         | `UploadRepository` → `POST /upload/presign` → S3 binary upload via XHR  |
| UI / routing / all pages             | Fully rendered, navigable                                               |
| Redux search state + filters         | Filters stored and wired to filter results via `useSearch` hook         |
| Auth dialog (modal)                  | `AuthDialog` → real HTTP login → cookie storage → reload                |
| `/signin` + `/signup` pages          | Forms call `saveAuthData()`, redirect to `/` on success                 |
| `/forgot-password` + `/reset-password` | Wired to real HTTP endpoints                                           |
| Property listing + detail            | `PropertyRepository` → real HTTP `GET /api/v1/properties`               |
| Property search                      | `PropertyRepository.searchProperties()` → real HTTP                     |
| Booking flow                         | `BookingRepository` → previewCheckout, createBooking, getBookings etc.  |
| Host onboarding wizard               | `HostPropertyRepository` → createDraft, savePricing, publishDraft etc.  |
| Host dashboard                       | `/dashboard/host/*` with listings, reservations, calendar, reviews, payouts, settings |
| Guest dashboard                      | `/dashboard/bookings`, `/dashboard/wishlist`, `/dashboard/profile`      |
| Auth guard                           | `useAuthGuard` hook — client-side route + action protection             |

## Stubs (UI exists, not wired)

| Feature                        | Status                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| Footer links (`/cookies` etc.) | No backing `page.tsx`                                        |
| `.env.example`                 | Doesn't exist yet — create when adding real env vars         |

## When Wiring New Features

1. Add entity interface to `src/domain/entities/`
2. Add repository interface to `src/data/interfaces/`
3. Implement repository in `src/data/repositories/` (HTTP via `fetch`)
4. Add use case to `src/domain/use-cases/`
5. Register in DI container (`src/domain/di/container.ts`)
6. Add helper getter to `src/domain/di/index.ts`
