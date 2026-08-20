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

const REQUIRED_HEAD = [
  '<meta charset="UTF-8"',
  'name="viewport"',
  'rel="icon"',
  'rel="canonical"',
];

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

      assertHeadIntact(page);

      const outPath =
        route === "/"
          ? resolve(distDir, "index.html")
          : resolve(distDir, `${route.slice(1)}.html`);

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, page, "utf-8");
      succeeded += 1;
      console.log(`  prerendered ${route}`);
    } catch (error) {
      console.error(`  FAILED to prerender ${route}: ${(error as Error).message}`);
    }
  }

  console.log(`Prerendered ${succeeded}/${STATIC_ROUTES.length} static routes.`);

  if (succeeded < STATIC_ROUTES.length) {
    throw new Error(
      `Only ${succeeded}/${STATIC_ROUTES.length} routes prerendered. See the errors above.`,
    );
  }

  if (!env.VITE_TMDB_TOKEN) {
    console.warn("");
    console.warn(
      "  WARNING: VITE_TMDB_TOKEN is not set. The site will deploy, but every",
    );
    console.warn(
      "  page will show a configuration notice and no TMDB data. Set it in your",
    );
    console.warn("  hosting provider's environment variables and redeploy.");
    console.warn("");
  }
}

function stripDefaultHead(template: string, head: string): string {
  let result = template;
  if (head.includes("<title")) {
    result = result.replace(/[ \t]*<title>[^<]*<\/title>\r?\n/, "");
  }
  if (head.includes('name="description"')) {
    result = result.replace(
      /[ \t]*<meta[^<>]*name="description"[^<>]*\/>\r?\n/,
      "",
    );
  }
  return result;
}

function assertHeadIntact(page: string): void {
  const head = page.slice(0, page.indexOf("</head>"));

  const missing = REQUIRED_HEAD.filter((tag) => !head.includes(tag));
  if (missing.length > 0) {
    throw new Error(`lost required head tags: ${missing.join(", ")}`);
  }

  const titles = head.match(/<title/g)?.length ?? 0;
  if (titles !== 1) {
    throw new Error(`has ${titles} title tags, expected exactly 1`);
  }

  const descriptions = head.match(/name="description"/g)?.length ?? 0;
  if (descriptions !== 1) {
    throw new Error(
      `has ${descriptions} description meta tags, expected exactly 1`,
    );
  }
}

function serialize(state: unknown): string {
  return JSON.stringify(state).replace(/</g, "\\u003c");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
