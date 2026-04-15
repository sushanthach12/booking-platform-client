# State Management (Redux)

## Setup

Redux Toolkit + redux-saga.
Store: `src/store/index.ts` — `configureStore` with `search` + `upload` reducers + sagaMiddleware.
Provider: `src/components/providers/ReduxProvider.tsx` — wraps root layout.

## Typed Hooks (`src/hooks/redux.ts`)

```typescript
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
```

## Slices (`src/store/slices/`)

### `search` slice

```typescript
filters: {
  location, checkIn, checkOut, guests,
  priceMin, priceMax, amenities, propertyType
}
isSearchActive: boolean
searchResults: PropertyEntity[]
isLoading: boolean
error: string | null
```

Filters are wired end-to-end via `useSearch` + `useSearchFilters` hooks in the search feature. Dispatching filter actions triggers a real HTTP search via `PropertyUseCase.searchProperties()`.

### `upload` slice

```typescript
completedImages: IImageUploadMetadata[]   // full metadata per uploaded image
completedUrls: string[]                   // convenience array of URLs
totalCount: number
batchSettledCount: number
progress: number                          // 0–100
status: 'idle' | 'uploading' | 'success' | 'error'
error: string | null
```

`IImageUploadMetadata` tracks key, url, filename, size, and type for each uploaded image.

## Sagas (`src/saga/`)

- `root.saga.ts` — combines all sagas
- `upload.saga.ts` — handles upload flow side effects (presign → XHR → track progress → update slice)

## Notes

- No RTK Query — plain hooks dispatching actions manually
- Search results come from real HTTP (`PropertyRepository.searchProperties()`)
- Upload saga tracks granular per-image progress via Redux channels
