# CLAUDE.md — Stayly Web (booking-platform/web)

> Auto-generated context for Claude Code. Keep in sync with the codebase.

---

## 1. Project identity

| Field           | Value                                              |
| --------------- | -------------------------------------------------- |
| App name        | **Stayly** (`APP_NAME = "stayly"`)                 |
| Framework       | **Next.js 16.1.4** (App Router only — no `pages/`) |
| React           | **19.2.3**                                         |
| TypeScript      | **5.x**, `strict: true`                            |
| Package manager | **pnpm** (`pnpm-lock.yaml` present)                |
| Root src alias  | `@/*` → `./src/*`                                  |

---

## 2. Stack at a glance

| Concern      | Library / tool                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Routing      | Next.js App Router (`src/app/`)                                                                           |
| Styling      | Tailwind CSS v4 (CSS-first, `@import "tailwindcss"` in `globals.css`) + `tw-animate-css`                  |
| UI kit       | shadcn/ui-style — **style: new-york**, **baseColor: zinc**, **cssVariables: true**, icons: `lucide-react` |
| Primitives   | `radix-ui` umbrella + scoped `@radix-ui/react-*`                                                          |
| Variants     | `class-variance-authority` (CVA), `clsx`, `tailwind-merge` → `cn()` in `src/lib/utils.ts`                 |
| Dates        | `date-fns` + `react-day-picker`                                                                           |
| Global state | Redux Toolkit + redux-saga (`search`, `upload` slices)                                                    |
| DI           | **tsyringe** + `reflect-metadata` (decorators on)                                                         |
| Fonts        | `Fraunces` (`--font-display`) + `Poppins` (`--font-sans`) via `next/font/google`                          |
| Images       | External: `images.unsplash.com` only (configured in `next.config.ts`)                                     |
| **Not used** | React Query, Axios, Zod, yup, react-hook-form, Prisma, Drizzle, NextAuth                                  |

---

