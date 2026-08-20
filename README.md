# React Movies

Browse movies and TV series from [The Movie Database](https://www.themoviedb.org/) — cast, crew, trailers, reviews, seasons and ratings.

## Setup

```bash
npm install
cp .env.example .env   # add a TMDB v4 read access token
npm run dev
```

### Deploying to Vercel

Set these under **Project Settings -> Environment Variables** (Production,
Preview and Development):

| Variable | Value |
| --- | --- |
| `VITE_TMDB_TOKEN` | your TMDB v4 read access token |
| `VITE_SITE_URL` | the deployed origin, e.g. `https://your-app.vercel.app` |

`VITE_SITE_URL` drives canonical URLs, Open Graph tags and `sitemap.xml`, so
set it before the first production build. If `VITE_TMDB_TOKEN` is missing the
build still succeeds, but the prerendered pages ship without TMDB data.

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Client build, SSR build, prerender of static routes, `sitemap.xml` + `robots.txt` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run test:coverage` | Vitest with coverage |
| `npm run verify` | lockfile check + typecheck + lint + test + build |
| `npm run lock:check` | fail if `package-lock.json` is missing a platform binary |
| `npm run lock:fix` | regenerate `package-lock.json` with every platform binary |

### package-lock.json and cross-platform builds

npm resolves optional platform binaries (`@rollup/rollup-*`, `@esbuild/*`)
against the machine that generated the lockfile. Running `npm install` on
Windows therefore produces a lockfile with only the Windows binaries, and a
Linux CI build then fails with:

```
Cannot find module @rollup/rollup-linux-x64-gnu
```

`npm run lock:fix` avoids this by resolving the lockfile in a clean temporary
directory, which makes npm record all platforms. `npm run lock:check` (part of
`npm run verify`) fails the build if the entries go missing again, so run
`lock:fix` and commit the result after any dependency change.

## Structure

```
src/
  lib/tmdb/    typed TMDB client (RTK Query), image URL + srcset helpers
  lib/seo/     metadata component, JSON-LD builders, description builders
  lib/         formatting and slug utilities
  hooks/       shared hooks
  store/       Redux store (RTK Query cache only)
  components/
    ui/        primitives: Container, Image, Rating, Badge, Carousel, Modal,
               Pagination, SearchInput, SectionHeader, loading/empty/error states
    media/     MediaCard, MediaGrid, MediaHero, MediaTabs, PersonCard,
               PersonRow, ReviewCard, SocialLinks, FactList, SubPageHeader
    layout/    Header, Footer, SearchBox
  features/    one folder per route group
  routes.tsx   route table (every page lazy-loaded)
scripts/       prerender + sitemap/robots generation (TypeScript, run via tsx)
```

Every file in the project is TypeScript, including the Vite, Tailwind and
ESLint configs and the build scripts. PostCSS is configured inline in
`vite.config.ts` rather than in a separate config file.

## Rendering

Static routes (`/`, `/movies`, `/series`, `/contact-us`) are prerendered at build
time with their TMDB data already fetched, so they ship as complete HTML with
metadata, headings, internal links and JSON-LD. The client hydrates them. All
other routes render client-side from the SPA shell.

`vercel.json` sets `cleanUrls` so `dist/movies.html` is served at `/movies`, with
a rewrite to `index.html` for everything else.
