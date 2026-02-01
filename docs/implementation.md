# Booking Platform — Web Implementation Plan

This document maps the **design reference** and **booking platform** specs to the current Next.js web app. It defines what to build, where it lives, and in what order.

**Related docs:**

- [Design Reference](./design_reference.md) — UI components, layouts, and data shape.
- [Booking Platform](./booking_platform.md) — Backend (NestJS, PostgreSQL, Redis), APIs, and domain.

---

## 1. Current Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, body)
│   ├── page.tsx            # Home: PropertyListingTemplate
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── layout/
│   │   └── index.tsx       # Layout stub (empty)
│   ├── property/
│   │   ├── index.tsx      # Exports PropertyListingTemplate
│   │   └── templates/
│   │       └── property-list.tsx   # Async list via getPropertyUseCase().getProperties()
│   └── ui/
│       └── button.tsx      # shadcn-style button
├── domain/
│   ├── di/                 # Container, types, index
│   ├── entities/
│   │   ├── index.ts
│   │   └── property.entity.ts   # PropertyEntity { id, name }
│   ├── interfaces/
│   │   └── property.repository.interface.ts
│   ├── repositories/
│   │   └── property.repository.ts
│   └── use-cases/
│       └── property.use-case.ts
└── lib/
    └── utils/
        ├── reflect-metadata.ts
        └── utils.ts
