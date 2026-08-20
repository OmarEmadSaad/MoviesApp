export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbToken(): string {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  if (!token) {
    throw new Error(
      "VITE_TMDB_TOKEN is not set. Copy .env.example to .env and add a TMDB read access token.",
    );
  }
  return token;
}

export function getSiteUrl(): string {
  return (import.meta.env.VITE_SITE_URL ?? "http://localhost:5173").replace(
    /\/$/,
    "",
  );
}
