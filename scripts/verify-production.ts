import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type ConsoleMessage } from "playwright-core";
import { preview, type PreviewServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");

const CHROME_CANDIDATES = [
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

const HYDRATION_SIGNATURES = [
  "Minified React error #418",
  "Minified React error #423",
  "Minified React error #425",
  "Hydration failed",
  "did not match",
  "There was an error while hydrating",
];

interface RouteCheck {
  path: string;
  expectText: string[];
  expectSelectors: string[];
}

const ROUTES: RouteCheck[] = [
  {
    path: "/",
    expectText: ["Movies and TV series"],
    expectSelectors: ['a[href^="/movie/"]', 'a[href^="/series/"]', "img"],
  },
  {
    path: "/movies",
    expectText: ["Movies"],
    expectSelectors: ['a[href^="/movie/"]', "img", 'nav[aria-label="Movies pagination"]'],
  },
  {
    path: "/series",
    expectText: ["TV series"],
    expectSelectors: ['a[href^="/series/"]', "img"],
  },
  { path: "/contact-us", expectText: ["Contact the developer"], expectSelectors: ["form"] },
];

const failures: string[] = [];

function fail(message: string) {
  failures.push(message);
  console.error(`  FAIL  ${message}`);
}

function pass(message: string) {
  console.log(`  ok    ${message}`);
}

function findChrome(): string {
  const found = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(
      `No Chrome/Edge binary found. Tried:\n${CHROME_CANDIDATES.join("\n")}`,
    );
  }
  return found;
}

function checkStaticFiles() {
  console.log("\nStatic build output");
  for (const file of ["index.html", "movies.html", "series.html", "contact-us.html", "robots.txt", "sitemap.xml", "favicon.svg", "favicon.ico"]) {
    if (existsSync(resolve(distDir, file))) pass(`dist/${file} exists`);
    else fail(`dist/${file} is missing`);
  }
}

function checkPrerenderedHead() {
  console.log("\nPrerendered <head> integrity");
  const pages: [string, string][] = [
    ["/", "index.html"],
    ["/movies", "movies.html"],
    ["/series", "series.html"],
    ["/contact-us", "contact-us.html"],
  ];

  for (const [label, file] of pages) {
    const path = resolve(distDir, file);
    if (!existsSync(path)) continue;
    const html = readFileSync(path, "utf-8");
    const head = html.slice(0, html.indexOf("</head>"));

    const required: [string, boolean][] = [
      ["charset", head.includes("charset")],
      ["viewport", head.includes('name="viewport"')],
      ["favicon", head.includes("favicon")],
      ["canonical", head.includes('rel="canonical"')],
      ["description", head.includes('name="description"')],
      ["og:title", head.includes('property="og:title"')],
      ...(file === "contact-us.html"
        ? []
        : ([["og:image", head.includes('property="og:image"')]] as [string, boolean][])),
      ["twitter:card", head.includes('name="twitter:card"')],
      ["json-ld", head.includes("application/ld+json")],
      ["preconnect", head.includes("preconnect")],
    ];

    const missing = required.filter(([, ok]) => !ok).map(([name]) => name);
    if (missing.length) fail(`${label} head is missing: ${missing.join(", ")}`);
    else pass(`${label} head has all required tags`);

    const titles = (head.match(/<title/g) ?? []).length;
    if (titles !== 1) fail(`${label} has ${titles} <title> tags, expected 1`);
  }
}

function checkPrerenderedData() {
  console.log("\nReal TMDB data in prerendered HTML");
  const expectations: [string, string, RegExp, number][] = [
    ["/", "index.html", /href="\/movie\/\d+\/[a-z0-9-]+"/g, 5],
    ["/", "index.html", /href="\/series\/\d+\/[a-z0-9-]+"/g, 5],
    ["/movies", "movies.html", /href="\/movie\/\d+\/[a-z0-9-]+"/g, 10],
    ["/series", "series.html", /href="\/series\/\d+\/[a-z0-9-]+"/g, 10],
  ];

  for (const [label, file, pattern, min] of expectations) {
    const path = resolve(distDir, file);
    if (!existsSync(path)) continue;
    const html = readFileSync(path, "utf-8");
    const count = new Set(html.match(pattern) ?? []).size;
    if (count < min) {
      fail(`${label} has only ${count} entity links in server HTML (expected >= ${min})`);
    } else {
      pass(`${label} has ${count} entity links in server HTML`);
    }

    const posters = new Set(html.match(/image\.tmdb\.org\/t\/p\/w\d+\/[^"\s]+/g) ?? []).size;
    if (posters < min) fail(`${label} has only ${posters} TMDB images in server HTML`);
    else pass(`${label} has ${posters} TMDB images in server HTML`);
  }
}

async function checkInBrowser(browser: Browser, origin: string) {
  console.log("\nBrowser checks (real production build)");

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message: ConsoleMessage) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error: Error) => pageErrors.push(error.message));

    const response = await page.goto(`${origin}${route.path}`, {
      waitUntil: "networkidle",
    });

    if (response?.status() !== 200) {
      fail(`${route.path} responded ${response?.status()}`);
    }

    const hydrationErrors = [...consoleErrors, ...pageErrors].filter((message) =>
      HYDRATION_SIGNATURES.some((signature) => message.includes(signature)),
    );
    if (hydrationErrors.length) {
      fail(`${route.path} hydration errors: ${hydrationErrors.join(" | ")}`);
    } else {
      pass(`${route.path} hydrated with no React hydration errors`);
    }

    const otherErrors = [...consoleErrors, ...pageErrors].filter(
      (message) =>
        !HYDRATION_SIGNATURES.some((s) => message.includes(s)) &&
        !message.includes("favicon"),
    );
    if (otherErrors.length) {
      fail(`${route.path} console errors: ${otherErrors.join(" | ")}`);
    }

    const body = (await page.textContent("body")) ?? "";
    for (const text of route.expectText) {
      if (!body.includes(text)) fail(`${route.path} is missing text "${text}"`);
    }

    if (body.includes("This site is not configured yet.")) {
      fail(`${route.path} shows the unconfigured notice - VITE_TMDB_TOKEN was not set at build time`);
    }

    for (const selector of route.expectSelectors) {
      const count = await page.locator(selector).count();
      if (count === 0) fail(`${route.path} has no element matching ${selector}`);
    }

    if (route.path === "/movies" || route.path === "/series") {
      const cards = await page.locator("article").count();
      if (cards < 10) fail(`${route.path} rendered only ${cards} cards after hydration`);
      else pass(`${route.path} rendered ${cards} cards after hydration`);
    }

    await page.close();
  }

  console.log("\nDeep route checks (client-rendered)");
  await checkDeepRoutes(browser, origin);

  console.log("\nAsset checks");
  for (const asset of ["/favicon.svg", "/favicon.ico", "/robots.txt", "/sitemap.xml"]) {
    const page = await browser.newPage();
    const response = await page.goto(`${origin}${asset}`);
    if (response?.status() === 200) pass(`${asset} -> 200`);
    else fail(`${asset} -> ${response?.status()}`);
    await page.close();
  }
}

