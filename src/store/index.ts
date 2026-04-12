import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "../saga/root.saga";
import searchReducer from "./slices/search-slice";
import uploadReducer from "./slices/upload.slice";

const sagaMiddleware = createSagaMiddleware({
  context: {
    // Lazy reference — store.dispatch is assigned after configureStore() returns
    // but getContext('dispatch') is only called inside a running saga, by which
    // time the store is fully initialised.
    get dispatch() {
      return store.dispatch;
    },
  },
});

export const store = configureStore({
  reducer: {
    search: searchReducer,
    upload: uploadReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "search/setDates",
          "upload/startBulk", // File[] not serializable
        ],
        ignoredPaths: ["search.filters.checkIn", "search.filters.checkOut"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
