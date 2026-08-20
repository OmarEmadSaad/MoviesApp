import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const env = loadEnv("production", root, "VITE_");

const SITE_URL = (env.VITE_SITE_URL || "http://localhost:5173").replace(/\/$/, "");
const TOKEN = env.VITE_TMDB_TOKEN;

const CATALOGUE_PAGES = 20;

const DETAIL_PAGES = 5;

function slugify(value) {
  if (!value) return "";
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function tmdb(path) {
  if (!TOKEN) return null;
  const response = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
  });
  if (!response.ok) {
    console.warn(`  TMDB ${path} responded ${response.status}`);
    return null;
  }
  return response.json();
}

function urlEntry(path, { changefreq = "weekly", priority = 0.6 } = {}) {
  return `  <url>
    <loc>${SITE_URL}${escapeXml(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const paths = new Map();
  const add = (path, options) => {
    if (!paths.has(path)) paths.set(path, urlEntry(path, options));
  };

  add("/", { changefreq: "daily", priority: 1.0 });
  add("/movies", { changefreq: "daily", priority: 0.9 });
  add("/series", { changefreq: "daily", priority: 0.9 });
  add("/contact-us", { changefreq: "yearly", priority: 0.3 });

  for (let page = 2; page <= CATALOGUE_PAGES; page += 1) {
    add(`/movies?page=${page}`, { priority: 0.5 });
    add(`/series?page=${page}`, { priority: 0.5 });
  }

  const people = new Map();

  for (let page = 1; page <= DETAIL_PAGES; page += 1) {
    const movies = await tmdb(
      `/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&page=${page}`,
    );
    for (const movie of movies?.results ?? []) {
      const slug = slugify(movie.title);
      add(slug ? `/movie/${movie.id}/${slug}` : `/movie/${movie.id}`, {
        priority: 0.8,
      });
    }

    const series = await tmdb(`/tv/popular?language=en-US&page=${page}`);
    for (const show of series?.results ?? []) {
      const slug = slugify(show.name);
      add(slug ? `/series/${show.id}/${slug}` : `/series/${show.id}`, {
        priority: 0.8,
      });
    }
  }

  const topMovies = await tmdb(
    "/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&page=1",
  );
  for (const movie of (topMovies?.results ?? []).slice(0, 20)) {
    const credits = await tmdb(`/movie/${movie.id}/credits?language=en-US`);
    for (const actor of (credits?.cast ?? []).slice(0, 8)) {
      if (!people.has(actor.id)) {
        people.set(actor.id, actor.name);
      }
    }
  }
  for (const [id, name] of people) {
    const slug = slugify(name);
    add(slug ? `/person/${id}/${slug}` : `/person/${id}`, { priority: 0.6 });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...paths.values()].join("\n")}
</urlset>
`;

  const robots = `# robots.txt for React Movies
User-agent: *
Allow: /

# Internal search results are thin, near-duplicate pages. Crawlers should still
# follow the links on them, which the pages themselves declare via
# "noindex, follow".
Disallow: /search/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(resolve(distDir, "robots.txt"), robots, "utf-8");

  console.log(
    `Wrote sitemap.xml (${paths.size} URLs) and robots.txt${TOKEN ? "" : " — no TMDB token, static routes only"}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
