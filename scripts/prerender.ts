import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";
import {
  APP_SLOT,
  HEAD_SLOT_END,
  HEAD_SLOT_START,
  auditHead,
  composeDocument,
} from "../src/lib/seo/document";
import type { RenderResult } from "../src/entry-server";

interface ServerEntry {
  render: (url: string) => Promise<RenderResult>;
  STATIC_ROUTES: string[];
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr/entry-server.js");

const env = loadEnv("production", root, "VITE_");

const ALLOW_UNCONFIGURED = process.env.ALLOW_UNCONFIGURED_BUILD === "1";

const DATA_EXPECTATIONS: Record<string, { pattern: RegExp; min: number }[]> = {
  "/": [
    { pattern: /href="\/movie\/\d+\/[a-z0-9-]+"/g, min: 5 },
    { pattern: /href="\/series\/\d+\/[a-z0-9-]+"/g, min: 5 },
  ],
  "/movies": [{ pattern: /href="\/movie\/\d+\/[a-z0-9-]+"/g, min: 10 }],
  "/series": [{ pattern: /href="\/series\/\d+\/[a-z0-9-]+"/g, min: 10 }],
};

function assertConfigured(): void {
  if (env.VITE_TMDB_TOKEN) return;

  const message = [
    "",
    "  Missing required build configuration: VITE_TMDB_TOKEN",
    "",
    "  Without it the prerendered pages contain no TMDB data and the deployed",
    "  site shows a configuration notice on every route.",
    "",
    "  Local:  copy .env.example to .env and add a TMDB v4 read access token.",
    "  Vercel: Project Settings -> Environment Variables -> add VITE_TMDB_TOKEN",
    "          (and VITE_SITE_URL) for Production, Preview and Development,",
    "          then redeploy. VITE_* values are baked in at build time.",
    "",
    "  To build deliberately without it, set ALLOW_UNCONFIGURED_BUILD=1.",
    "",
  ].join("\n");

  if (ALLOW_UNCONFIGURED) {
    console.warn(message);
    return;
  }
  throw new Error(message);
}

function assertSiteUrl(): void {
  if (env.VITE_SITE_URL?.trim()) return;
  console.warn(
    "\n  WARNING: VITE_SITE_URL is not set. Canonical and Open Graph URLs will\n  point at http://localhost:5173. Set it before a production deploy.\n",
  );
}

function assertRealData(route: string, html: string): void {
  if (!env.VITE_TMDB_TOKEN) return;

  const expectations = DATA_EXPECTATIONS[route];
  if (!expectations) return;

  for (const { pattern, min } of expectations) {
    const found = new Set(html.match(pattern) ?? []).size;
    if (found < min) {
      throw new Error(
        `${route} contains only ${found} entity links in its server HTML (expected at least ${min}). The TMDB request during prerender probably failed.`,
      );
    }
  }

  if (html.includes("This site is not configured yet.")) {
    throw new Error(
      `${route} rendered the unconfigured notice despite VITE_TMDB_TOKEN being set.`,
    );
  }
}

function assertHead(route: string, html: string): void {
  const audit = auditHead(html);
  if (audit.ok) return;

  const problems: string[] = [];
  if (audit.missing.length) problems.push(`missing ${audit.missing.join(", ")}`);
  if (audit.titleCount !== 1) {
    problems.push(`${audit.titleCount} title tags (expected 1)`);
  }
  if (audit.descriptionCount !== 1) {
    problems.push(`${audit.descriptionCount} description tags (expected 1)`);
  }
  throw new Error(`${route} head is broken: ${problems.join("; ")}`);
}

async function main(): Promise<void> {
  assertConfigured();
  assertSiteUrl();

  const template = await readFile(resolve(distDir, "index.html"), "utf-8");
  const { render, STATIC_ROUTES } = (await import(
    pathToFileURL(ssrEntry).href
  )) as ServerEntry;

  for (const route of STATIC_ROUTES) {
    const { html, head, preloadedState } = await render(route);

    const page = composeDocument({
      template,
      head,
      body: html,
      preloadedState,
      route,
    });

    assertHead(route, page);
    assertRealData(route, page);

    const outPath =
      route === "/"
        ? resolve(distDir, "index.html")
        : resolve(distDir, `${route.slice(1)}.html`);

    await writeFile(outPath, page, "utf-8");
    console.log(`  prerendered ${route}`);
  }

  await writeShell(template);

  console.log(`Prerendered ${STATIC_ROUTES.length}/${STATIC_ROUTES.length} static routes.`);
}

async function writeShell(template: string): Promise<void> {
  const shell = template
    .replace(HEAD_SLOT_START, "")
    .replace(HEAD_SLOT_END, "")
    .replace(APP_SLOT, "");

  await writeFile(resolve(distDir, "app.html"), shell, "utf-8");
  console.log("  wrote app.html (SPA fallback shell)");
}

main().catch((error: unknown) => {
  console.error(`\nPrerender failed.\n${(error as Error).message}`);
  process.exit(1);
});
