# Stayly Web — Context Index

> Booking platform web app. Next.js 16 App Router · React 19 · TypeScript strict · pnpm
> Path alias: `@/*` → `./src/*`

---

## What this system is

**Stayly** is a property booking platform (think Airbnb-style). Guests browse properties, search by location/dates/guests, view listings, and book stays. Hosts manage their listings via a dashboard.

**Current state — largely production-ready frontend:**

```
Real today:   UI, routing, Redux search state, image upload (presigned URL),
              Auth HTTP calls (login/signup/social) + saveAuthData() wired,
              Property data (real HTTP), Booking flow (real HTTP),
              Host property onboarding (create/edit drafts via HTTP),
              Host & guest dashboards

Mocked today: (nothing — all repositories hit real HTTP)

Stubs/TODO:   Footer links (/cookies etc.) — no backing page.tsx
              .env.example — doesn't exist yet
```

**Three route groups:**

- `(core)` — public + logged-in pages: `/`, `/search`, `/properties/[id]`, `/properties/[id]/photos`, `/book/[propertyId]`, `/book/[propertyId]/status`, `/account`, `/become-host`, `/dashboard/*`
- `(auth)` — centered auth shell: `/signin`, `/signup`, `/forgot-password`, `/reset-password`
- `(host)` — legacy host shell: `/host/dashboard` (superseded by `/dashboard/host`)

---

## Architecture at a glance

**Clean Architecture + tsyringe DI:**

```
Server/Client Components
  → Use Cases (src/domain/use-cases/)
    → Repository Interfaces (src/data/interfaces/)
      → Repository Implementations (src/data/repositories/)
        → HTTP (fetch / XHR) ← all repositories now hit real HTTP
```

**Never call fetch/HTTP directly from components.** Always go through a use case.

**tsyringe container** (`src/domain/di/container.ts`) wires tokens → implementations.
`reflect-metadata` must be imported before the container resolves — loaded via side-effect in `src/lib/utils/reflect-metadata.ts`, imported by `src/app/layout.tsx`.

**Page pattern — server wraps client:**

```
page.tsx (Server Component)
  → <XxxTemplate />   (*-template.tsx — server composition layer)
    → <XxxView />     (*-view.tsx — "use client", presentational leaf)
```

**State management:** Redux Toolkit + redux-saga. Two slices: `search`, `upload`.

---

## Critical gotchas

- **Tailwind v4** — no `tailwind.config.*` file. Config lives in `globals.css` via CSS variables. Use `bg-linear-to-*` not `bg-gradient-to-*`.
- **No middleware.ts** — zero server-side route enforcement. Auth is client-side cookies (`auth_token`, `auth_user` via `src/lib/utils/cookies.ts`). Use `useAuthGuard` hook for client-side protection.
- **`reflect-metadata` must load first** — it's a side-effect import in `layout.tsx`. Never remove or reorder it.
- **No Zod, react-hook-form, Axios, RTK Query** — forms use native `<form>` + `FormData` or controlled state. HTTP uses `fetch`/`XHR`.
- **Auth pages are fully wired** — `/signin` and `/signup` call `saveAuthData()` and redirect. Forgot/reset password also wired.
- **All repositories hit real HTTP** — no more `MOCK_PROPERTIES`. `NEXT_PUBLIC_API_URL` must be set.
- **Search filters are wired end-to-end** — `useSearch` + `useSearchFilters` hooks drive the search page.
- **No `.env.example`** — create one when adding real env vars. Active vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`.
- **Footer links are placeholders** — `/cookies` etc. have no backing `page.tsx`.
- **Max component size ~200 lines** — extract sub-components if larger.
- **All coding rules** are in `.claude/nextjs-rules.md` — always read before writing code.

---

## Load the right reference

| Task                                           | Load                   |
| ---------------------------------------------- | ---------------------- |
| Adding / modifying a page or feature           | `refs/module-guide.md` |
| Auth, session, login flow                      | `refs/auth.md`         |
| Data fetching, repositories, use cases, DI     | `refs/data-layer.md`   |
| Redux state, slices, sagas                     | `refs/state.md`        |
| Styling, Tailwind v4, design tokens, dark mode | `refs/styling.md`      |
| API endpoints, environment variables           | `refs/api.md`          |
| App Router structure, file locations           | `refs/directory.md`    |
| Tech stack, library versions                   | `refs/stack.md`        |
| What's real vs mocked vs TODO                  | `refs/stubs.md`        |
