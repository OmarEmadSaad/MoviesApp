import { StrictMode, type ReactElement } from "react";
import { BrowserRouter, StaticRouter } from "react-router";
import { Provider } from "react-redux";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import App from "./App";
import type { AppStore } from "./store";

export function ClientTree({ store }: { store: AppStore }): ReactElement {
  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
}

export function ServerTree({
  store,
  url,
  helmetContext,
}: {
  store: AppStore;
  url: string;
  helmetContext: { helmet?: HelmetServerState };
}): ReactElement {
  return (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <Provider store={store}>
            <App />
          </Provider>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );
}
