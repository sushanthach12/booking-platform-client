# Booking Platform — Design Reference

This document consolidates **design inspiration and UI specs** for the booking platform (Airbnb-style). It covers the **homepage**, **search & discovery** (list + map), **property detail page**, and **filter drawer**, and is structured to support frontend architecture, component splitting, and implementation.

---

## 1. App Shell / Layout

### 1.1 Root Layout (`AppLayout`)

- Handles global padding, background, and responsive grid.
- Wraps **Header**, **Sidebar** (or navigation rail), and **Main Content**.
- Naming: use **AppLayout** consistently (same as MainLayout).

---

## 2. Top Navigation Bar (Header)

### 2.1 Brand Section

- **Logo** — Clickable; red accent (e.g. Airbnb-style wordmark with house icon).

### 2.2 Primary Navigation (`NavTabs`)

- **Stays** (active state: red underline)
- **Experiences**
- **Online Experiences**

### 2.3 Search & Filters Bar (`SearchBar`)

Single horizontal bar, rounded, containing:

- **LocationDropdown** — Pill-style; label e.g. "Anywhere" with dropdown arrow.
- **DateRangePicker** — Calendar icon + date range (e.g. "June 14 - 21").
- **GuestSelector** — Minus | "4 guests" | Plus within one rounded control.
- **FilterButton** — Circular button with funnel icon (opens Filter Drawer).
- **UserAvatarMenu** — Circular profile image, top-right; dropdown for account.

> On **Search & Discovery** page, the bar can show: Location (e.g. "Melbourne, AU"), Date range ("May 16 - May 18"), Price ("Any price"), and "More filters" instead of a single search button.

---

## 3. Left Sidebar

### 3.1 Homepage — Category Rail

- **Visuals:** Dark gray vertical bar, full height; scrollable (scrollbar visible).
- **Top row (view mode):**
  - **Grid/dashboard icon** — List/grid view (active).
  - **Map icon** — Map view.
- **Body:** Vertical list of **icon-only category** items (property types), e.g.:
  - A-frame cabin, Castle, Windmill, Ski, Surfer, Island, Pool, Barn, Beach hut, Treehouse, Tiny house, Container, Lighthouse, Cave, Igloo, Tent, Boat, Cocktail, etc.
- No text labels on category icons in the reference; optional tooltips for a11y.

### 3.2 Search / Other Pages — Navigation Rail

- **Visuals:** Slim vertical bar (light grey or dark gray depending on screen).
- **Components:** Brand logo (top), Nav group (e.g. Home, Search, Heart/Wishlist, Users, Settings), User avatar (bottom).
- **Responsive:** Becomes a bottom navigation bar on mobile; sidebar can collapse or hide.

---

## 4. Main Content Area

### 4.1 Homepage — Listings Grid (`ListingGrid`)

- Responsive card grid (e.g. 3 columns on desktop; 2–4 depending on viewport).
- White cards on light background; red used for logo and active states.

### 4.2 Search & Discovery — Split View

- **Desktop:** `flex` / `h-screen`. Left (~60%) scrollable list; right (~40%) sticky map.
- **Mobile:** Full-width list with floating "Map" button (bottom center), or map-first with list below.
- **Interaction:** Hover on list card highlights corresponding marker on map.

---

## 5. Listing Card Component

### 5.1 Homepage Card (`ListingCard` — grid version)

- **Image** — Large photo, top of card; rounded top corners.
- **FavoriteButton** — Outlined heart, top-right on image.
- **PropertyTitle** — Bold.
- **LocationText** — Smaller text below title (e.g. "Whitefish, Montana, United States").
- **PricePerNight** — e.g. "$10,000 / night".
- **RatingBadge** — Star icon + value (e.g. "★ 5.0", "★ 4.89").
- No host line or "Guest Favorite" on this view.

### 5.2 Search Results Card (`PropertyCard` — horizontal/list version)

- **Image** — Aspect ratio 4:3, rounded corners; left-aligned thumbnail.
- **Badges** — "Guest Favorite" pill (e.g. laurel/leaf icon) where applicable.
- **Content:**
  - **Type + title** — e.g. "Entire rental unit in Carlton" + "Just a 5-Minute Walk from the University of Melbourne".
  - **Host** — "Hosted by [Name]" with small avatar.
  - **Amenities** — Inline (e.g. "1 bed • Wi-Fi").
  - **Rating** — Star rating + review count (e.g. "4.7 · 82 reviews").
  - **Price** — Bold + currency (e.g. "$490 AUD").

---

## 6. Filter Drawer (Homepage & Search)

### 6.1 Container

- **Behavior:** Slides in from the **right**; overlay or push over main content.
- **Visuals:** Predominantly white; scrollable (e.g. dark pink/maroon scrollbar in reference).

### 6.2 Header

- **Funnel icon** (filter).
- **Title** — "Filters" (bold, large).
- **Clear All** — Red text link; resets all selections.