```

**Existing behavior:** Home page renders `PropertyListingTemplate`, which fetches properties via DI and displays `property.id` and `property.name`. No AppLayout, Header, Sidebar, or card UI yet.

---

## 2. Target Structure (Where to Add Code)

Align new code with the [Design Reference §10 Component Tree](./design_reference.md#10-component-tree) and keep domain/use-cases for data.

| Area                | Location                                                 | Purpose                                                         |
| ------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| App shell           | `src/components/layout/`                                 | AppLayout, Header, Sidebar, MainContent                         |
| Header              | `src/components/header/`                                 | Logo, NavTabs, SearchBar, FilterButton, UserAvatarMenu          |
| Sidebar             | `src/components/sidebar/`                                | Category rail (home), Nav rail (search), ViewModeToggle         |
| Property list/cards | `src/components/property/`                               | ListingCard (grid), PropertyCard (list), ListingGrid, templates |
| Filter              | `src/components/filter/`                                 | FilterDrawer, PriceRange, TypeOfPlace, RoomsBedsBaths           |
| Property detail     | `src/components/property/` or `src/app/properties/[id]/` | Gallery, TitleBlock, HostInfoCard, ReviewCard, BookingWidget    |
| Shared UI           | `src/components/ui/`                                     | Badge, Avatar, Dropdown, Card, Input, Checkbox, etc.            |
| Pages/routes        | `src/app/`                                               | `/` (home), `/search` or `/stays`, `/properties/[id]`           |
| Domain              | `src/domain/`                                            | Extend Property entity; keep repositories/use-cases             |

---

## 3. Data Alignment

The [Design Reference §12](./design_reference.md#12-data-structure-json-schema) defines the listing/detail shape. Align the web app and API with it.

**Current entity** (`src/domain/entities/property.entity.ts`):

```ts
export interface PropertyEntity {
  id: string;
  name: string;
}
```

**Target shape** (match design reference and backend API when available):

- `id`, `type`, `location` (city, state, coordinates), `title`
- `host`: name, image, isSuperhost
- `stats`: rating, reviewCount
- `amenities`: string[]
- `pricing`: amount, currency, frequency
- `images`: string[]

**Implementation steps:**

1. Extend `PropertyEntity` (or add a DTO) with the fields above; keep backward compatibility during migration.
2. Update repository/use-case return types and any API client types to use this shape.
3. Use the same shape in ListingCard, PropertyCard, and property detail page.

---

## 4. Phased Implementation

### Phase 1 — App Shell & Homepage Grid

**Goal:** AppLayout wrapping Header, Sidebar, and MainContent; homepage shows a grid of listing cards using existing property data (extended as needed).

| Task                   | Reference   | Files to create/update                                                                                |
| ---------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| AppLayout              | Design §1   | `src/components/layout/app-layout.tsx`, use in `layout.tsx` or `page.tsx`                             |
| Header shell           | Design §2   | `src/components/header/index.tsx` (Logo, NavTabs placeholder, UserAvatar placeholder)                 |
| Sidebar shell          | Design §3.1 | `src/components/sidebar/category-rail.tsx` (dark bar, grid/map icons, category icons placeholder)     |
| MainContent            | Design §4.1 | Part of AppLayout; children = ListingGrid                                                             |
| ListingGrid            | Design §4.1 | `src/components/property/listing-grid.tsx` (responsive grid)                                          |
| ListingCard            | Design §5.1 | `src/components/property/listing-card.tsx` (image, heart, title, location, price, rating)             |
| Extend Property entity | Design §12  | `src/domain/entities/property.entity.ts` (add fields; optional defaults for existing repo)            |
| Wire home page         | —           | `src/app/page.tsx`: AppLayout → Sidebar + MainContent with ListingGrid; feed properties from use-case |

**Done when:** Home page has header, left category sidebar, and a grid of listing cards (image, title, location, price, rating). Data can still be from current repo with minimal fields (e.g. name → title, placeholder image/price/rating).

---

### Phase 2 — Header Search, Guest Selector & Filter Drawer

**Goal:** Header search bar (location, dates, guests), filter button opens Filter Drawer; drawer content as per design.

| Task                     | Reference         | Files to create/update                                                                    |
| ------------------------ | ----------------- | ----------------------------------------------------------------------------------------- |
| SearchBar                | Design §2.3       | `src/components/header/search-bar.tsx` (LocationDropdown, DateRangePicker, GuestSelector) |
| FilterButton             | Design §2.3       | In Header; opens Filter Drawer (state or URL)                                             |
| FilterDrawer             | Design §6         | `src/components/filter/filter-drawer.tsx` (slide from right, header, sections, footer)    |
| PriceRange               | Design §6.3       | `src/components/filter/price-range.tsx` (average text, min/max inputs)                    |
| TypeOfPlace              | Design §6.3       | `src/components/filter/type-of-place.tsx` (checkboxes + descriptions)                     |
| RoomsBedsBaths           | Design §6.3       | `src/components/filter/rooms-beds-baths.tsx` (pills: Any, 1–5+)                           |
| Clear All / Show X Homes | Design §6.2, §6.4 | FilterDrawer header + footer; wire to filter state and result count                       |

**Done when:** Header has full search bar and filter button; clicking filter opens drawer with Price range, Type of place, Rooms/beds/baths, Clear All, and “Show X Homes”. Filter state can be local (no backend required for UI).

---

### Phase 3 — Search & Discovery Page (List + Map)

**Goal:** Dedicated search page with filter bar, sort, list/grid toggle, scrollable list pane, and sticky map with price markers.

| Task                | Reference       | Files to create/update                                                                                                        |
| ------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Route               | Design §7       | `src/app/search/page.tsx` (or `src/app/stays/page.tsx`)                                                                       |
| Search page layout  | Design §7.1–7.5 | Template: header (“X stays in [City]”), filter bar, search input, sort, list/grid toggle, list pane + map pane                |
| Filter bar (search) | Design §7.2     | Location, date range, “Any price”, “More filters” (opens same FilterDrawer)                                                   |
| PropertyCard (list) | Design §5.2     | `src/components/property/property-card.tsx` (horizontal: image, type+title, host, amenities, rating, price, “Guest favorite”) |
| List pane           | Design §7.4     | Scrollable list of PropertyCards; “Show more” (cursor or page)                                                                |
| Map pane            | Design §7.5     | Sticky map column; Map/Satellite toggle; zoom; price markers (e.g. Google Maps overlay)                                       |
| Mobile              | Design §7.6     | Map hidden by default; floating “Map” button; “X filters applied”                                                             |
| Nav rail            | Design §3.2     | On search page use nav rail (logo, Home, Search, Wishlist, etc.) instead of category rail                                     |

**Done when:** `/search` (or `/stays`) shows list + map, filter bar, sort, list/grid toggle, and PropertyCards; map shows price markers; mobile has map toggle.

---

### Phase 4 — Property Detail Page

**Goal:** Property detail route with gallery, title block, key info, description, map, host card, reviews, and sticky booking widget (or host+reviews for experiences).

| Task                  | Reference                    | Files to create/update                                                               |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| Route                 | Design §8                    | `src/app/properties/[id]/page.tsx`                                                   |
| Layout                | Design §8.1–8.3              | Two-column: main (gallery, title, key info, description, map, CTAs) + sticky sidebar |
| Gallery               | Design §8.2                  | Hero image + thumbnails (e.g. 3 + “5+”); click to change hero                        |
| TitleBlock            | Design §8.2                  | Title, location, rating, category tags, price                                        |
| KeyInfoRow            | Design §8.2                  | Duration/nights, activity level (optional), hosted in, includes/amenities            |
| Description + Map     | Design §8.2                  | “Read more”; small embedded map with pin                                             |
| CTAs                  | Design §8.2                  | “Check Dates” / “Reserve” (primary); “Add to favourite” (secondary)                  |
| BookingWidget (stays) | Design §8.3                  | Sticky sidebar: date picker, price summary, Reserve                                  |
| HostInfoCard          | Design §8.3, §3.3            | Avatar, name, stars, bio, “Contact Host”                                             |
| ReviewCard            | Design §8.3                  | Avatar, name, date, review text; list or grid                                        |
| Data                  | Design §12, booking_platform | Fetch property by id (use-case or API); reviews and host from same API/entity        |

**Done when:** `/properties/[id]` renders full detail layout with gallery, info, description, map, host, reviews, and booking widget (or host+reviews only for experiences).

---

## 5. UI Primitives (Add as Needed)

Refer to [Design Reference §9, §11](./design_reference.md#9-ui-patterns--design-elements). Add under `src/components/ui/` when first needed:

- **Badge** — “Guest favorite”, category tags.
- **Avatar** — Header user menu, host, reviews.
- **Card** — ListingCard, PropertyCard, HostInfoCard, ReviewCard.
- **Dropdown** — Location, date range, price in header/search.
- **Input** — Search, min/max price, guest count.
- **Checkbox** — Type of place.
- **Pills/Chips** — Bedrooms, beds, baths (Any, 1–5+).

Use existing `button.tsx`; add icons (e.g. lucide-react) for heart, filter, calendar, star, etc.

---

## 6. Tech Stack Notes

- **Styling:** Tailwind (already in use); align with design reference (red accent, dark sidebar, sticky map).
- **Animations:** Filter drawer — CSS transform or Framer Motion `AnimatePresence` (Design §13).
- **Map:** Google Maps (or Mapbox) with custom price overlays; `position: sticky; height: 100vh` for map column (Design §13).
- **Data:** Keep domain/use-cases; extend Property entity and repository to match Design §12; later wire to booking_platform APIs (see [booking_platform.md](./booking_platform.md) for API design).

---

## 7. Implementation Checklist (from Design Reference)

| Item                                                                                       | Status | Notes      |
| ------------------------------------------------------------------------------------------ | ------ | ---------- |
| AppLayout wraps Header, Sidebar, MainContent                                               | ☐      | Phase 1    |
| Header: Logo, NavTabs, SearchBar, FilterButton, UserAvatar                                 | ☐      | Phase 1–2  |
| Sidebar: category rail (home) / nav rail (search)                                          | ☐      | Phase 1, 3 |
| ListingGrid + ListingCard on home                                                          | ☐      | Phase 1    |
| Property entity aligned with Design §12                                                    | ☐      | Phase 1    |
| FilterDrawer: Price, Type of place, Rooms/beds/baths, Clear All, Show X Homes              | ☐      | Phase 2    |
| Search page: filter bar, sort, list/grid, list pane, map pane                              | ☐      | Phase 3    |
| PropertyCard (horizontal) on search page                                                   | ☐      | Phase 3    |
| Map: sticky, price markers, Map/Satellite                                                  | ☐      | Phase 3    |
| Property detail: gallery, title, key info, description, map, host, reviews, booking widget | ☐      | Phase 4    |
| Responsive: map hidden on mobile, floating Map button                                      | ☐      | Phase 3    |
| List/grid toggle reuses same data                                                          | ☐      | Phase 3    |

---

## 8. Summary

- **Design Reference** = single source of truth for UI and data shape.
- **Booking Platform** = backend APIs and domain; extend web domain/entities to match and call APIs when ready.
- **Implementation order:** App shell + homepage grid → Header search + Filter Drawer → Search & Discovery page → Property Detail page.
- **File map:** Layout/header/sidebar under `components/layout`, `components/header`, `components/sidebar`; property components and templates under `components/property`; filter under `components/filter`; shared primitives under `components/ui`; routes under `app/`.

Update this doc as phases are completed or scope changes.
