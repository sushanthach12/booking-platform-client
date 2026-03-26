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
│   │   ├── book/[propertyId]/  # /book/:propertyId
│   │   ├── account/            # /account
│   │   └── become-host/        # /become-host
│   ├── (auth)/                 # Centered auth shell (no URL segment)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── (host)/                 # Host shell (no URL segment)
│       └── host/dashboard/
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── shared/                 # Cross-feature atoms (Modal, DateRangePicker, etc.)
│   ├── sections/               # Marketing sections (Hero, TrustBar, FeaturedDestinations…)
│   ├── header/ footer/
│   ├── auth/                   # AuthDialog, SignInView, templates
│   ├── property/               # Listing card, detail view, gallery, booking widget
│   ├── search/                 # SearchTemplate, header, sidebar, listing
│   ├── book/                   # BookingTemplate, BookingForm, modals, steps
│   ├── become-a-host/          # Wizard + step components
│   ├── account/                # AccountView, EditProfileModal, AccountTemplate
│   ├── host/                   # HostDashboardView, HostDashboardTemplate
│   └── providers/              # ReduxProvider
│
├── domain/
│   ├── constants/api.constant.ts   # All API endpoint strings + base URLs
│   ├── di/                         # tsyringe container + TOKENS + helper getters
│   ├── entities/                   # PropertyEntity, PropertySearchParams
│   ├── interfaces/                 # Form-shape interfaces (become.host, guest) — NOT repository interfaces
│   └── use-cases/                  # AuthUseCase, PropertyUseCase, UploadUseCase
│
├── data/
│   ├── interfaces/                 # IPropertyRepository, IAuthRepository, IUploadRepository + auth.interface.ts
│   └── repositories/               # Implementations: PropertyRepository (mock), AuthRepository (HTTP), UploadRepository (HTTP)
│
├── store/
│   ├── index.ts                # configureStore
│   └── slices/                 # search-slice.ts, upload.slice.ts
│
├── saga/                       # root.saga.ts + upload.saga.ts
├── hooks/                      # redux.ts (useAppDispatch / useAppSelector)
│
├── lib/
│   ├── utils.ts                # cn() helper
│   └── utils/                  # booking-params, map-property, reflect-metadata side-effect
│
├── constant/                   # app.constant.ts (APP_NAME), metadata.ts (BASE_METADATA)
├── types/                      # categories.ts (PROPERTY_CATEGORIES)
└── data/interfaces/            # (see data/ block above — also contains become.host + guest form-shape interfaces via domain/interfaces/)
```