### 6.3 Sections

**Price range**

- Heading: "Price range."
- Subtext: "The average nightly price is $133" (or dynamic value).
- **Min Price** — Input, e.g. "$0".
- **Max Price** — Input, e.g. "$500+".
- Optional: histogram of average prices.

**Type of place**

- Heading: "Type of place."
- Checkboxes with short descriptions:
  - **Entire place** — "A place all to yourself."
  - **Private room** — "Your own room in a home or a hotel, plus some shared common spaces."
  - **Shared room** — "A sleeping space and common areas that may be shared with others."

**Rooms, beds, and baths**

- Heading: "Rooms, beds, and baths."
- **Bedrooms** — Pills: Any | 1 | 2 | 3 | 4 | 5+ (Any = black bg, white text when selected).
- **Beds** — Same pattern.
- **Baths** — Same pattern (Any, 1, 2, 3, 4, 5+).

### 6.4 Footer

- Sticky bar at bottom.
- Primary button: **"Show [X] Homes"** — dynamic count (e.g. "Show 836 Homes"); prominent (e.g. pink/red in reference).

---

## 7. Search & Discovery Page — Full Spec

### 7.1 Page Header

- **Title** — e.g. "248 stays in Melbourne."
- **Subtitle** — e.g. "Book your next stay at one of our properties."
- **Actions** — "Share" (icon + text), "Save search" (star icon).

### 7.2 Filter Bar (below header)

- Location: dropdown "Melbourne, AU" (globe icon).
- Date range: "May 16 - May 18" (calendar icon).
- Price: "Any price" (dollar icon).
- **More filters** — Opens Filter Drawer.

### 7.3 Search & Sort

- **Search** — Input "Q Search" with "Clear" and "Search" buttons.
- **Sort** — "Sort by date" | "Sort by price" (tabs).
- **Display toggle** — "List" (active) | "Grid" (list = horizontal cards; grid = thumbnail grid).

### 7.4 List Pane

- Scrollable (`overflow-y: auto`).
- List of **PropertyCard** (horizontal version).
- **"Show more"** button at bottom to load more.

### 7.5 Map Pane (desktop)

- **Position:** Sticky; `top: 0`; `height: 100vh`.
- **Controls:** "Map" | "Satellite" toggle; zoom +/-; street view icon (optional).
- **Price markers:** Custom overlays with price (e.g. "$490 AUD", "$510 AUD +2", "$620 AUD +4"); "+N" for cluster count.
- **Attribution:** e.g. "Google" at bottom.

### 7.6 Mobile

- Map can be full-width with price bubbles; "2 filters applied" indicator; list below or behind a sheet.
- Filter drawer same as desktop but full-screen or large panel.

---

## 8. Property Detail Page

### 8.1 Layout

- **Header (global):** Logo, search ("Search destination"), "Become a host", "Sign in".
- **Main:** Two-column. Left ~2/3; right ~1/3 sticky.

### 8.2 Main Column (left)

**Image gallery**

- One **hero image** (large).
- **Thumbnails** — Vertical stack to the left (or below) of hero; e.g. 3 visible + "5+" for more.
- Clicking thumbnail switches hero.

**Title & overview**

- **Title** — Large, prominent.
- **Location** — Below title (e.g. "Kathmandu, Nepal").
- **Rating** — Star rating next to location.
- **Category tags** — Rounded pills (e.g. "Adventure", "Hiking", "Travel", "Culture") for experiences; for stays use type (e.g. "Entire place").
- **Price** — Right-aligned: "From $320/Person" or "From $X/night".

**Key info row** (icon + label)

- Duration (e.g. "4 Days") / Nights for stays.
- Activity level (e.g. "Moderate") — optional for stays.
- Hosted in (e.g. "English").
- Includes (e.g. "Food, Tickets, Transportation, Equipment") or amenities summary for stays.

**Description & map**

- **Description** — Heading + body; "Read more" to expand.
- **Map** — Small embedded map, rounded corners; single pin for location.

**Actions**

- Primary: e.g. **"Check Dates"** or **"Reserve"** (red, with calendar icon).
- Secondary: **"Add to favourite"** (heart icon).

### 8.3 Sidebar (right) — Sticky

**Option A — Stays**

- **Booking widget** — Date picker, price summary, "Reserve" CTA.

**Option B — Experiences (reference image)**

- **Your Host** (`HostInfoCard`):
  - Heading: "Your Host."
  - Avatar (circular), name, star rating.
  - Bio with "Read more" if truncated.
  - **Contact Host** — Teal/outline button.
- **Guest Review** (`ReviewCard` list):
  - Heading: "Guest Review."
  - Each card: avatar, name, date (e.g. "25th March 2019"), review text.
  - Vertical stack or grid.

> For **Stays**, use sticky booking widget in sidebar and place Host + Reviews below main content or in a second column section.