async function checkDeepRoutes(browser: Browser, origin: string) {
  const indexHtml = readFileSync(resolve(distDir, "index.html"), "utf-8");
  const movieHref = indexHtml.match(/href="(\/movie\/\d+\/[a-z0-9-]+)"/)?.[1];
  const seriesHref = indexHtml.match(/href="(\/series\/\d+\/[a-z0-9-]+)"/)?.[1];

  const deep: [string, string[]][] = [];
  if (movieHref) deep.push([movieHref, ["Overview", "Top billed cast"]]);
  if (seriesHref) deep.push([seriesHref, ["Overview", "Series cast"]]);
  deep.push(["/search/movies/matrix", ["matrix"]]);

  for (const [path, expected] of deep) {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error: Error) => errors.push(error.message));

    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    const body = (await page.textContent("body")) ?? "";

    if (body.includes("This site is not configured yet.")) {
      fail(`${path} shows the unconfigured notice`);
    } else if (body.includes("could not load") || body.includes("not found")) {
      fail(`${path} rendered an error state`);
    } else {
      const missing = expected.filter((text) => !body.includes(text));
      if (missing.length) fail(`${path} missing: ${missing.join(", ")}`);
      else pass(`${path} rendered real data`);
    }

    if (errors.length) fail(`${path} threw: ${errors.join(" | ")}`);

    const images = await page.locator('img[src*="image.tmdb.org"]').count();
    if (images === 0) fail(`${path} has no TMDB images`);

    await page.close();
  }

  const personPage = await browser.newPage();
  await personPage.goto(`${origin}${movieHref ?? "/movies"}`, {
    waitUntil: "networkidle",
  });
  const personLink = await personPage.locator('a[href^="/person/"]').first();
  if ((await personLink.count()) > 0) {
    const href = await personLink.getAttribute("href");
    await personPage.goto(`${origin}${href}`, { waitUntil: "networkidle" });
    const body = (await personPage.textContent("body")) ?? "";
    if (body.includes("Biography") || body.includes("Personal info")) {
      pass(`${href} rendered real person data`);
    } else {
      fail(`${href} did not render person data`);
    }
  } else {
    fail("no /person/ link found on the movie page");
  }
  await personPage.close();
}

async function main() {
  checkStaticFiles();
  checkPrerenderedHead();
  checkPrerenderedData();

  let server: PreviewServer | undefined;
  let browser: Browser | undefined;

  try {
    server = await preview({
      preview: { port: 4319, strictPort: true, open: false },
      logLevel: "silent",
    });
    const origin = server.resolvedUrls?.local[0]?.replace(/\/$/, "");
    if (!origin) throw new Error("preview server did not report a URL");

    browser = await chromium.launch({ executablePath: findChrome() });
    await checkInBrowser(browser, origin);
  } finally {
    await browser?.close();
    server?.httpServer.close();
  }

  console.log("");
  if (failures.length) {
    console.error(`Production verification FAILED with ${failures.length} problem(s):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log("Production verification PASSED.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
