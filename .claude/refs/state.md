# State Management (Redux)

## Setup
Redux Toolkit + redux-saga.
Store: `src/store/index.ts` — `configureStore` with `search` + `upload` reducers + sagaMiddleware.
Provider: `src/components/providers/ReduxProvider.tsx` — wraps root layout.

## Typed Hooks (`src/hooks/redux.ts`)
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
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

### `upload` slice
See `src/store/slices/upload.slice.ts` for shape.

## Sagas (`src/saga/`)
- `root.saga.ts` — combines all sagas
- `upload.saga.ts` — handles upload flow side effects

## Notes
- No RTK Query — plain `useEffect` + `useState` in hooks, dispatching actions manually
- Search results come from in-memory mock today — wiring to real API will go through the saga
