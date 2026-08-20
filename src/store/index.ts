import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tmdbApi } from "@/lib/tmdb/api";
import { readPreloadedState } from "@/lib/seo/document";

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
  readPreloadedState() as Partial<RootState> | undefined,
);

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];
