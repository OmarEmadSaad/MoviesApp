import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tmdbApi } from "@/lib/tmdb/api";

const rootReducer = combineReducers({
  [tmdbApi.reducerPath]: tmdbApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tmdbApi.middleware),
    preloadedState,
  });

  setupListeners(store.dispatch);
  return store;
}

export const store = createStore(
  typeof window !== "undefined"
    ? (window.__PRELOADED_STATE__ as Partial<RootState> | undefined)
    : undefined,
);

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
