import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { Toaster } from "./components/Toaster";
import { store } from "./store";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster />
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);


if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
