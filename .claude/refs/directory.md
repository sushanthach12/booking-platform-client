# Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts + ReduxProvider + reflect-metadata
│   ├── globals.css             # Tailwind v4 + CSS design tokens + dark mode
│   ├── (core)/                 # Public + logged-in pages (no URL segment)
│   │   ├── page.tsx            # /
│   │   ├── search/page.tsx     # /search
│   │   ├── properties/[id]/    # /properties/:id  +  /photos
│   │   ├── book/[propertyId]/  # /book/:propertyId  +  /status
│   │   ├── account/            # /account
│   │   ├── become-host/        # /become-host  (multi-step wizard)
│   │   └── dashboard/          # /dashboard/* (guest + host)
│   │       ├── bookings/       # /dashboard/bookings
│   │       ├── profile/        # /dashboard/profile
│   │       ├── wishlist/       # /dashboard/wishlist
│   │       └── host/           # /dashboard/host/* (host dashboard)
│   │           ├── page.tsx    # /dashboard/host (overview)
│   │           ├── listings/   # /dashboard/host/listings + [id]
│   │           ├── calendar/
│   │           ├── reservations/
│   │           ├── reviews/
│   │           ├── payouts/
│   │           └── settings/
│   ├── (auth)/                 # Centered auth shell (no URL segment)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── (host)/                 # Legacy host shell — superseded by (core)/dashboard/host
│       └── host/dashboard/
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── shared/                 # Cross-feature atoms (DateRangePicker, GuestSelector, ImageUploader, Icons)
│   ├── sections/               # Marketing sections (Hero, TrustBar, FeaturedDestinations…)
│   ├── header/ footer/
│   ├── auth/                   # AuthDialog, SignInView, SignUpView, templates
│   ├── property/               # Listing card, detail view, gallery, booking widget
│   ├── search/                 # SearchTemplate, header, sidebar, listing, filter hooks
│   ├── filter/                 # Filter components (price, amenities, property type, rating)
│   ├── book/                   # BookingTemplate, BookingForm, BookingStatusView, modals, steps
│   ├── become-a-host/          # Multi-step wizard (welcome, property-details, location, pricing, amenities, photos)
│   ├── account/                # AccountView, EditProfileModal, AccountTemplate
│   ├── host/                   # HostDashboardView, HostDashboardTemplate (legacy)
│   ├── dashboard/              # Guest + host dashboard components
│   ├── map/                    # Map component
│   └── providers/              # ReduxProvider
│
├── domain/
│   ├── constants/api.constant.ts   # All API endpoint strings + base URLs
│   ├── di/                         # tsyringe container + TOKENS + helper getters
│   ├── entities/                   # PropertyEntity, PropertySearchParams, booking entities
│   ├── hooks/                      # dashboard/ — dashboard-specific hooks
│   ├── interfaces/                 # Form-shape interfaces (become-host, guest, booking)
│   └── use-cases/                  # AuthUseCase, PropertyUseCase, UploadUseCase, BookingUseCase, HostPropertyUseCase
│
├── data/
│   ├── interfaces/                 # IPropertyRepository, IAuthRepository, IUploadRepository,
│   │                               # IBookingRepository, IHostPropertyRepository + auth.interface.ts
│   └── repositories/               # Implementations (all real HTTP):
│                                   # PropertyRepository, AuthRepository, UploadRepository,
│                                   # BookingRepository, HostPropertyRepository
│
├── store/
│   ├── index.ts                # configureStore
│   ├── actions/                # Redux action creators
│   ├── channels/               # Redux-saga channels
│   └── slices/                 # search-slice.ts, upload.slice.ts
│
├── saga/                       # root.saga.ts + upload.saga.ts
│
├── hooks/
│   ├── redux.ts                # useAppDispatch / useAppSelector
│   ├── use-auth.ts             # Auth state reading hook
│   └── use-auth-guard.ts       # Client-side route protection hook
│
├── lib/
│   ├── utils.ts                # cn() helper
│   └── utils/                  # booking-params, map-property, reflect-metadata side-effect, cookies
│
├── constant/                   # app.constant.ts (APP_NAME), metadata.ts (BASE_METADATA, NEXT_PUBLIC_SITE_URL)
└── types/                      # categories.ts (PROPERTY_CATEGORIES)
```
