# Data Layer — Use Cases, Repositories, DI

## Clean Architecture

```
Components / Server Components
  → Use Cases (src/domain/use-cases/)
    → Interfaces (src/data/interfaces/)
      → Implementations (src/data/repositories/)
        → HTTP (fetch / XHR) — all repositories hit real HTTP
```

**Never call fetch/HTTP directly from components.** Always go through a use case.

## tsyringe DI Container (`src/domain/di/container.ts`)

| Token                            | Implementation           | Status    |
| -------------------------------- | ------------------------ | --------- |
| `TOKENS.IPropertyRepository`     | `PropertyRepository`     | Real HTTP |
| `TOKENS.IAuthRepository`         | `AuthRepository`         | Real HTTP |
| `TOKENS.IUploadRepository`       | `UploadRepository`       | Real HTTP |
| `TOKENS.IBookingRepository`      | `BookingRepository`      | Real HTTP |
| `TOKENS.IHostPropertyRepository` | `HostPropertyRepository` | Real HTTP |
| `TOKENS.UploadUseCase`           | `UploadUseCase`          | Real      |
| `TOKENS.BookingUseCase`          | `BookingUseCase`         | Real      |
| `TOKENS.HostPropertyUseCase`     | `HostPropertyUseCase`    | Real      |

> `PropertyUseCase` and `AuthUseCase` are resolved via class injection (not explicit token registration).

**Helper getters** (`src/domain/di/index.ts`):

```typescript
getPropertyUseCase(); // async server components + client hooks
getAuthUseCase(); // client components
getUploadRepository(); // used by image-uploader
getBookingUseCase(); // booking flow
getHostPropertyUseCase(); // host onboarding
```

## reflect-metadata

Must be imported **before** the container resolves.
Loaded via side-effect in `src/lib/utils/reflect-metadata.ts`, imported by `src/app/layout.tsx`.
**Never remove or reorder this import.**

## Data Fetching Patterns

| Pattern                         | Where used                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `fetch` to API                  | All repositories — auth, property, booking, host-property                                              |
| `fetch` to presign URL          | `UploadRepository.getPresignedUrl` → `POST ${NEXT_PUBLIC_API_URL}/upload/presign`                      |
| `XMLHttpRequest` (for progress) | Binary S3 upload in `upload.repository.ts`                                                             |
| Async Server Component          | `CategoryPropertyListTemplate`, `PropertyDetailsTemplate`, `BookingTemplate` — call use cases directly |
| Client hook                     | `useSearch` in `search/hooks/use-search.ts` — loads properties on search                               |

## Use Cases

| Use Case              | File                        | Key Methods                                                                                                       |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `AuthUseCase`         | `auth.use-case.ts`          | login, signup, forgotPassword, resetPassword, socialLogin, validateToken, saveAuthData, clearAuthData             |
| `PropertyUseCase`     | `property.use-case.ts`      | getProperties, getPropertyById, searchProperties                                                                  |
| `BookingUseCase`      | `booking.use-case.ts`       | previewCheckout, checkAvailability, createBooking, getBookings, getHostBookings, getBookingDetails, cancelBooking |
| `HostPropertyUseCase` | `host-property.use-case.ts` | createDraft, saveLocation, savePricing, saveAmenities, savePhotos, publishDraft, resumeDraft, getDraftDetails     |
| `UploadUseCase`       | `upload.use-case.ts`        | getPresignedUrl, uploadFile, bulkUpload, cancelBulkUpload                                                         |

## Key Entities

### PropertyEntity (`src/domain/entities/property.entity.ts`)

```typescript
PropertyEntity {
  id, title, type?, description?, status?
  location: { city, state?, country?, coordinates? }
  host?: { id?, name, image?, isSuperhost? }
  stats?: { rating, reviewCount }
  pricing: { amount, currency, frequency: 'night' | 'person' | 'week' }
  images: string[]
  coverImage?: string
  bedrooms?, beds?, bathrooms?
  amenities?: string[]
}
```

### Auth (`src/data/interfaces/auth.interface.ts`)

```typescript
User { id, email, firstName, lastName, avatar?, isHost, createdAt, updatedAt }
LoginCredentials { email, password }
SignupCredentials { firstName, lastName, email, password }
AuthResponse { user: User, token: string }
```
