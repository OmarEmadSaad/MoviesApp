import { TMDB_IMAGE_BASE_URL } from "./config";

export const POSTER_WIDTHS = [92, 154, 185, 342, 500, 780] as const;
export const BACKDROP_WIDTHS = [300, 780, 1280] as const;
export const PROFILE_WIDTHS = [45, 185, 632] as const;

export type PosterWidth = (typeof POSTER_WIDTHS)[number];
export type BackdropWidth = (typeof BACKDROP_WIDTHS)[number];
export type ProfileWidth = (typeof PROFILE_WIDTHS)[number];

export const ASPECT = {
  poster: 2 / 3,
  backdrop: 16 / 9,
  profile: 2 / 3,
  still: 16 / 9,
} as const;

function url(path: string | null | undefined, size: string): string | null {
  if (!path) return null;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE_URL}/${size}${normalised}`;
}

export function posterUrl(
  path: string | null | undefined,
  width: PosterWidth = 342,
): string | null {
  return url(path, `w${width}`);
}

export function backdropUrl(
  path: string | null | undefined,
  width: BackdropWidth | "original" = 1280,
): string | null {
  return url(path, width === "original" ? "original" : `w${width}`);
}

export function profileUrl(
  path: string | null | undefined,
  width: ProfileWidth = 185,
): string | null {
  return url(path, `w${width}`);
}

export function stillUrl(path: string | null | undefined): string | null {
  return url(path, "w300");
}

export function buildSrcSet(
  path: string | null | undefined,
  widths: readonly number[],
): string | undefined {
  if (!path) return undefined;
  return widths
    .map((w) => `${url(path, `w${w}`)} ${w}w`)
    .join(", ");
}

export function posterSrcSet(path: string | null | undefined) {
  return buildSrcSet(path, POSTER_WIDTHS);
}

export function backdropSrcSet(path: string | null | undefined) {
  return buildSrcSet(path, BACKDROP_WIDTHS);
}

export function profileSrcSet(path: string | null | undefined) {
  return buildSrcSet(path, PROFILE_WIDTHS);
}

export function youtubeEmbedUrl(key: string): string {
  return `https://www.youtube.com/embed/${key}?modestbranding=1&rel=0`;
}

export function youtubeThumbnailUrl(key: string): string {
  return `https://i.ytimg.com/vi/${key}/hqdefault.jpg`;
}
