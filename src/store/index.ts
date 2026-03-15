import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import searchReducer from "./slices/search-slice";
import uploadReducer from "./slices/upload.slice";
import { rootSaga } from "../saga/root.saga";

const sagaMiddleware = createSagaMiddleware();

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
          "upload/start", // File objects are not serializable
        ],
        ignoredPaths: ["search.filters.checkIn", "search.filters.checkOut"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
