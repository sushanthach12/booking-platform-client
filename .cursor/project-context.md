# Frontend — project context

## 1. Architecture overview

- **Router**: **App Router only** (`src/app`). There is **no** `pages/` directory and **no** `src/middleware.ts`.
- **Root layout**: `src/app/layout.tsx` wraps the tree with fonts (Fraunces + Poppins), global CSS, a small `reflect-metadata` side-effect import, and **`ReduxProvider`** for client state.
- **Route groups** (parentheses do not appear in URLs):
  - **`(core)`** — public marketing and booking flows: `/`, `/search`, `/properties/[id]`, `/properties/[id]/photos`, `/book/[propertyId]`, `/account`, `/become-host`.
  - **`(auth)`** — centered auth shell: `/signin`, `/signup`, `/forgot-password`, `/reset-password`.
  - **`(host)`** — host shell with main `Header`: `/host/dashboard`.
- **Feature mapping**:
  - **Domain layer** (`src/domain`): repositories + use cases resolved via **tsyringe** (`src/domain/di/container.ts`, helpers in `src/domain/di/index.ts`). Today **property and auth data are in-memory mocks** (`property.repository.ts`, `auth.repository.ts`); **upload presign** uses **`fetch`** to a configurable API base.
  - **Presentation**: `src/components/*` feature UI + `src/components/ui/*` (shadcn-style). **Templates** (e.g. `property-details-template`, `booking-template`) often run **async on the server** and pass plain props into **client** views.
  - **Cross-cutting**: `src/lib/utils/*` (booking URL params, property mapping), `src/store` (Redux + saga for uploads), `src/saga/*`.

## 2. Tech stack details

| Area                                  | Choice                                                                                                                                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**                         | **Next.js 16.1.4** (`package.json`)                                                                                                                                                                                                 |
| **React**                             | **19.2.3**                                                                                                                                                                                                                          |
| **TypeScript**                        | **5.x**, `strict: true`, path alias **`@/*` → `./src/*`** (`tsconfig.json`)                                                                                                                                                         |
| **Styling**                           | **Tailwind CSS v4** via `@import "tailwindcss"` in `src/app/globals.css`, **PostCSS** plugin `@tailwindcss/postcss` (`postcss.config.mjs`)                                                                                          |
| **Animation utilities**               | `tw-animate-css` imported in `globals.css`                                                                                                                                                                                          |
| **UI kit**                            | **shadcn/ui–style** setup: `components.json` (**style: new-york**, **rsc: true**, **baseColor: zinc**, **cssVariables: true**, **iconLibrary: lucide**). Tailwind `config` path in JSON is **empty** (Tailwind 4 CSS-first config). |
| **Primitives**                        | Mix of **`radix-ui`** umbrella package and scoped **`@radix-ui/react-*`**. **CVA** (`class-variance-authority`), **clsx**, **tailwind-merge** (`cn` in `src/lib/utils.ts`)                                                          |
| **Dates**                             | **date-fns**, **react-day-picker** (calendar UI)                                                                                                                                                                                    |
| **State**                             | **Redux Toolkit** + **redux-saga** (`search`, `upload` slices). Typed hooks: `src/hooks/redux.ts`                                                                                                                                   |
| **DI / “clean” backend-facing layer** | **tsyringe** + **reflect-metadata** (decorators enabled in `tsconfig.json`)                                                                                                                                                         |
| **Not used in `src/` (deps present)** | **React Query / SWR**, **axios**, **Zod / yup / react-hook-form** — no imports found. **`query-string`** is in `package.json` but not imported in `src/`.                                                                           |

## 3. Page and route inventory

All listed files are **Server Components** by default: none of the `page.tsx` files declare `"use client"`. They compose **client** children where interactivity is needed.