---

## 9. UI Patterns & Design Elements

### 9.1 Reusable UI Components

- `IconButton`, `Badge`, `Avatar`, `Dropdown`, `Card`, `Grid`
- Pills/chips for filters (Any, 1, 2, 3, 4, 5+)
- Checkboxes with sub-labels for "Type of place"

### 9.2 Interaction Patterns

- Hover states on cards; hover on list card highlights map marker.
- Click-to-favorite (heart).
- Dropdown interactions (location, date, price).
- Sticky header and sticky map/sidebar.
- Filter drawer: slide from right; "Clear All"; primary "Show X Homes".

### 9.3 Visual / Brand

- **Primary accent:** Red (logo, active nav underline, primary CTAs).
- **Backgrounds:** White for content; dark gray for sidebar (homepage category rail).
- **Secondary:** Teal for "Contact Host"; pink/red for Filter drawer CTA in reference.

---

## 10. Component Tree

```
AppLayout
 ├── Header
 │    ├── Logo
 │    ├── NavTabs
 │    ├── SearchBar
 │    ├── FilterButton
 │    └── UserAvatarMenu
 ├── Sidebar (category rail or nav rail)
 │    ├── ViewModeToggle (grid | map)  [homepage]
 │    └── SidebarItem[] (categories or nav links)
 └── MainContent
      ├── ListingGrid / ListPane
      │    └── ListingCard[] | PropertyCard[]
      └── MapPane (search page) [optional]
```

**Filter Drawer** (portal/overlay):

```
FilterDrawer
 ├── Header (Filters, Clear All)
 ├── PriceRange (min/max, average text)
 ├── TypeOfPlace (checkboxes)
 ├── RoomsBedsBaths (pills: Bedrooms, Beds, Baths)
 └── Footer (Show X Homes)
```

**Property Detail:**

```
PropertyDetailPage
 ├── Header (global)
 ├── Gallery (hero + thumbnails)
 ├── TitleBlock (title, location, rating, tags, price)
 ├── KeyInfoRow (duration, level, language, includes)
 ├── Description + Map
 ├── CTAs (Check Dates, Add to favourite)
 └── Sidebar (sticky)
      ├── BookingWidget [stays] OR
      ├── HostInfoCard + ReviewCard[] [experiences]
```

---

## 11. Atomic Design Mapping

- **Atoms:** Button, Icon, Text, Image, Input, Checkbox
- **Molecules:** SearchBar, RatingBadge, CardFooter, PriceRangeInputs, TypeOfPlaceCheckboxes, PillGroup
- **Organisms:** Header, Sidebar, ListingCard, PropertyCard, FilterDrawer, HostInfoCard, ReviewCard, BookingWidget, MapPane
- **Templates:** HomepageTemplate, SearchDiscoveryTemplate, PropertyDetailTemplate
- **Pages:** Home / Exploration, Search & Discovery (Stays in [City]), Property Detail

---

## 12. Data Structure (JSON Schema)

For list and detail views, pages can expect data in this shape:

```json
{
  "id": "prop_01",
  "type": "Entire rental unit",
  "location": {
    "city": "Carlton",
    "state": "VIC",
    "coordinates": { "lat": -37.8, "lng": 144.96 }
  },
  "title": "Just a 5-Minute Walk from the University of Melbourne",
  "host": {
    "name": "Caitlyn",
    "image": "/avatar.jpg",
    "isSuperhost": true
  },
  "stats": {
    "rating": 4.7,
    "reviewCount": 82
  },
  "amenities": ["1 bed", "Wi-Fi", "Kitchen"],
  "pricing": {
    "amount": 490,
    "currency": "AUD",
    "frequency": "night"
  },
  "images": ["url1.jpg", "url2.jpg"]
}
```

---

## 13. UI Implementation Checklist

| Feature          | Tech / Strategy                                                             |
| ---------------- | --------------------------------------------------------------------------- |
| Sticky map       | `position: sticky; top: 0; height: 100vh` for map column                    |
| Scroll areas     | `overflow-y: auto` for listing pane                                         |
| Price markers    | Custom overlay components (e.g. Google Maps API)                            |
| Filter drawer    | Framer Motion `AnimatePresence` or CSS transform; slide from right          |
| Responsive map   | Tailwind `hidden md:block` for map on mobile; floating "Map" button         |
| Category sidebar | Scrollable container; fixed or sticky left                                  |
| List/grid toggle | Same data; switch between `PropertyCard` list layout and grid `ListingCard` |

---

## 14. Notes

- Layout supports **scalability** and **micro-frontend–friendly** decomposition.
- Suited to **Next.js / React** component architecture.
- Aligns with real-world booking UI patterns (Airbnb-style).
- **Naming:** Use **AppLayout** for root. **Filter Drawer** (or FilterModal) for the sliding filter panel. **PropertyCard** for search list item; **ListingCard** for homepage grid card.
