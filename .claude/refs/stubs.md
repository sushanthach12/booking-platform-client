# What's Real vs Mocked vs TODO

This project is a frontend prototype. Before touching any feature, check its status here.

## Real (works today)
| Feature | Notes |
|---------|-------|
| Image upload | `UploadRepository` → `POST /upload/presign` → S3 binary upload via XHR |
| UI / routing / all pages | Fully rendered, navigable |
| Redux search state | Filters stored, but not wired to filter results |
| Auth dialog (modal) | `AuthDialog` → real HTTP login → cookie storage → reload |
| Property listing UI | Renders `MOCK_PROPERTIES` correctly |

## Mocked (in-memory, no HTTP)
| Feature | Mock location | Notes |
|---------|--------------|-------|
| Property data | `src/data/repositories/` (`MOCK_PROPERTIES`) | All listing, detail, search data |

## Stubs (UI exists, not wired)
| Feature | Status |
|---------|--------|
| `/signin` `/signup` `/forgot-password` `/reset-password` | Forms log to console. `saveAuthData()` not called. |
| Search sidebar filters | Rendered but don't filter the property grid in `SearchTemplate` |
| `BookingForm` submission | UI complete, no server-side booking call |
| `BecomeAHostTemplate` listing creation | Wizard complete, no HTTP |
| Footer links (`/cookies` etc.) | No backing `page.tsx` |
| `.env.example` | Doesn't exist yet — create when adding real env vars |

## Planned API (defined, not active)
All auth endpoints in `src/domain/constants/api.constant.ts` are defined but unused.
See `refs/api.md` for the full list.

## When Wiring Real Features
1. Replace the relevant mock `Repository` in `src/data/repositories/`
2. Keep the interface in `src/data/interfaces/` unchanged
3. Update DI container in `src/domain/di/container.ts` to bind new implementation
4. Auth pages need `saveAuthData()` called after successful login/signup (cookie keys: `auth_token`, `auth_user`)