## 3. File / folder layout

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts + ReduxProvider + reflect-metadata
│   ├── globals.css             # Tailwind v4 + CSS design tokens + dark mode
│   ├── (core)/                 # Public + logged-in pages (no URL segment)
│   │   ├── page.tsx            # / — Home
│   │   ├── search/page.tsx     # /search
│   │   ├── properties/[id]/    # /properties/:id  +  /photos
│   │   ├── book/[propertyId]/  # /book/:propertyId
│   │   ├── account/            # /account
│   │   └── become-host/        # /become-host
│   ├── (auth)/                 # Centered auth shell (no URL segment)
│   │   ├── signin/page.tsx     # /signin
│   │   ├── signup/page.tsx     # /signup
│   │   ├── forgot-password/    # /forgot-password
│   │   └── reset-password/     # /reset-password
│   └── (host)/                 # Host shell (no URL segment)
│       └── host/dashboard/     # /host/dashboard
├── components/
│   ├── ui/                     # Design-system primitives (shadcn-style)
│   ├── shared/                 # Cross-feature atoms (Modal, DateRangePicker, etc.)
│   ├── sections/               # Marketing sections (Hero, TrustBar, FeaturedDestinations…)
│   ├── header/ footer/         # Shell chrome
│   ├── auth/                   # AuthDialog, SignInView, templates
│   ├── property/               # Listing card, detail view, gallery, booking widget, templates
│   ├── search/                 # SearchTemplate (client), header, sidebar, listing
│   ├── book/                   # BookingTemplate, BookingForm, modals, steps
│   ├── become-a-host/          # Wizard + step components
│   ├── account/                # AccountView, EditProfileModal, AccountTemplate
│   ├── host/                   # HostDashboardView, HostDashboardTemplate
│   └── providers/              # ReduxProvider
├── domain/
│   ├── constants/api.constant.ts
│   ├── di/                     # tsyringe container + TOKENS
│   ├── entities/               # PropertyEntity, PropertySearchParams (TypeScript interfaces)
│   ├── interfaces/             # IPropertyRepository, IAuthRepository, IUploadRepository
│   ├── repositories/           # In-memory mock implementations
│   └── use-cases/              # AuthUseCase, PropertyUseCase, UploadUseCase
├── store/
│   ├── index.ts                # configureStore (search + upload reducers + sagaMiddleware)
│   └── slices/                 # search-slice.ts, upload.slice.ts
├── saga/                       # root.saga.ts + upload.saga.ts
├── hooks/                      # redux.ts (useAppDispatch / useAppSelector)
├── lib/
│   ├── utils.ts                # cn() helper
│   └── utils/                  # booking-params, map-property, reflect-metadata side-effect
├── constant/                   # app.constant.ts (APP_NAME), metadata.ts (BASE_METADATA)
├── types/                      # categories.ts (PROPERTY_CATEGORIES)
└── data/interfaces/            # Guest + become-host form shape interfaces
```

---

## 4. Route inventory

All `page.tsx` files are **Server Components** by default. Interactive work is pushed to `"use client"` children.

| URL                       | File                                | Pattern                                                         |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| `/`                       | `(core)/page.tsx`                   | Server → client sections (HeroSection uses Redux)               |
| `/search`                 | `(core)/search/page.tsx`            | Server → `SearchTemplate` (**client**, reads `useSearchParams`) |
| `/properties/[id]`        | `(core)/properties/[id]/page.tsx`   | Server → async `PropertyDetailsTemplate` → client view          |
| `/properties/[id]/photos` | `…/photos/page.tsx`                 | Server → `PhotoTour` (**client**)                               |
| `/book/[propertyId]`      | `(core)/book/[propertyId]/page.tsx` | Server → async `BookingTemplate` → `BookingForm` (**client**)   |
| `/account`                | `(core)/account/page.tsx`           | Server → `AccountTemplate` → `AccountView` (**client**)         |
| `/become-host`            | `(core)/become-host/page.tsx`       | Server → `BecomeAHostTemplate` (**client**, wizard)             |
| `/signin`                 | `(auth)/signin/page.tsx`            | Server → `SignInTemplate` (**client**)                          |
| `/signup`                 | `(auth)/signup/page.tsx`            | Server → `SignUpTemplate` (**client**)                          |
| `/forgot-password`        | `(auth)/forgot-password/page.tsx`   | Server → `ForgotPasswordTemplate` (**client**)                  |
| `/reset-password`         | `(auth)/reset-password/page.tsx`    | Server → `ResetPasswordTemplate` (**client**)                   |
| `/host/dashboard`         | `(host)/host/dashboard/page.tsx`    | Server → `HostDashboardTemplate` → view (**client**)            |

**No `middleware.ts`** — routes are not server-enforced.

**Footer links** (`/cookies`, etc.) have no matching `page.tsx` — they are placeholders.

---

## 5. Domain layer & DI

```
tsyringe container  (src/domain/di/container.ts)
  TOKENS.IPropertyRepository → PropertyRepository  (in-memory mock)
  TOKENS.IAuthRepository     → AuthRepository      (in-memory mock, demo user)
  TOKENS.IUploadRepository   → UploadRepository    (fetch → presign URL)
  TOKENS.UploadUseCase       → UploadUseCase

Helper getters: src/domain/di/index.ts
  getPropertyUseCase()  — call from async server components
  getAuthUseCase()      — call from client components
  getUploadUseCase()    — used by image-uploader
```

`reflect-metadata` **must** be imported before the container resolves. It is loaded via a side-effect import in `src/lib/utils/reflect-metadata.ts`, which is imported by `src/app/layout.tsx`.

---

## 6. Key data models

### PropertyEntity (`src/domain/entities/property.entity.ts`)

```ts
PropertyEntity {
  id, title, type?, description?, status?
  location: { city, state?, country?, coordinates? }
  host?: { id?, name, image?, isSuperhost? }
  stats?: { rating, reviewCount }
  pricing: { amount, currency, frequency: "night"|"person"|"week" }
  images: string[]
  bedrooms?, beds?, bathrooms?
  amenities?: string[]
}
```

### Auth (`src/domain/interfaces/auth.interface.ts`)

```ts
User { id, email, firstName, lastName, avatar?, isHost, createdAt, updatedAt }
LoginCredentials { email, password }
SignupCredentials { firstName, lastName, email, password }
AuthResponse { user: User, token: string }
```

### Redux state

| Slice    | Key fields                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `search` | `filters` (location, checkIn, checkOut, guests, priceMin/Max, amenities, propertyType), `isSearchActive`, `searchResults`, `isLoading`, `error` |
| `upload` | see `upload.slice.ts`                                                                                                                           |

---

## 7. Auth pattern

- **Storage**: browser `localStorage` — keys `authToken` (string) and `currentUser` (JSON).
- **Working path**: `AuthDialog` → `getAuthUseCase().login()` → `saveAuthData()` → `window.location.reload()`.
- **Auth pages** (`/signin`, `/signup`, etc.): currently **stubs** — forms log to console; `saveAuthData` not yet called.
- **Social login**: `AuthRepository.socialLogin(provider, email?)` — mock, creates in-memory user.
- **No middleware / server session** — auth is entirely client-side localStorage today.
- **Post-login redirect**: stored in `sessionStorage` key `redirectAfterLogin`, consumed by `AuthDialog`.

---

## 8. Data fetching patterns

| Pattern                             | Where                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **In-memory mock** (no HTTP)        | Property listing, detail, search — `PropertyRepository` returns `MOCK_PROPERTIES` array                |
| **`fetch` to presign URL**          | `UploadRepository.getPresignedUrl` → `POST ${NEXT_PUBLIC_API_URL}/upload/presign`                      |
| **`XMLHttpRequest`** (for progress) | Binary S3 upload in `upload.repository.ts`                                                             |
| **Async Server Component**          | `CategoryPropertyListTemplate`, `PropertyDetailsTemplate`, `BookingTemplate` — call use cases directly |
| **Client hook**                     | `useSearch` in `search/hooks/use-search.ts` — loads properties on mount, no RTK Query                  |

---

## 9. Environment variables

No `.env*` files committed. Add a `.env.local`:

| Variable              | Required for      | Notes                                                                                 |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Image upload flow | Base URL for `POST /upload/presign`                                                   |
| `APP_ENV`             | `api.constant.ts` | Set to `"production"` to switch `API_CONSTANTS.BASE_URL` to `https://api.booking.com` |

