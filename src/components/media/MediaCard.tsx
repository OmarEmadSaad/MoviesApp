import { memo } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/Image";
import { Rating } from "@/components/ui/Rating";
import { formatRating, formatYear, truncate } from "@/lib/format";
import { posterSrcSet, posterUrl } from "@/lib/tmdb/images";
import { mediaPath } from "@/lib/slug";
import type { MediaSummary, MediaType } from "@/types/tmdb";

export interface MediaCardProps {
  item: MediaSummary;
  mediaType: MediaType;

  priority?: boolean;

  showOverview?: boolean;
}

const SIZES = "(min-width: 1280px) 220px, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw";

export const MediaCard = memo(function MediaCard({
  item,
  mediaType,
  priority = false,
  showOverview = false,
}: MediaCardProps) {
  const title = item.title ?? item.name ?? item.original_name ?? "Untitled";
  const date = item.release_date ?? item.first_air_date;
  const year = formatYear(date);
  const href = mediaPath(mediaType, item.id, title);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg bg-gray-900 shadow-lg transition hover:shadow-light-blue-900/30">
      <Link
        to={href}

        tabIndex={-1}
        aria-hidden="true"
        className="block overflow-hidden"
      >
        <Image
          src={posterUrl(item.poster_path, 342)}
          srcSet={posterSrcSet(item.poster_path)}
          sizes={SIZES}
          alt=""
          aspect="poster"
          priority={priority}
          imgClassName="transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="text-base font-medium leading-snug text-white">
          <Link
            to={href}
            className="line-clamp-2 rounded transition hover:text-light-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
          >
            {title}
          </Link>
        </h3>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-gray-400">
            {year ? <span>{year}</span> : null}
            {year ? <span aria-hidden="true"> · </span> : null}
            <span>{formatRating(item.vote_average)}</span>
          </p>
          <Rating value={item.vote_average} size="sm" />
        </div>

        {showOverview && item.overview && (
          <p className="line-clamp-3 text-sm text-gray-400">
            {truncate(item.overview, 160)}
          </p>
        )}
      </div>
    </article>
  );
});
