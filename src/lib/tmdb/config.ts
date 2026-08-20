import { resolveSiteUrl } from "@/lib/seo/site-url";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_NOT_CONFIGURED = "TMDB_NOT_CONFIGURED";

export function getTmdbToken(): string | null {
  return import.meta.env.VITE_TMDB_TOKEN?.trim() || null;
}

export function isTmdbConfigured(): boolean {
  return getTmdbToken() !== null;
}

export function getSiteUrl(): string {
  return resolveSiteUrl(
    import.meta.env.VITE_SITE_URL,
    import.meta.env.VITE_VERCEL_PROJECT_PRODUCTION_URL,
  );
}
