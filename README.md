# Stayly — Web

Frontend for **Stayly**, a property booking platform. Guests search and book stays; hosts list and manage properties from a dashboard.

Built with Next.js 16 (App Router), React 19, TypeScript strict mode, and Tailwind CSS v4. Talks to the NestJS API in [`../backend`](../backend).

---

## Requirements

- Node.js 20+
- pnpm 9+
- A running instance of the backend API (default `http://localhost:8001`)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values below
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` in this directory. No `.env*` files are committed.

| Variable                       | Required | Description                                                                       |
| ------------------------------ | -------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Yes      | Base URL of the backend API, e.g. `http://localhost:8001`                          |
| `NEXT_PUBLIC_SITE_URL`         | No       | Canonical site URL used for SEO metadata                                          |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No       | Google OAuth web client id. If unset, the Google button hides; email login still works |
| `API_INTERNAL_URL`             | No       | Server-only. Direct API origin used by SSR to bypass CDN bot protection           |
| `INTERNAL_API_SECRET`          | No       | Server-only. Sent as the `x-origin-key` header on SSR requests                     |

> Never prefix server-only variables with `NEXT_PUBLIC_` — that exposes them to the browser.

## Scripts

| Command       | Description                             |
| ------------- | --------------------------------------- |
| `pnpm dev`    | Start the dev server on port 3000       |
| `pnpm build`  | Production build                        |
| `pnpm start`  | Serve the production build              |
| `pnpm lint`   | ESLint                                  |
| `pnpm format` | Prettier write over the whole project   |

## Tech stack

| Concern          | Choice                                          |
| ---------------- | ----------------------------------------------- |
| Framework        | Next.js 16 — App Router only, no `pages/`       |
| UI               | Tailwind CSS v4 (CSS-first config) + shadcn/ui  |
| Icons            | `lucide-react`                                  |
| State            | Redux Toolkit + redux-saga                      |
| DI               | tsyringe + `reflect-metadata`                   |
| Dates            | `date-fns` + `react-day-picker`                 |
| Maps             | `leaflet` + `react-leaflet`                     |
| Payments         | Cashfree JS SDK                                 |
| HTTP             | native `fetch` / `XHR` — no Axios               |

Deliberately **not** used: React Query, Axios, Zod, react-hook-form, NextAuth.

## Project structure

```
src/
├── app/            # App Router routes
│   ├── (core)/     # Public + authenticated pages: /, /search, /properties, /book, /dashboard
│   ├── (auth)/     # Auth shell: /signin, /signup, /forgot-password, /reset-password
│   └── (host)/     # Legacy host shell (superseded by /dashboard/host)
├── components/     # Feature-grouped components + ui/ (shadcn primitives)
├── domain/         # Use cases, entities, DI container, API endpoint constants
├── data/           # Repository interfaces + HTTP implementations
├── store/          # Redux slices, actions, channels
├── saga/           # redux-saga root + watchers
├── hooks/          # Shared hooks (useAuth, useAuthGuard, typed redux hooks)
└── lib/            # Utilities (cn, cookies, URL params, mappers)
```

Path alias: `@/*` → `./src/*`.

## Architecture

The app follows a clean-architecture layering with tsyringe for dependency injection:

```
Component  →  Use Case  →  Repository Interface  →  Repository Implementation  →  HTTP
```

Components never call `fetch` directly — always go through a use case resolved from the DI container (`src/domain/di/container.ts`).

Pages follow a server-wraps-client pattern:

```
page.tsx (Server Component)
  └── *-template.tsx   (server composition)
        └── *-view.tsx ("use client" presentational leaf)
```

## Conventions

- TypeScript `strict` — no `any` without a justifying comment.
- Keep components under ~200 lines; extract sub-components beyond that.
- Prefer existing shadcn/ui primitives in `src/components/ui` before adding new ones.
- Auth is client-side (cookies + `useAuthGuard`); there is no `middleware.ts` route enforcement.
- The API rejects unknown request keys (`400 property <key> should not exist`) — build request bodies from an explicit allow-list, never by spreading a form or entity object.
- Tailwind v4 has no `tailwind.config.*`; design tokens live in `src/app/globals.css`.

## External images

Only `images.unsplash.com` is whitelisted in [next.config.ts](next.config.ts). Add any new image host there before using it with `next/image`.

## Deployment

Standard Next.js build. Set the environment variables above in the hosting provider, then:

```bash
pnpm build && pnpm start
```

## Further docs

Detailed working notes for contributors live in [.claude/](.claude/) — API contract (`refs/api.md`), data layer, state, styling, and module guides.
