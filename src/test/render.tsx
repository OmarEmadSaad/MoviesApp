import type { ReactElement } from "react";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { createStore } from "@/store";

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;

  path?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", path, ...options }: Options = {},
) {
  const store = createStore();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <HelmetProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            {path ? (
              <Routes>
                <Route path={path} element={children} />
              </Routes>
            ) : (
              children
            )}
          </MemoryRouter>
        </Provider>
      </HelmetProvider>
    );
  }

  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...options }) };
}