| URL                       | File                                             | Purpose                                                    | Server vs client                                                        |
| ------------------------- | ------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/`                       | `src/app/(core)/page.tsx`                        | Home: hero, trust bar, destinations, category sliders, CTA | **Server** (imports client sections)                                    |
| `/search`                 | `src/app/(core)/search/page.tsx`                 | Search UI with suspense fallback                           | **Server** → `SearchTemplate` (**client**)                              |
| `/properties/[id]`        | `src/app/(core)/properties/[id]/page.tsx`        | Property detail; `generateMetadata` from `?title=`         | **Server** → async `PropertyDetailsTemplate`                            |
| `/properties/[id]/photos` | `src/app/(core)/properties/[id]/photos/page.tsx` | Full-screen photo tour                                     | **Server** → `PhotoTour` (**client**)                                   |
| `/book/[propertyId]`      | `src/app/(core)/book/[propertyId]/page.tsx`      | Checkout / confirm-and-pay flow                            | **Server** → async `BookingTemplate` → `BookingForm` (**client**)       |
| `/account`                | `src/app/(core)/account/page.tsx`                | Account area (stub data)                                   | **Server** → `AccountTemplate` → `AccountView` (**client**)             |
| `/become-host`            | `src/app/(core)/become-host/page.tsx`            | Host onboarding wizard                                     | **Server** → `BecomeAHostTemplate` (**client**)                         |
| `/signin`                 | `src/app/(auth)/signin/page.tsx`                 | Sign-in                                                    | **Server** → `SignInTemplate` (**client**)                              |
| `/signup`                 | `src/app/(auth)/signup/page.tsx`                 | Sign-up                                                    | **Server** → `SignUpTemplate` (**client**)                              |
| `/forgot-password`        | `src/app/(auth)/forgot-password/page.tsx`        | Forgot password                                            | **Server** → `ForgotPasswordTemplate` (**client**)                      |
| `/reset-password`         | `src/app/(auth)/reset-password/page.tsx`         | Reset password                                             | **Server** → `ResetPasswordTemplate` (**client**)                       |
| `/host/dashboard`         | `src/app/(host)/host/dashboard/page.tsx`         | Host dashboard (stub summaries)                            | **Server** → `HostDashboardTemplate` → `HostDashboardView` (**client**) |

**Layouts**: `src/app/layout.tsx` (root), `src/app/(core)/layout.tsx` (pass-through fragment), `src/app/(auth)/layout.tsx` (centered muted background), `src/app/(host)/layout.tsx` (header + main).

**Note**: Footer links include paths like `/cookies` that **do not** have matching `page.tsx` files in `src/app` — treat as placeholders unless you add routes.

## 4. Component library

### 4.1 `src/components/ui` (design system / shadcn-style)

| Component                   | Extends / based on                                                                |
| --------------------------- | --------------------------------------------------------------------------------- |
| `button`                    | **`Slot.Root`** from `radix-ui` + **CVA** variants                                |
| `badge`                     | Plain React + **CVA**                                                             |
| `card`, `input`, `textarea` | Plain HTML elements + `cn`                                                        |
| `dialog`                    | **`@radix-ui/react-dialog`**                                                      |
| `separator`                 | **`@radix-ui/react-separator`**                                                   |
| `dropdown-menu`             | **`DropdownMenu` from `radix-ui`**                                                |
| `select`                    | **`Select` from `radix-ui`**                                                      |
| `popover`                   | **`Popover` from `radix-ui`**                                                     |
| `checkbox`                  | **`Checkbox` from `radix-ui`**                                                    |
| `label`                     | **`Label` from `radix-ui`**                                                       |
| `radio-group`               | **`RadioGroup` from `radix-ui`**                                                  |
| `slider`                    | **`Slider` from `radix-ui`**                                                      |
| `accordion`                 | **`Accordion` from `radix-ui`**                                                   |
| `avatar`                    | **`Avatar` from `radix-ui`**                                                      |
| `calendar`                  | **`react-day-picker`** `DayPicker` (+ local `Button` styling)                     |
| `time-picker`               | Wraps `Input` `type="time"`                                                       |
| `input-group`               | Composes `div` + `Input` / `Textarea` / `Button` + **CVA**                        |
| `field`                     | Composes `fieldset` / `legend` / `div` patterns + `Label` + `Separator` + **CVA** |

### 4.2 Feature components under `src/components` (props at a glance)

Paths are under `src/components/`.

| Area                | Component                                                                                     | Main props / notes                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Providers**       | `providers/redux-provider`                                                                    | `children`                                                                                             |
| **Auth**            | `auth-dialog`                                                                                 | `open`, `onOpenChange`                                                                                 |
|                     | `sign-in-view`                                                                                | `initialEmail?`, `onSubmit?(email, password)`                                                          |
|                     | `templates/sign-in-template`                                                                  | (none — wires `SignInView`, TODO API)                                                                  |
|                     | `templates/sign-up-template`, `forgot-password-template`, `reset-password-template`           | Card forms; submit handlers are TODO                                                                   |
| **Header / footer** | `header/index`, `header/simple-header`                                                        | `SimpleHeader`: `showUserMenu?`                                                                        |
|                     | `header/header-user-menu`                                                                     | `className?`, `becomeHostButtonClassName?`, `authButtonClassName?`, `onBecomeHost?`, `onOpenAuth?`     |
|                     | `footer/index`                                                                                | (none)                                                                                                 |
| **Search**          | `search/template/search-template`                                                             | (none — reads `useSearchParams`, local state)                                                          |
|                     | `search/search-header`                                                                        | location/category strings + change handlers (see file for full `SearchHeaderProps`)                    |
|                     | `search/search-filter-sidebar`                                                                | `filters`, `onFiltersChange`, `onClearFilters`, `mobileSidebarOpen`                                    |
|                     | `search/search-listing`                                                                       | `properties`, `queryString?`                                                                           |
| **Property**        | `property/property-detail-view`                                                               | `state` (mapped view model), `initialDateRange?`                                                       |
|                     | `property/booking-widget`                                                                     | Booking widget on detail page (see file)                                                               |
|                     | `property/property-listing-card`                                                              | `property`, `queryString?`                                                                             |
|                     | `property/image-gallery`, `photo-tour`, `category-property-slider`                            | See respective `*Props` in file                                                                        |
|                     | `templates/property-details-template`                                                         | `propertyId`, `initialDateRange?` (async server template)                                              |
|                     | `templates/category-property-list`                                                            | (none — async server, fetches properties)                                                              |
| **Book**            | `book/booking-form`                                                                           | `ConfirmAndPayViewProps`: `property`, `initialCheckIn`, `initialCheckOut`, `initialGuests`, `currency` |
|                     | `book/templates/booking-template`                                                             | `propertyId`, `searchParams` (async server)                                                            |
|                     | `book/booking-header`, `booking-steps`, `booking-summary-card`, `booking-confirmation-view`   | Step UI; see `BookingStepsProps` etc.                                                                  |
|                     | `book/modals/*`                                                                               | Date / guest / price modals with open state + callbacks                                                |
| **Become a host**   | `become-a-host/become-a-host-template`                                                        | Wizard; checks `localStorage` for auth                                                                 |
|                     | `become-a-host/steps/*`                                                                       | `welcome`, `location`, `property-details`, `ameneties`, `photos`, `pricing` — step props in each file  |
| **Account / host**  | `account/account-view`                                                                        | `profile?`, `bookingsSummary?`                                                                         |
|                     | `host/host-dashboard-view`                                                                    | `listingsSummary?`, `bookingsSummary?`                                                                 |
| **Shared**          | `shared/date-range-picker`                                                                    | Range value, `onChange`, variants (`chip` / default), alignment                                        |
|                     | `shared/guest-selector`                                                                       | Guest counts + `onChange`                                                                              |
|                     | `shared/custom-date-picker`                                                                   | Single/range picker wrapper                                                                            |
|                     | `shared/image-uploader`, `image-preview-modal`                                                | Upload UX; integrates Redux saga                                                                       |
|                     | `shared/modal`                                                                                | `open`, `onOpenChange`, `children`, `className?`, `showCloseButton?` — **`@radix-ui/react-dialog`**    |
|                     | `shared/app-logo`, `user-avatar`, icons                                                       | Branding / avatar helpers                                                                              |
| **Sections**        | `sections/hero-section`, `trust-bar`, `featured-destinations`, `why-us-section`, `cta-banner` | Marketing blocks; hero uses Redux search slice + `useRouter`                                           |

## 5. Data fetching patterns

- **Property listing / detail / home categories**: **No HTTP** — `PropertyUseCase` → `PropertyRepository` returns **in-memory** `MOCK_PROPERTIES`.
- **Search page**: `useSearch` calls `propertyUseCase.getProperties()` once on mount; the sidebar filter state is **not** wired to filter the grid in `SearchTemplate` (the listing receives the full `properties` array as loaded).
- **Uploads**: `UploadRepository.getPresignedUrl` uses **`fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/presign`, …)`**; binary upload uses **`XMLHttpRequest`** for progress (see `upload.repository.ts`).
- **Image preview**: `image-preview-modal` may **`fetch(currentSrc)`** for download-style flows.
- **API surface (planned / partial)**:
  - `src/domain/constants/api.constant.ts` defines **`API_CONSTANTS.BASE_URL`** from **`process.env.APP_ENV === "production"`** → `https://api.booking.com`, else `http://localhost:3000`, plus **auth endpoint path strings**. This module is **not** wired into `AuthRepository` today (auth remains mock).
- **Next config**: `next.config.ts` only configures **`images.remotePatterns`** for `images.unsplash.com` — **no** env-based `rewrites` or API proxy.
- **`next-env.d.ts`**: Standard Next type references only (no env definitions).

## 6. Auth flow

- **State storage**: **Browser `localStorage`** — keys **`authToken`** and **`currentUser`** (JSON), written via `AuthUseCase.saveAuthData` / cleared via `clearAuthData` (`src/domain/use-cases/auth.use-case.ts`).
- **Login path that works today**: **`AuthDialog`** (`header` / `HeaderUserMenu`) calls **`getAuthUseCase().login`**, then **`saveAuthData`**, then **`window.location.reload()`** or redirect from **`sessionStorage.redirectAfterLogin`** (`auth-dialog.tsx`).
- **Dedicated auth pages** (`/signin`, etc.): **Mostly stubs** — e.g. `SignInTemplate` only `console.log`s; **no** `saveAuthData` on those routes yet.
- **“Protected” behavior**:
  - **No Next.js middleware** and **no server-side session** — routes are **not** enforced on the server.
  - **`BecomeAHostTemplate`** reads `localStorage` and can block or prompt when unauthenticated.
  - **`Header`** uses **`localStorage`** on the client to decide logged-in UI vs auth entry points.
- **Post-login redirect**: **`sessionStorage.setItem("redirectAfterLogin", …)`** (e.g. from header when navigating to become-host) consumed in **`AuthDialog`** after successful login.

## 7. Forms

| Form / flow                                      | Mechanism                             | Validation                                         | Backend / target                                          |
| ------------------------------------------------ | ------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Auth dialog (login / signup / reset)             | Native `<form>` + **`FormData`**      | Minimal (try/catch on use case errors)             | **`AuthUseCase`** → mock **`AuthRepository`** (not HTTP)  |
| `/signin` page                                   | `SignInView` + template               | Uncontrolled inputs; no schema                     | Template **TODO** — no API                                |
| `/signup`, `/forgot-password`, `/reset-password` | Native inputs in **Card**             | None                                               | **TODO** comments only                                    |
| Booking (`BookingForm`)                          | React state + modals for dates/guests | UI-level (e.g. agreement checkbox); **no** Zod/RHF | **No** submit API — local confirmation state              |
| Become-a-host steps                              | Per-step local state                  | Not schema-based                                   | Listing creation **not** hooked to HTTP in reviewed files |
| Search / hero                                    | Buttons + pickers                     | N/A                                                | Navigation + Redux for hero search prefs                  |

**Libraries**: **No Zod, yup, or react-hook-form** in the codebase.

## 8. Environment variables

No `.env.example` or `.env*` files are in the repo; only **code references** found:

| Variable                  | Where used                                     | Intended role                                                                                                             |
| ------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`NEXT_PUBLIC_API_URL`** | `src/domain/repositories/upload.repository.ts` | Base URL for **`POST /upload/presign`** (must be absolute or same-origin for browser `fetch`)                             |
| **`APP_ENV`**             | `src/domain/constants/api.constant.ts`         | When exactly **`"production"`**, `API_CONSTANTS.BASE_URL` is `https://api.booking.com`; otherwise `http://localhost:3000` |

**Note**: `API_CONSTANTS` is currently **orthogonal** to upload (`NEXT_PUBLIC_API_URL`) and **unused** by mock auth — document for **intended** integration, not current runtime behavior.

## 9. Conventions

- **Naming**: **PascalCase** React components; **kebab-case** filenames common for pages; **templates** suffix for route-level composition (`*-template.tsx`); **views** for presentational slices (`*-view.tsx`).
- **Imports**: **`@/`** alias maps to **`src/`** (`tsconfig.json` `"paths"`).
- **Server vs client**: Pages and async templates stay **server**; interactive leaves use **`"use client"`** at the top of the file (large portion of `src/components/**`).
- **CSS**: **Tailwind utility-first**; design tokens as **CSS variables** in `globals.css` (`--primary`, `--radius`, `--header-height`, chart/sidebar tokens, `.dark` overrides). **`@custom-variant dark`** for dark mode class strategy.
- **Structure**: **Feature folders** under `components` (`auth`, `book`, `property`, `search`, …); **domain** logic isolated under `src/domain`; **Redux** limited to search + upload; **DI container** side-effect: ensure `reflect-metadata` is loaded before resolving (handled from root layout).
- **Data for SSR templates**: Async server components call **`getPropertyUseCase()`** etc. directly — keep repositories **serialization-safe** if you later swap mocks for `fetch`.
