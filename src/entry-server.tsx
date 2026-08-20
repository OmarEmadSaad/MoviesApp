import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { ServerTree } from "./app-tree";
import { createStore, type AppStore, type RootState } from "./store";
import { tmdbApi } from "./lib/tmdb/api";

export interface RenderResult {
  html: string;
  head: string;
  preloadedState: RootState;
}


const PRELOADS: Record<string, (store: AppStore) => void> = {
  "/": (store) => {
    store.dispatch(tmdbApi.endpoints.nowPlayingMovies.initiate(1));
    store.dispatch(tmdbApi.endpoints.airingTodaySeries.initiate(1));
  },
  "/movies": (store) => {
    store.dispatch(tmdbApi.endpoints.discoverMovies.initiate(1));
  },
  "/series": (store) => {
    store.dispatch(tmdbApi.endpoints.popularSeries.initiate(1));
  },
};


const RENDER_TIMEOUT_MS = 20_000;


export async function render(url: string): Promise<RenderResult> {
  const store = createStore();

  const preload = PRELOADS[url];
  if (preload) {
    preload(store);
    await Promise.all(store.dispatch(tmdbApi.util.getRunningQueriesThunk()));
  }

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = await renderFully(
    <ServerTree store={store} url={url} helmetContext={helmetContext} />,
  );

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [




        helmet.priority.toString(),
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { html, head, preloadedState: store.getState() };
}

function renderFully(tree: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new PassThrough();
    sink.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    sink.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    sink.on("error", reject);

    const { pipe, abort } = renderToPipeableStream(tree, {


      onAllReady() {
        clearTimeout(timer);
        pipe(sink);
      },
      onError(error) {
        clearTimeout(timer);
        reject(error);
      },
    });

    const timer = setTimeout(() => {
      abort();
      reject(new Error(`Render timed out after ${RENDER_TIMEOUT_MS}ms`));
    }, RENDER_TIMEOUT_MS);
  });
}


export const STATIC_ROUTES = ["/", "/movies", "/series", "/contact-us"];
