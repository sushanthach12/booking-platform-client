# Data Layer — Use Cases, Repositories, DI

## Clean Architecture

```
Components / Server Components
  → Use Cases (src/domain/use-cases/)
    → Interfaces (src/data/interfaces/)
      → Implementations (src/data/repositories/)
        → HTTP (fetch / XHR) — auth + upload hit real HTTP; property data is still mocked
```

**Never call fetch/HTTP directly from components.** Always go through a use case.

## tsyringe DI Container (`src/domain/di/container.ts`)

| Token                        | Implementation       | Status                                                                   |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `TOKENS.IPropertyRepository` | `PropertyRepository` | In-memory mock (`MOCK_PROPERTIES`)                                       |
| `TOKENS.IAuthRepository`     | `AuthRepository`     | Real HTTP — `/auth/login`, `/auth/signup`, `/auth/social/:provider` etc. |
| `TOKENS.IUploadRepository`   | `UploadRepository`   | Real HTTP — presigned URL upload                                         |
| `TOKENS.UploadUseCase`       | `UploadUseCase`      | Real                                                                     |

**Helper getters** (`src/domain/di/index.ts`):

```typescript
getPropertyUseCase(); // call from async server components
getAuthUseCase(); // call from client components
getUploadRepository(); // used by image-uploader
```

## reflect-metadata

Must be imported **before** the container resolves.
Loaded via side-effect in `src/lib/utils/reflect-metadata.ts`, imported by `src/app/layout.tsx`.
**Never remove or reorder this import.**

## Data Fetching Patterns

| Pattern                         | Where used                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| In-memory mock (no HTTP)        | Property listing, detail, search — `PropertyRepository` returns `MOCK_PROPERTIES`                      |
| `fetch` to presign URL          | `UploadRepository.getPresignedUrl` → `POST ${NEXT_PUBLIC_API_URL}/upload/presign`                      |
| `XMLHttpRequest` (for progress) | Binary S3 upload in `upload.repository.ts`                                                             |
| Async Server Component          | `CategoryPropertyListTemplate`, `PropertyDetailsTemplate`, `BookingTemplate` — call use cases directly |
| Client hook                     | `useSearch` in `search/hooks/use-search.ts` — loads properties on mount                                |

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
