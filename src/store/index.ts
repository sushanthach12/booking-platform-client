import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search-slice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    // Add other reducers here as needed
    // auth: authReducer,
    // properties: propertiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['search/setDates'], // Ignore Date serialization
        ignoredPaths: ['search.filters.checkIn', 'search.filters.checkOut'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