---

## 10. Component conventions

- **Naming**: PascalCase components, kebab-case filenames.
- **Suffix pattern**: `*-template.tsx` = route-level server composition; `*-view.tsx` = presentational client leaf.
- **`"use client"`**: placed at the top of every interactive component file — pages stay server, children opt in.
- **Barrel exports**: feature folders export via `index.ts`.
- **`cn()` utility**: always use `cn(clsx(...), tailwind-merge)` from `@/lib/utils` for conditional classes.
- **Shadcn components** live in `src/components/ui/` — extend via CVA variants, not inline overrides.
- **Max component size guideline**: ~200 lines; extract into sub-components if larger.
- **No Zod / react-hook-form**: forms use native `<form>` + `FormData` or controlled React state.

---

## 11. Forms (current state)

| Form                       | Mechanism             | Validation            | Backend               |
| -------------------------- | --------------------- | --------------------- | --------------------- |
| Auth dialog (login/signup) | `<form>` + `FormData` | try/catch on use case | `AuthUseCase` → mock  |
| `/signin`, `/signup`, etc. | Uncontrolled inputs   | None                  | **TODO** — stubs only |
| `BookingForm`              | React state + modals  | UI-level (checkbox)   | No submit API         |
| Become-a-host wizard       | Per-step local state  | None                  | Not wired to HTTP     |

---

## 12. Styling guide

- **Tailwind v4** — no `tailwind.config.*` file; configuration is in `globals.css` via CSS variables.
- **Design tokens**: `--primary`, `--radius`, `--header-height`, sidebar/chart tokens defined in `:root` in `globals.css`.
- **Dark mode**: `@custom-variant dark (.dark)` class strategy.
- **Gradient**: use `bg-linear-to-*` (Tailwind v4 syntax), not `bg-gradient-to-*`.
- **Responsive breakpoints**: standard Tailwind (`sm`, `md`, `lg`, `xl`).

---

## 13. API endpoints (planned, not yet active)

Defined in `src/domain/constants/api.constant.ts`:

```
/auth/login, /auth/signup, /auth/forgot-password, /auth/reset-password
/auth/verify-email, /auth/resend-verification, /auth/logout
/auth/me, /auth/refresh-token, /auth/verify-token
/upload/presign
```

Property search endpoints referenced in entity docs:

```
GET /api/v1/properties/search   (params: location, check_in, check_out, guests, price_min/max, radius)
GET /api/v1/properties/:id
```

---

## 14. Things that are stubs / TODOs

- All auth page templates (`/signin`, `/signup`, `/forgot-password`, `/reset-password`) — no API calls wired.
- `AuthRepository` is in-memory; real JWT/HTTP integration pending.
- `PropertyRepository` is in-memory (`MOCK_PROPERTIES`); real API pending.
- Search sidebar filters are not wired to filter the property grid in `SearchTemplate`.
- `BecomeAHostTemplate` listing creation not hooked to HTTP.
- `BookingForm` has no server-side booking submission.
- No `.env.example` exists — create one when adding real env vars.
- Footer links (`/cookies`, etc.) have no backing routes.

---

## Coding Rules

All code written in this project must follow the rules in `.claude/nextjs-rules.md`.
