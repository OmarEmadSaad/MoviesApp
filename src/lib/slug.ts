export function slugify(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function moviePath(id: number, title?: string | null): string {
  const slug = slugify(title);
  return slug ? `/movie/${id}/${slug}` : `/movie/${id}`;
}

export function seriesPath(id: number, name?: string | null): string {
  const slug = slugify(name);
  return slug ? `/series/${id}/${slug}` : `/series/${id}`;
}

export function personPath(id: number, name?: string | null): string {
  const slug = slugify(name);
  return slug ? `/person/${id}/${slug}` : `/person/${id}`;
}

export function mediaPath(
  mediaType: "movie" | "tv",
  id: number,
  title?: string | null,
): string {
  return mediaType === "movie" ? moviePath(id, title) : seriesPath(id, title);
}
