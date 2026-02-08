import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
}

interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
  priceMin: number;
  priceMax: number;
  amenities: string[];
  propertyType: string;
}

interface SearchState {
  filters: SearchFilters;
  isSearchActive: boolean;
  searchResults: unknown[];
  isLoading: boolean;
  error: string | null;
}

const defaultFilters: SearchFilters = {
  location: "",
  checkIn: null,
  checkOut: null,
  guests: { adults: 1, children: 0, infants: 0 },
  priceMin: 0,
  priceMax: 1000,
  amenities: [],
  propertyType: "",
};

const initialState: SearchState = {
  filters: defaultFilters,
  isSearchActive: false,
  searchResults: [],
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Filter actions
    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof SearchFilters; value: unknown }>,
    ) => {
      const { key, value } = action.payload;
      if (key === "guests" && value) {
        // Ensure guests object has proper structure
        const defaultGuests = { adults: 1, children: 0, infants: 0 };
        state.filters[key] = {
          ...defaultGuests,
          ...state.filters[key],
          ...value,
        };
      } else {
        state.filters[key] = value as never;
      }
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    updateFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Ensure guests has default structure if partially provided
      if (action.payload.guests) {
        const defaultGuests = { adults: 1, children: 0, infants: 0 };
        state.filters.guests = {
          ...defaultGuests,
          ...state.filters.guests,
          ...action.payload.guests,
        };
      }
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    clearFilters: (state) => {
      state.filters = defaultFilters;
      state.isSearchActive = false;
    },

    // Search actions
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSearchResults: (state, action: PayloadAction<unknown[]>) => {
      state.searchResults = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setSearchError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Specific filter setters for better DX
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    setDates: (
      state,
      action: PayloadAction<{ checkIn: Date | null; checkOut: Date | null }>,
    ) => {
      state.filters.checkIn = action.payload.checkIn;
      state.filters.checkOut = action.payload.checkOut;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    setGuests: (state, action: PayloadAction<GuestCount>) => {
      state.filters.guests = action.payload;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.filters.priceMin = action.payload.min;
      state.filters.priceMax = action.payload.max;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    setAmenities: (state, action: PayloadAction<string[]>) => {
      state.filters.amenities = action.payload;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },

    setPropertyType: (state, action: PayloadAction<string>) => {
      state.filters.propertyType = action.payload;
      state.isSearchActive = checkIfSearchActive(state.filters);
    },
  },
});

// Helper function to check if search is active
function checkIfSearchActive(filters: SearchFilters): boolean {
  const totalGuests = filters.guests.adults + filters.guests.children;
  return !!(
    filters.location ||
    filters.checkIn ||
    filters.checkOut ||
    totalGuests !== 1 ||
    filters.amenities.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 1000 ||
    filters.propertyType
  );
}

export const {
  updateFilter,
  updateFilters,
  clearFilters,
  setSearchLoading,
  setSearchResults,
  setSearchError,
  setLocation,
  setDates,
  setGuests,
  setPriceRange,
  setAmenities,
  setPropertyType,
} = searchSlice.actions;

export default searchSlice.reducer;

// Selectors
export const selectSearchFilters = (state: { search: SearchState }) =>
  state.search.filters;
export const selectIsSearchActive = (state: { search: SearchState }) =>
  state.search.isSearchActive;
export const selectSearchResults = (state: { search: SearchState }) =>
  state.search.searchResults;
export const selectSearchLoading = (state: { search: SearchState }) =>
  state.search.isLoading;
export const selectSearchError = (state: { search: SearchState }) =>
  state.search.error;
