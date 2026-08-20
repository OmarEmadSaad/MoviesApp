import type { Video } from "@/types/tmdb";

export function pickTrailer(videos: Video[] | undefined): Video | null {
  if (!videos?.length) return null;
  const youtube = videos.filter((video) => video.site === "YouTube");
  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ??
    youtube.find((video) => video.type === "Trailer") ??
    youtube.find((video) => video.type === "Teaser") ??
    null
  );
}
