import { existsSync } from "node:fs";
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

function describeEnvironment(): string[] {
  const viteKeysInProcess = Object.keys(process.env).filter((key) =>
    key.startsWith("VITE_"),
  );
  const viteKeysLoaded = Object.keys(env);
  const onVercel = Boolean(process.env.VERCEL);

  const lines = [
    "  What this build can actually see:",
    `    VITE_* in process env : ${
      viteKeysInProcess.length ? viteKeysInProcess.join(", ") : "(none)"
    }`,
    `    VITE_* after loadEnv  : ${
      viteKeysLoaded.length ? viteKeysLoaded.join(", ") : "(none)"
    }`,
    `    .env file present     : ${existsSync(resolve(root, ".env")) ? "yes" : "no"}`,
  ];

  if (onVercel) {
    lines.push(
      `    Vercel environment    : ${process.env.VERCEL_ENV ?? "unknown"}`,
      `    Vercel git branch     : ${process.env.VERCEL_GIT_COMMIT_REF ?? "unknown"}`,
    );
  }

  return lines;
}

function configurationHelp(): string[] {
  const onVercel = Boolean(process.env.VERCEL);
  const vercelEnv = process.env.VERCEL_ENV ?? "production";

  if (!onVercel) {
    return [
      "  Fix locally:",
      "    1. cp .env.example .env",
      "    2. put your TMDB v4 read access token in VITE_TMDB_TOKEN",
      "       (https://www.themoviedb.org/settings/api -> API Read Access Token)",
      "    3. re-run the build",
    ];
  }

  return [
    "  Fix on Vercel:",
    "    1. Vercel dashboard -> your project -> Settings -> Environment Variables",
    "    2. Add VITE_TMDB_TOKEN = <your TMDB v4 read access token>",
    "    3. Add VITE_SITE_URL   = https://<your-domain>",
    `    4. Tick every environment, including "${vercelEnv}" - this build is a`,
    `       "${vercelEnv}" deployment, so a variable scoped only to another`,
    "       environment will not be visible here",
    "    5. Save, then Deployments -> ... -> Redeploy",
    "       (VITE_* values are read at build time, so an existing deployment",
    "        will not pick them up without a rebuild)",
  ];
}

function assertConfigured(): void {
  if (env.VITE_TMDB_TOKEN) return;

  const message = [
    "",
    "  Missing required build configuration: VITE_TMDB_TOKEN",
    "",
    "  Without it every page of the deployed site shows a configuration notice",
    "  and no TMDB data, so this build is being stopped rather than shipped.",
    "",
    ...describeEnvironment(),
    "",
    ...configurationHelp(),
    "",
    "  To ship deliberately without a token (the site will show the notice),",
    "  set ALLOW_UNCONFIGURED_BUILD=1 for this build.",
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
