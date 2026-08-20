import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";
import type { RenderResult } from "../src/entry-server";

interface ServerEntry {
  render: (url: string) => Promise<RenderResult>;
  STATIC_ROUTES: string[];
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr/entry-server.js");

const env = loadEnv("production", root, "VITE_");

const PLACEHOLDER_HEAD = "<!--app-head-->";
const PLACEHOLDER_HTML = "<!--app-html-->";

async function main(): Promise<void> {
  const template = await readFile(resolve(distDir, "index.html"), "utf-8");

  if (!template.includes(PLACEHOLDER_HTML)) {
    throw new Error(
      "dist/index.html has already been prerendered. Run `vite build` again before prerendering.",
    );
  }

  const { render, STATIC_ROUTES } = (await import(
    pathToFileURL(ssrEntry).href
  )) as ServerEntry;

  let succeeded = 0;

  for (const route of STATIC_ROUTES) {
    try {
      const { html, head, preloadedState } = await render(route);

      const page = stripDefaultHead(template, head)
        .replace(PLACEHOLDER_HEAD, head)
        .replace(PLACEHOLDER_HTML, html)
        .replace(
          "</body>",
          `  <script>window.__PRELOADED_STATE__=${serialize(preloadedState)}</script>\n  </body>`,
        );

      const outPath =
        route === "/"
          ? resolve(distDir, "index.html")
          : resolve(distDir, `${route.slice(1)}.html`);

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, page, "utf-8");
      succeeded += 1;
      console.log(`  prerendered ${route}`);
    } catch (error) {
      console.warn(
        `  could not prerender ${route}: ${(error as Error).message}. Falling back to the SPA shell.`,
      );
    }
  }

  console.log(`Prerendered ${succeeded}/${STATIC_ROUTES.length} static routes.`);
  if (!env.VITE_TMDB_TOKEN) {
    console.warn(
      "  VITE_TMDB_TOKEN was not set, so prerendered pages contain no TMDB data.",
    );
  }
}

function stripDefaultHead(template: string, head: string): string {
  let result = template;
  if (head.includes("<title")) {
    result = result.replace(/[ \t]*<title>[\s\S]*?<\/title>\r?\n/, "");
  }
  if (head.includes('name="description"')) {
    result = result.replace(
      /[ \t]*<meta\s[\s\S]*?name="description"[\s\S]*?\/>\r?\n/,
      "",
    );
  }
  return result;
}

function serialize(state: unknown): string {
  return JSON.stringify(state).replace(/</g, "\\u003c");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
