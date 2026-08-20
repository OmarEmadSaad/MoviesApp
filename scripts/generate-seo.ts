import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { slugify } from "../src/lib/slug";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const env = loadEnv("production", root, "VITE_");

const SITE_URL = (env.VITE_SITE_URL || "http://localhost:5173").replace(
  /\/$/,
  "",
);
const TOKEN = env.VITE_TMDB_TOKEN;

const CATALOGUE_PAGES = 20;
const DETAIL_PAGES = 5;

interface UrlOptions {
  changefreq?: string;
  priority?: number;
}

interface TmdbListItem {
  id: number;
  title?: string;
  name?: string;
}

interface TmdbList {
  results: TmdbListItem[];
}

interface TmdbCredits {
  cast: { id: number; name: string }[];
}

async function tmdb<T>(path: string): Promise<T | null> {
  if (!TOKEN) return null;
  const response = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
  });
  if (!response.ok) {
    console.warn(`  TMDB ${path} responded ${response.status}`);
    return null;
  }
  return (await response.json()) as T;
}

function urlEntry(path: string, options: UrlOptions = {}): string {
  const { changefreq = "weekly", priority = 0.6 } = options;
  return `  <url>
    <loc>${SITE_URL}${escapeXml(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main(): Promise<void> {
  const paths = new Map<string, string>();
  const add = (path: string, options?: UrlOptions) => {
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

  for (let page = 1; page <= DETAIL_PAGES; page += 1) {
    const movies = await tmdb<TmdbList>(
      `/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&page=${page}`,
    );
    for (const movie of movies?.results ?? []) {
      const slug = slugify(movie.title);
      add(slug ? `/movie/${movie.id}/${slug}` : `/movie/${movie.id}`, {
        priority: 0.8,
      });
    }

    const series = await tmdb<TmdbList>(`/tv/popular?language=en-US&page=${page}`);
    for (const show of series?.results ?? []) {
      const slug = slugify(show.name);
      add(slug ? `/series/${show.id}/${slug}` : `/series/${show.id}`, {
        priority: 0.8,
      });
    }
  }

  const people = new Map<number, string>();
  const topMovies = await tmdb<TmdbList>(
    "/discover/movie?include_adult=false&language=en-US&sort_by=popularity.desc&page=1",
  );
  for (const movie of (topMovies?.results ?? []).slice(0, 20)) {
    const credits = await tmdb<TmdbCredits>(
      `/movie/${movie.id}/credits?language=en-US`,
    );
    for (const actor of (credits?.cast ?? []).slice(0, 8)) {
      if (!people.has(actor.id)) people.set(actor.id, actor.name);
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

Disallow: /search/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(resolve(distDir, "robots.txt"), robots, "utf-8");

  console.log(
    `Wrote sitemap.xml (${paths.size} URLs) and robots.txt${TOKEN ? "" : " - no TMDB token, static routes only"}.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
