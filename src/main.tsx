import { createRoot, hydrateRoot } from "react-dom/client";
import { ClientTree } from "./app-tree";
import { store } from "./store";
import { PRERENDER_PATH_ATTR, normalizePath } from "./lib/seo/document";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

const tree = <ClientTree store={store} />;

const prerenderedPath = container.getAttribute(PRERENDER_PATH_ATTR);
const matchesCurrentRoute =
  prerenderedPath !== null &&
  normalizePath(prerenderedPath) === normalizePath(window.location.pathname);

if (matchesCurrentRoute && container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  container.innerHTML = "";
  createRoot(container).render(tree);
}
