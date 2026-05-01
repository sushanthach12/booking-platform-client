# Component Conventions & Module Guide

## File Naming

| Artifact            | Convention                                            |
| ------------------- | ----------------------------------------------------- |
| Components          | PascalCase (`PropertyCard.tsx`)                       |
| Files               | kebab-case (`property-card.tsx`)                      |
| Route-level shell   | `*-template.tsx` — server composition layer           |
| Presentational leaf | `*-view.tsx` — `"use client"`, owns interactive state |
| Hooks               | `use-*.ts` (kebab) / `useXxx` (camelCase export)      |

## Server vs Client Split

```
page.tsx              ← Server Component (default)
  └── *-template.tsx  ← Server or async — composes layout, calls use cases
        └── *-view.tsx  ← "use client" — interactive, uses hooks + Redux
```

`"use client"` goes at the top of every interactive component file.
Pages stay server — children opt in.

## Feature Folder Pattern

```
components/[feature]/
├── index.ts                # barrel export
├── [feature]-template.tsx  # server composition
├── [feature]-view.tsx      # client leaf
├── components/             # smaller pieces
└── hooks/                  # feature-specific hooks
```

## Adding a New Page / Feature

1. Create `src/app/(group)/[route]/page.tsx` — Server Component, renders `<XxxTemplate />`
2. Create `src/components/[feature]/[feature]-template.tsx`
3. Create `src/components/[feature]/[feature]-view.tsx` with `"use client"`
4. If data needed: add entity interface → repository interface → HTTP implementation → use case → register in DI container → add helper getter
5. Export from `src/components/[feature]/index.ts`

## UI Primitives

shadcn/ui components in `src/components/ui/` — never re-implement what exists there.
Extend via CVA variants only. Use `cn()` from `@/lib/utils` for class merging.

## Forms

No Zod, no react-hook-form.

- Simple forms: native `<form>` + `FormData`
- Complex forms: controlled React state + local `useState`
- Validation: manual try/catch on use case calls

## Max Component Size

~200 lines. Extract sub-components if larger.

## Barrel Exports

Feature folders export via `index.ts`. Import from the folder, not the file.

## Route Inventory

| URL                            | Template                   | Client component                   |
| ------------------------------ | -------------------------- | ---------------------------------- |
| `/`                            | `(core)/page.tsx`          | `HeroSection` (uses Redux)         |
| `/search`                      | `SearchTemplate`           | `useSearch` + filter hooks         |
| `/properties/[id]`             | `PropertyDetailsTemplate`  | `PropertyDetailsView`              |
| `/properties/[id]/photos`      | —                          | `PhotoTour`                        |
| `/book/[propertyId]`           | `BookingTemplate`          | `BookingForm`                      |
| `/book/[propertyId]/status`    | —                          | `BookingStatusView`                |
| `/account`                     | `AccountTemplate`          | `AccountView` + `EditProfileModal` |
| `/become-host`                 | `BecomeAHostTemplate`      | Multi-step wizard                  |
| `/dashboard/bookings`          | Dashboard template         | Guest bookings view                |
| `/dashboard/profile`           | Dashboard template         | Profile view                       |
| `/dashboard/wishlist`          | Dashboard template         | Wishlist view                      |
| `/dashboard/host`              | Host dashboard template    | Host overview                      |
| `/dashboard/host/listings`     | Host listings template     | Listings management                |
| `/dashboard/host/calendar`     | Host calendar template     | Calendar view                      |
| `/dashboard/host/reservations` | Host reservations template | Reservations management            |
| `/dashboard/host/reviews`      | Host reviews template      | Reviews view                       |
| `/dashboard/host/payouts`      | Host payouts template      | Payouts view                       |
| `/dashboard/host/settings`     | Host settings template     | Settings view                      |
| `/signin` `/signup` etc.       | Auth templates             | Fully wired — calls HTTP           |
